import { useEffect } from "react";
import { Link } from "react-router-dom";
import { pageTitle } from "../data/site";

export function NotFound() {
  useEffect(() => {
    document.title = pageTitle("Missing");
  }, []);

  return (
    <div className="missing">
      <h1>Missing.</h1>
      <Link to="/">Back to the projects</Link>
    </div>
  );
}
