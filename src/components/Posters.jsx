const posters = {
  pupsplash: {
    src: "/posters/pupsplash.png",
    portrait: "/posters/pupsplash-portrait.png",
    label: "An open appointment book with one orange line, beside a black collar and an orange tag.",
  },
  yam: {
    src: "/posters/yam.png",
    portrait: "/posters/yam-portrait.png",
    label: "Four dishes: greens and egg, noodles, yogurt and fruit, and an omelette with orange.",
  },
  burnit: {
    src: "/posters/burnit.png",
    portrait: "/posters/burnit-portrait.png",
    label: "White walking shoes with orange laces, a black pedometer, and a route map with an orange path on mint paper.",
  },
  swifthire: {
    src: "/posters/swifthire.png",
    label: "Three stacked sheets. The top one is marked with an orange tab.",
  },
};

function publicUrl(path) {
  const base = import.meta.env.BASE_URL || "./";
  if (base === "./") return `.${path}`;
  const root = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${root}${path}`;
}

export function Poster({ name, orientation = "landscape" }) {
  const item = posters[name];
  if (!item) return null;
  const src = publicUrl(orientation === "portrait" && item.portrait ? item.portrait : item.src);

  return (
    <div className={`poster poster--bare poster--${name}`} role="img" aria-label={item.label}>
      <img className="poster__photo" src={src} alt="" />
    </div>
  );
}
