import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Poster } from "../components/Posters";
import { featuredProjects } from "../data/projects";
import { pageTitle } from "../data/site";

const MOBILE_QUERY = "(max-width: 860px)";

export function Home() {
  const bandsRef = useRef([]);
  const frameRef = useRef(0);

  useEffect(() => {
    document.title = pageTitle();
    document.documentElement.classList.add("is-home");
    return () => document.documentElement.classList.remove("is-home");
  }, []);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);

    function clearTransforms() {
      bandsRef.current.filter(Boolean).forEach((band) => {
        band.style.transform = "";
        band.style.zIndex = "";
        band.style.pointerEvents = "";
      });
    }

    function paint() {
      frameRef.current = 0;
      if (media.matches) {
        clearTransforms();
        return;
      }

      const bands = bandsRef.current.filter(Boolean);
      if (!bands.length) return;

      const vh = window.innerHeight || 1;
      const max = Math.max(bands.length - 1, 0);
      const progress = Math.min(Math.max(window.scrollY / vh, 0), max);

      bands.forEach((band, index) => {
        const local = progress - index;
        let y = 0;

        if (local <= 0) {
          y = 0;
        } else if (local < 1) {
          y = -local * 100;
        } else {
          y = -100;
        }

        band.style.transform = `translate3d(0, ${y}%, 0)`;
        band.style.zIndex = String(bands.length - index);
        band.style.pointerEvents = local >= 1 || local < -0.02 ? "none" : "auto";
      });
    }

    function onScroll() {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(paint);
    }

    function onChange() {
      clearTransforms();
      paint();
    }

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    media.addEventListener("change", onChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      media.removeEventListener("change", onChange);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      clearTransforms();
    };
  }, []);

  return (
    <div className="home" style={{ "--home-panels": featuredProjects.length }}>
      <div className="home__scroller">
        <div className="home__stage">
          {featuredProjects.map((project, index) => (
            <article
              className={`band band--${project.slug}`}
              key={project.slug}
              ref={(node) => {
                bandsRef.current[index] = node;
              }}
            >
              <Link className="band__figure" to={`/projects/${project.slug}`} tabIndex={-1} aria-hidden="true">
                <Poster name={project.poster} orientation="portrait" />
              </Link>
              <div className="band__copy">
                <div className="band__top">
                  <p>
                    {project.index} / {project.kind}
                  </p>
                </div>
                <h2 className="band__title">
                  <Link to={`/projects/${project.slug}`}>{project.name}</Link>
                </h2>
                <p className="band__line">{project.line}</p>
                <p className="band__dek">{project.dek}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <section className="home__else" aria-label="Also on this site">
        <Link to="/blog">
          <span>Blog</span>
          <em>React deploys, OpenAI-compatible clients, and local Ollama.</em>
        </Link>
        <Link to="/lab">
          <span>Labs</span>
          <em>Experiments you can read. Games you can play.</em>
        </Link>
      </section>
    </div>
  );
}
