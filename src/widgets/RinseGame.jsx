import { useEffect, useRef, useState } from "react";

const ROUNDS = 8;

export function RinseGame() {
  const [phase, setPhase] = useState("idle");
  const [pos, setPos] = useState(0);
  const [zone, setZone] = useState({ start: 40, width: 18 });
  const [round, setRound] = useState(1);
  const [hits, setHits] = useState(0);
  const [flash, setFlash] = useState("");
  const posRef = useRef(0);
  const dirRef = useRef(1);
  const zoneRef = useRef(zone);
  const roundRef = useRef(1);
  const liveRef = useRef(false);

  useEffect(() => {
    zoneRef.current = zone;
  }, [zone]);

  useEffect(() => {
    if (phase !== "play") return undefined;
    liveRef.current = true;
    let frame;
    let last = performance.now();

    const tick = (now) => {
      const delta = Math.min(32, now - last);
      last = now;
      const speed = 0.045 + roundRef.current * 0.008;
      let next = posRef.current + dirRef.current * speed * delta;
      if (next > 100) {
        next = 100;
        dirRef.current = -1;
      } else if (next < 0) {
        next = 0;
        dirRef.current = 1;
      }
      posRef.current = next;
      setPos(next);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      liveRef.current = false;
      cancelAnimationFrame(frame);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return undefined;
    const onKey = (event) => {
      if (event.code !== "Space" && event.code !== "Enter") return;
      if (event.target instanceof Element && event.target.closest("button, input, textarea, select, a")) return;
      event.preventDefault();
      rinse();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function nextZone() {
    const width = 16;
    const start = 8 + Math.random() * (84 - width);
    const value = { start, width };
    zoneRef.current = value;
    setZone(value);
  }

  function start() {
    posRef.current = 0;
    dirRef.current = 1;
    roundRef.current = 1;
    setPos(0);
    setRound(1);
    setHits(0);
    setFlash("");
    nextZone();
    setPhase("play");
  }

  function rinse() {
    if (!liveRef.current) return;
    const current = zoneRef.current;
    const hit = posRef.current >= current.start && posRef.current <= current.start + current.width;
    const nextHits = hits + (hit ? 1 : 0);
    const nextRound = roundRef.current + 1;
    setFlash(hit ? "On the coat." : "Missed the mud.");
    if (nextRound > ROUNDS) {
      setHits(nextHits);
      setPhase("done");
      return;
    }
    setHits(nextHits);
    roundRef.current = nextRound;
    setRound(nextRound);
    nextZone();
  }

  return (
    <div className="game">
      <div className="tub" aria-hidden="true">
        <span className="tub__mud" style={{ left: `${zone.start}%`, width: `${zone.width}%` }} />
        <span className="tub__brush" style={{ left: `${pos}%` }} />
      </div>
      <div className="game__bar">
        <p>
          {phase === "done" ? `You rinsed ${hits} of ${ROUNDS}.` : phase === "play" ? `Pass ${round} of ${ROUNDS}` : "Eight passes. Space or the button."}
        </p>
        <p className="game__flash" role="status">
          {flash}
        </p>
        {phase === "play" ? (
          <button className="btn" type="button" onClick={rinse}>
            Rinse
          </button>
        ) : (
          <button className="btn" type="button" onClick={start}>
            {phase === "done" ? "Play again" : "Play"}
          </button>
        )}
      </div>
    </div>
  );
}
