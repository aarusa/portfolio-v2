import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";
import { getLabItem } from "../data/lab";
import { pageTitle } from "../data/site";
import { Dayload } from "../widgets/Dayload";
import { Pantry } from "../widgets/Pantry";

const bodies = {
  dayload: {
    paragraphs: [
      "A grooming day is eight hours, four hundred and eighty minutes. Each button is a service with a duration that does not negotiate. The bar grows by those minutes. When the remainder is smaller than the job, the day says no.",
      "The useful readout is the sentence under the bar: whether a double coat still fits. That is the question a groomer actually has, and it is answered by the function in the snippet.",
    ],
    node: <Dayload />,
  },
  pantry: {
    paragraphs: [
      "Tick the recipes you would cook. Ingredients that appear twice light up. The count is the plan: fewer unique items, more repeated ones, a smaller bag to carry home.",
      "YAM’s generator uses this same count to choose a day. Here the generator is switched off so you can push the score around yourself.",
    ],
    node: <Pantry />,
  },
  rinse: {
    paragraphs: [
      "The brush travels the tub. The mud is a span that moves each pass. Rinse while the brush is over it. Eight passes, then a score.",
      "I built it as a study of a single confirmation at a wet table — one control, one moment — and kept the toy when the study was done.",
    ],
  },
  range: {
    paragraphs: [
      "You get a sentence and you guess a calorie. A small lab estimator answers with a band, and you score if your guess sits inside it. It assumes 70 kg. Burnit’s own calculator, on the project page, works from kilometres and steps.",
      "An exact hit on the midpoint is not extra credit. The band is the claim.",
    ],
  },
};

const kindLabel = {
  experiment: "Experiment",
  game: "Game",
};

export function LabPage() {
  const { slug } = useParams();
  const item = getLabItem(slug);

  useEffect(() => {
    document.title = item ? pageTitle(item.name) : pageTitle("Labs");
  }, [item]);

  if (!item) {
    return (
      <div className="missing">
        <h1>That is not in the lab.</h1>
        <Link to="/lab">Back to the labs</Link>
      </div>
    );
  }

  const body = bodies[item.slug];
  const isGame = item.kind === "game";

  return (
    <article className="lab-item">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/lab">Labs</Link>
        <span aria-hidden="true">/</span>
        <span>{kindLabel[item.kind]}</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{item.name}</span>
      </nav>

      <header className="lab-item__head">
        <h1>{item.name}</h1>
        <p className="lede">{item.dek}</p>
      </header>

      <div className="lab-item__body">
        <div className="prose">
          {body.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {isGame ? (
          <p className="lab-item__play">
            <Link className="btn" to={`/lab/${item.slug}/play`}>
              Play game
            </Link>
          </p>
        ) : (
          <div className="lab-item__tool">{body.node}</div>
        )}

        {item.code ? <CodeBlock code={item.code} label={item.codeLabel} /> : null}

        {item.github ? (
          <p className="lab-item__link">
            <a href={item.github} target="_blank" rel="noreferrer">
              More on GitHub
            </a>
            <span>The profile, not a pretend repository.</span>
          </p>
        ) : null}
      </div>
    </article>
  );
}
