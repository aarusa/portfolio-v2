import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Poster } from "../components/Posters";
import { getProject, nextProject } from "../data/projects";
import { pageTitle } from "../data/site";
import { BookingDesk } from "../widgets/BookingDesk";
import { BurnLog } from "../widgets/BurnLog";
import { MealDay } from "../widgets/MealDay";
import { RankDesk } from "../widgets/RankDesk";

const tools = {
  pupsplash: {
    title: "Book a dog",
    text: "Pick a client, their dog, and a service, then book the appointment. The day fills with what you put on it.",
    node: <BookingDesk />,
  },
  yam: {
    title: "Plan one day",
    text: "Set the clock, the diet, and what you will not cook. The day that comes back is the one with the most shared ingredients, or a clear refusal.",
    node: <MealDay />,
  },
  burnit: {
    title: "Count the burn",
    text: "Enter the kilometres or the steps you walked or ran. Or enter the calories you still need, and read the distance back.",
    node: <BurnLog />,
  },
  swifthire: {
    title: "Rank a pile",
    text: "Post the job, add the people who applied, and sort the resumes against the role.",
    node: <RankDesk />,
  },
};

export function ProjectPage() {
  const { slug } = useParams();
  const project = getProject(slug);

  useEffect(() => {
    document.title = project ? pageTitle(project.name) : pageTitle("Projects");
  }, [project]);

  if (!project) {
    return (
      <div className="missing">
        <h1>That project is not here.</h1>
        <Link to="/">Back to the work</Link>
      </div>
    );
  }

  const tool = tools[project.slug];
  const next = nextProject(project.slug);

  return (
    <article className="case">
      <header className="case__head">
        <p className="kicker">
          <Link to="/projects">Projects</Link> / {project.index} / {project.kind}
        </p>
        <h1>{project.name}</h1>
        <p className="case__line">{project.line}</p>
        <p className="case__dek">{project.dek}</p>
        <ul className="case__facts">
          {project.facts.map(([label, value]) => (
            <li key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </li>
          ))}
        </ul>
      </header>

      <figure className="case__figure">
        <Poster name={project.poster} />
      </figure>

      <div className="case__body">
        {project.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>

      <section className="try" id="try">
        <header className="try__intro">
          <p className="try__badge">Working model · not the live product</p>
          <p className="kicker">Try it here</p>
          <h2>{tool.title}</h2>
          <p>{tool.text}</p>
        </header>
        {tool.node}
      </section>

      <Link className="nextproj" to={`/projects/${next.slug}`}>
        <span>Next</span>
        <strong>{next.name}</strong>
      </Link>
    </article>
  );
}
