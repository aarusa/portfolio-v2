export const DAY_MINUTES = 8 * 60;

export const jobs = [
  { id: "nails", name: "Nails and ears", minutes: 20 },
  { id: "bath", name: "Bath and tidy", minutes: 45 },
  { id: "full", name: "Full groom", minutes: 90 },
  { id: "double", name: "Double coat", minutes: 150 },
];

export function fit(used, jobMinutes, dayMinutes = DAY_MINUTES) {
  const next = used + jobMinutes;
  return {
    ok: next <= dayMinutes,
    used: Math.min(next, dayMinutes),
    over: Math.max(0, next - dayMinutes),
    left: Math.max(0, dayMinutes - used),
  };
}

export const fitSource = `function fit(used, jobMinutes, dayMinutes = 480) {
  const next = used + jobMinutes;
  return {
    ok: next <= dayMinutes,
    over: Math.max(0, next - dayMinutes),
    left: Math.max(0, dayMinutes - used),
  };
}`;
