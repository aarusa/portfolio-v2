import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getLabItem } from "../data/lab";
import { RangeGame } from "../widgets/RangeGame";
import { RinseGame } from "../widgets/RinseGame";
import { pageTitle } from "../data/site";

const games = {
  rinse: RinseGame,
  range: RangeGame,
};

export function LabPlayPage() {
  const { slug } = useParams();
  const item = getLabItem(slug);
  const Game = games[slug];

  useEffect(() => {
    document.title = item ? pageTitle(`Play ${item.name}`) : pageTitle("Labs");
  }, [item]);

  if (!item || item.kind !== "game" || !Game) {
    return (
      <div className="missing">
        <h1>That game is not here.</h1>
        <Link to="/lab">Back to the labs</Link>
      </div>
    );
  }

  return (
    <article className="lab-play">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/lab">Labs</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/lab/${item.slug}`}>Game</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/lab/${item.slug}`}>{item.name}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Play</span>
      </nav>

      <header className="lab-play__head">
        <h1>{item.name}</h1>
        <p>{item.line}</p>
      </header>

      <div className="lab-play__stage">
        <Game />
      </div>

      <p className="lab-play__back">
        <Link to={`/lab/${item.slug}`}>Back to {item.name}</Link>
      </p>
    </article>
  );
}
