import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { site } from "../data/site";
import { ChatDock } from "./Chat";

const links = [
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/lab", label: "Labs" },
  { to: "/clone", label: "Clone" },
];

export function Layout() {
  const [open, setOpen] = useState(false);
  const [navAway, setNavAway] = useState(false);
  const location = useLocation();
  const openingProject = /^\/projects\/[^/]+$/.test(location.pathname);
  const lastY = useRef(0);
  const locked = useRef(false);

  useEffect(() => {
    setOpen(false);
    setNavAway(false);
    lastY.current = 0;
    if (location.hash) {
      const node = document.querySelector(location.hash);
      if (node) {
        node.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
  }, [open]);

  useEffect(() => {
    if (open) {
      setNavAway(false);
      return undefined;
    }

    lastY.current = window.scrollY;
    let frame = 0;

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (locked.current) return;

        const y = Math.max(0, window.scrollY);
        const delta = y - lastY.current;

        if (y < 48) {
          setNavAway(false);
        } else if (delta > 8) {
          setNavAway(true);
        } else if (delta < -8) {
          setNavAway(false);
          locked.current = true;
          window.setTimeout(() => {
            locked.current = false;
            lastY.current = window.scrollY;
          }, 420);
        }

        lastY.current = y;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [open, location.pathname]);

  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header className={`nav ${navAway ? "is-away" : ""}`}>
        <NavLink to="/" className="nav__mark" end>
          {site.mark}
        </NavLink>
        <button className="nav__toggle" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? "Close" : "Menu"}
        </button>
        <nav className={`nav__links ${open ? "is-open" : ""}`} aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main id="content">
        <div key={location.pathname} className={openingProject ? "route-stage route-stage--case" : "route-stage"}>
          <Outlet />
        </div>
      </main>
      <footer className="colophon">
        <p>{site.name}</p>
        <p>
          <a href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </p>
        <p>© {new Date().getFullYear()}</p>
      </footer>
      <ChatDock />
    </>
  );
}
