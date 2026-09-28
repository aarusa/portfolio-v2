import { useState } from "react";
import { caloriesFromDistance, caloriesFromSteps, distanceForCalories } from "../lib/burn";

function formatKm(km) {
  return `${km.toFixed(km >= 10 ? 1 : 2)} km`;
}

export function BurnLog() {
  const [intent, setIntent] = useState("moved");
  const [mode, setMode] = useState("walk");
  const [unit, setUnit] = useState("km");
  const [amount, setAmount] = useState("5");
  const [target, setTarget] = useState("300");
  const [kg, setKg] = useState(70);
  const [result, setResult] = useState(null);

  function onSubmit(event) {
    event.preventDefault();
    if (intent === "need") {
      const kcal = Number(target);
      if (!Number.isFinite(kcal) || kcal <= 0) return;
      setResult({ intent, plans: distanceForCalories({ kcal, kg: Number(kg) }), kcal });
      return;
    }
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    const burned =
      unit === "steps"
        ? caloriesFromSteps({ mode, steps: value, kg: Number(kg) })
        : caloriesFromDistance({ mode, km: value, kg: Number(kg) });
    setResult({ intent, mode, unit, burned });
  }

  return (
    <div className="widget widget--burn">
      <div className="segment" role="group" aria-label="What to calculate">
        <button type="button" aria-pressed={intent === "moved"} onClick={() => setIntent("moved")}>
          I walked or ran
        </button>
        <button type="button" aria-pressed={intent === "need"} onClick={() => setIntent("need")}>
          I need to burn
        </button>
      </div>

      <form className="widget__panel widget__form" onSubmit={onSubmit}>
        {intent === "moved" ? (
          <>
            <label>
              How
              <select value={mode} onChange={(event) => setMode(event.target.value)}>
                <option value="walk">Walk</option>
                <option value="run">Run</option>
              </select>
            </label>
            <label>
              Counted by
              <select value={unit} onChange={(event) => setUnit(event.target.value)}>
                <option value="km">Kilometres</option>
                <option value="steps">Steps</option>
              </select>
            </label>
            <label>
              {unit === "km" ? "Kilometres" : "Steps"}
              <input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </label>
          </>
        ) : (
          <label>
            Calories to burn
            <input inputMode="numeric" value={target} onChange={(event) => setTarget(event.target.value)} />
          </label>
        )}
        <label className="widget__range">
          Body weight · {kg} kg
          <input type="range" min="45" max="140" value={kg} onChange={(event) => setKg(Number(event.target.value))} />
        </label>
        <button className="btn" type="submit">
          Calculate
        </button>
      </form>

      {result?.intent === "moved" ? (
        <div className="widget__panel range-read" role="status">
          <p className="range-read__num">
            {result.burned.low}–{result.burned.high}
            <span>kcal · {result.mode}</span>
          </p>
          <p className="range-read__meta">
            {formatKm(result.burned.km)} · {result.burned.steps.toLocaleString()} steps · {kg} kg
          </p>
        </div>
      ) : null}

      {result?.intent === "need" ? (
        <div className="need-grid" role="status">
          {result.plans.map((plan) => (
            <article key={plan.mode}>
              <p>{plan.mode}</p>
              <h3>{formatKm(plan.km)}</h3>
              <p>{plan.steps.toLocaleString()} steps</p>
            </article>
          ))}
          <p className="widget__status">
            To burn about {result.kcal} kcal at {kg} kg.
          </p>
        </div>
      ) : null}
    </div>
  );
}
