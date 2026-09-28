import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

export function FitTitle({ as = "h2", text, to, className = "", maxVh }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const fit = () => {
      inner.style.fontSize = "20rem";
      const styles = getComputedStyle(outer);
      const pad = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      const available = outer.clientWidth - pad;
      const needed = inner.scrollWidth;
      if (!needed || available <= 0) return;
      const cap = maxVh != null ? (window.innerHeight * maxVh) / 100 : Infinity;
      const next = Math.max(40, Math.min(cap, ((320 * available) / needed) * 0.98));
      inner.style.fontSize = `${next}px`;
    };

    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [text, maxVh]);

  const Tag = as;
  const content = to ? (
    <Link to={to} ref={innerRef}>
      {text}
    </Link>
  ) : (
    <span ref={innerRef}>{text}</span>
  );

  return (
    <Tag className={`fit-title ${className}`} ref={outerRef}>
      {content}
    </Tag>
  );
}
