import { useState } from "react";

const stop = new Set(["the", "and", "for", "with", "who", "can", "you", "a", "an", "of", "to", "in", "on"]);

function tokens(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !stop.has(word));
}

function scoreResume(job, resume) {
  const wanted = new Set(tokens(job));
  const seen = tokens(resume);
  const hits = [...new Set(seen.filter((word) => wanted.has(word)))];
  return { hits, score: hits.length };
}

const seed = [
  { id: "noor", name: "Noor", resume: "Recruiter. Boolean search, SQL, high-volume hiring, stakeholder writing." },
  { id: "amina", name: "Amina", resume: "Recruiting operations, SQL, scheduling, and writing for hiring managers." },
  { id: "leo", name: "Leo", resume: "Frontend engineer. React, design systems, and component libraries." },
];

export function RankDesk() {
  const [job, setJob] = useState("Recruiter who can search, write, and use SQL");
  const [people, setPeople] = useState(seed);
  const [name, setName] = useState("");
  const [resume, setResume] = useState("");
  const [ranked, setRanked] = useState(null);

  function apply(event) {
    event.preventDefault();
    const person = name.trim();
    const text = resume.trim();
    if (!person || !text) return;
    setPeople((current) => [...current, { id: `${person}-${current.length}`, name: person, resume: text }]);
    setName("");
    setResume("");
    setRanked(null);
  }

  function rank(event) {
    event.preventDefault();
    const rows = people
      .map((person) => ({ ...person, ...scoreResume(job, person.resume) }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    setRanked(rows);
  }

  const rows = ranked || people.map((person) => ({ ...person, score: null, hits: [] }));

  return (
    <div className="widget widget--rank">
      <form className="widget__panel widget__form widget__form--stack" onSubmit={rank}>
        <label>
          Job the recruiter posted
          <textarea rows="3" value={job} onChange={(event) => setJob(event.target.value)} />
        </label>
        <button className="btn" type="submit">
          Rank applicants
        </button>
      </form>

      <form className="widget__panel widget__form" onSubmit={apply}>
        <label>
          Candidate
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="widget__grow">
          Resume, in a few lines
          <input value={resume} onChange={(event) => setResume(event.target.value)} />
        </label>
        <button className="btn btn--ghost" type="submit">
          Add application
        </button>
      </form>

      <ol className="rank-list">
        {rows.map((person, index) => (
          <li key={person.id} className={ranked && index === 0 ? "is-top" : undefined}>
            <span>{ranked ? String(index + 1).padStart(2, "0") : "—"}</span>
            <div>
              <div className="rank-list__head">
                <strong>{person.name}</strong>
                {ranked ? <em>{person.score} hits</em> : null}
              </div>
              <p>{person.resume}</p>
              {person.hits?.length ? <p className="rank-list__hits">{person.hits.join(" · ")}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
