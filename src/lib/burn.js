const MODES = [
  { id: "run", words: ["running", "run", "ran", "jog", "jogging"] },
  { id: "walk", words: ["walking", "walk", "hike", "hiking"] },
  { id: "cycle", words: ["cycling", "cycle", "biking", "bike"] },
  { id: "row", words: ["rowing", "row", "erg"] },
  { id: "hiit", words: ["hiit", "intervals", "interval", "circuit"] },
  { id: "lift", words: ["lifting", "lift", "strength", "weights", "weight"] },
];

const MET = {
  run: { easy: 7, moderate: 9.5, hard: 11.5 },
  walk: { easy: 3, moderate: 3.8, hard: 5 },
  cycle: { easy: 6, moderate: 8, hard: 10 },
  row: { easy: 5, moderate: 7, hard: 8.5 },
  hiit: { easy: 8, moderate: 10.5, hard: 12.5 },
  lift: { easy: 3.5, moderate: 5, hard: 6 },
};

const MODE_LABEL = {
  run: "run",
  walk: "walk",
  cycle: "cycle",
  row: "row",
  hiit: "interval session",
  lift: "strength session",
};

export function parseSession(text) {
  const q = text.toLowerCase();
  const mode = MODES.find((item) => item.words.some((word) => new RegExp(`\\b${word}\\b`).test(q)))?.id ?? null;

  let minutes = null;
  const minuteMatch = q.match(/(\d+(?:\.\d+)?)\s*(minutes|minute|mins|min)\b/);
  const hourMatch = q.match(/(\d+(?:\.\d+)?)\s*(hours|hour|hrs|hr)\b/);
  if (minuteMatch) minutes = Math.round(Number(minuteMatch[1]));
  else if (hourMatch) minutes = Math.round(Number(hourMatch[1]) * 60);
  else if (mode === "run") {
    const distance = q.match(/(\d+(?:\.\d+)?)\s*k(?:m)?\b/);
    if (distance) minutes = Math.round(Number(distance[1]) * 6);
  }

  let effort = null;
  if (/\b(easy|light|slow|gentle|recovery)\b/.test(q)) effort = "easy";
  else if (/\b(hard|fast|heavy|intense|sprint|difficult)\b/.test(q)) effort = "hard";
  else if (/\b(moderate|steady|medium)\b/.test(q)) effort = "moderate";

  const missing = [];
  if (!mode) missing.push("what you did");
  if (!minutes) missing.push("how long it lasted");
  if (!effort) missing.push("how hard it felt");

  return { mode, minutes, effort, missing };
}

export function estimate({ mode, minutes, effort, kg }) {
  const met = MET[mode][effort];
  const mid = met * kg * (minutes / 60);
  const spread = mode === "lift" ? 0.32 : 0.15;
  return {
    low: Math.max(1, Math.round(mid * (1 - spread))),
    high: Math.round(mid * (1 + spread)),
    mid: Math.round(mid),
    met,
    spread,
  };
}

export function describeSession({ mode, minutes, effort, kg }) {
  return `${effort} ${MODE_LABEL[mode]}, ${minutes} minutes, ${kg} kg`;
}

export function readSession(text, kg) {
  const parsed = parseSession(text);
  if (parsed.missing.length) {
    return { ok: false, parsed, missing: parsed.missing };
  }
  const range = estimate({ ...parsed, kg });
  return {
    ok: true,
    parsed,
    range,
    reading: describeSession({ ...parsed, kg }),
  };
}

const PER_KM = { walk: 0.53, run: 1.03 };
const STRIDE_M = { walk: 0.762, run: 1.15 };

function band(mid) {
  const spread = 0.12;
  return {
    low: Math.max(1, Math.round(mid * (1 - spread))),
    high: Math.round(mid * (1 + spread)),
    mid: Math.round(mid),
  };
}

export function kmFromSteps(mode, steps) {
  return (steps * STRIDE_M[mode]) / 1000;
}

export function stepsFromKm(mode, km) {
  return Math.round((km * 1000) / STRIDE_M[mode]);
}

export function caloriesFromDistance({ mode, km, kg }) {
  return { km, steps: stepsFromKm(mode, km), ...band(PER_KM[mode] * kg * km) };
}

export function caloriesFromSteps({ mode, steps, kg }) {
  const km = kmFromSteps(mode, steps);
  return { ...caloriesFromDistance({ mode, km, kg }), steps };
}

export function distanceForCalories({ kcal, kg }) {
  return ["walk", "run"].map((mode) => {
    const km = kcal / (PER_KM[mode] * kg);
    return {
      mode,
      km,
      steps: stepsFromKm(mode, km),
    };
  });
}
