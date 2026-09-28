import { useState } from "react";
import { readSession } from "../lib/burn";

const ROUNDS = [
  "Easy run, 30 minutes",
  "Hard run, 20 minutes",
  "Easy walk, 40 minutes",
  "Moderate cycle, 45 minutes",
  "Hard rowing, 15 minutes",
  "Easy lifting, 40 minutes",
  "Hard HIIT, 20 minutes",
  "Moderate run, 50 minutes",
];

export function RangeGame() {
  const [step, setStep] = useState(0);
  const [guess, setGuess] = useState("");
  const [hits, setHits] = useState(0);
  const [reveal, setReveal] = useState(null);
  const [done, setDone] = useState(false);

  const prompt = ROUNDS[step];

  function submit(event) {
    event.preventDefault();
    const value = Number(guess);
    if (!Number.isFinite(value) || value <= 0) return;
    const result = readSession(prompt, 70);
    if (!result.ok) return;
    const inside = value >= result.range.low && value <= result.range.high;
    setReveal({ value, inside, ...result });
    if (inside) setHits((current) => current + 1);
  }

  function next() {
    if (step + 1 >= ROUNDS.length) {
      setDone(true);
      return;
    }
    setStep((current) => current + 1);
    setGuess("");
    setReveal(null);
  }

  function restart() {
    setStep(0);
    setGuess("");
    setHits(0);
    setReveal(null);
    setDone(false);
  }

  if (done) {
    return (
      <div className="game">
        <p className="range-read__num">
          {hits}
          <span>of {ROUNDS.length} inside the band</span>
        </p>
        <button className="btn" type="button" onClick={restart}>
          Play again
        </button>
      </div>
    );
  }

  return (
    <div className="game">
      <p className="game__kicker">
        Round {step + 1} of {ROUNDS.length} · assumed 70 kg
      </p>
      <p className="game__prompt">{prompt}</p>
      <form className="widget__form" onSubmit={submit}>
        <label>
          Your guess, kcal
          <input
            inputMode="numeric"
            value={guess}
            onChange={(event) => setGuess(event.target.value)}
            disabled={Boolean(reveal)}
          />
        </label>
        {!reveal ? (
          <button className="btn" type="submit">
            Check
          </button>
        ) : (
          <button className="btn" type="button" onClick={next}>
            {step + 1 === ROUNDS.length ? "See score" : "Next session"}
          </button>
        )}
      </form>
      {reveal ? (
        <p className="widget__note" role="status">
          {reveal.inside ? "Inside the band." : "Outside the band."} The model read {reveal.reading} and answered {reveal.range.low}–{reveal.range.high}.
        </p>
      ) : null}
    </div>
  );
}
