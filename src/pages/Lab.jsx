import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { labItems } from "../data/lab";
import { pageTitle } from "../data/site";

const filters = [
  { id: "all", label: "All" },
  { id: "experiment", label: "Experiments" },
  { id: "game", label: "Games" },
];

export function Lab() {
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    document.title = pageTitle("Labs");
  }, []);

  const visible = labItems.filter((item) => filter === "all" || item.kind === filter);

  return (
    <div className="lab">
      <header>
        <p className="kicker">Labs</p>
        <h1>Labs</h1>
        <p className="lede">
          Small models and two things you can play. Experiments explain themselves and show the code. Games start when you say play.
        </p>
        <div className="filters" role="tablist" aria-label="Filter the lab">
          {filters.map((item) => (
            <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      </header>
      <ul className="lab__list">
        {visible.map((item, index) => (
          <li key={item.slug}>
            <article className={`lab-card lab-card--${item.slug}`}>
              <p>
                <span>0{index + 1}</span>
                {item.kind}
              </p>
              <h2>
                <Link to={`/lab/${item.slug}`}>{item.name}</Link>
              </h2>
              <p>{item.line}</p>
              <Link className="textlink" to={item.kind === "game" ? `/lab/${item.slug}/play` : `/lab/${item.slug}`}>
                {item.kind === "game" ? "Play game" : "Open"}
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
