import { useMemo, useState } from "react";
import { DAY_MINUTES, fit, jobs } from "../lib/dayload";

export function Dayload() {
  const [booked, setBooked] = useState([]);
  const [message, setMessage] = useState("The day is empty. A double coat still fits.");
  const used = useMemo(() => booked.reduce((sum, job) => sum + job.minutes, 0), [booked]);

  function add(job) {
    const result = fit(used, job.minutes);
    if (!result.ok) {
      setMessage(`${job.name} needs ${job.minutes} minutes. ${result.left} are left, so the day refuses it.`);
      return;
    }
    const next = [...booked, { ...job, key: `${job.id}-${booked.length}` }];
    const nextUsed = used + job.minutes;
    const coat = fit(nextUsed, 150);
    setBooked(next);
    setMessage(
      coat.ok
        ? `${job.name} is in. A double coat still fits in the ${DAY_MINUTES - nextUsed} minutes left.`
        : `${job.name} is in. A double coat no longer fits today.`,
    );
  }

  return (
    <div className="widget">
      <div className="daybar" aria-hidden="true">
        {booked.map((job) => (
          <span key={job.key} style={{ flexGrow: job.minutes }}>
            {job.minutes}
          </span>
        ))}
        <span className="daybar__free" style={{ flexGrow: Math.max(DAY_MINUTES - used, 8) }} />
      </div>
      <p className="widget__stat">
        {used} / {DAY_MINUTES} min
        <span>{DAY_MINUTES - used} left</span>
      </p>
      <div className="widget__actions">
        {jobs.map((job) => (
          <button key={job.id} className="btn" type="button" onClick={() => add(job)}>
            {job.name}
            <small>{job.minutes} min</small>
          </button>
        ))}
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => {
            setBooked([]);
            setMessage("The day is empty. A double coat still fits.");
          }}
        >
          Clear
        </button>
      </div>
      <p className="widget__note" role="status">
        {message}
      </p>
    </div>
  );
}
