import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Poster } from "../components/Posters";
import { projects } from "../data/projects";
import { pageTitle } from "../data/site";

export function ProjectsIndex() {
  useEffect(() => {
    document.title = pageTitle("Projects");
  }, []);

  return (
    <div className="proj-index">
      <header>
        <p className="kicker">Projects</p>
        <h1>All of the work</h1>
      </header>
      <ol>
        {projects.map((project) => (
          <li key={project.slug}>
            <article className={`proj-row proj-row--${project.slug}`}>
              <Link to={`/projects/${project.slug}`} className="proj-row__figure" tabIndex={-1} aria-hidden="true">
                <Poster name={project.poster} />
              </Link>
              <div>
                <p>
                  {project.index} / {project.kind}
                </p>
                <h2>
                  <Link to={`/projects/${project.slug}`}>{project.name}</Link>
                </h2>
                <p>{project.dek}</p>
                <Link className="textlink" to={`/projects/${project.slug}`}>
                  Open project
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
