export const site = {
  name: "Arusha Shahi",
  mark: "Arusha",
  role: "Software Engineer",
  title: "Arusha Shahi | Software Engineer",
  github: "https://github.com/aarusa",
  linkedin: "https://www.linkedin.com/in/arushashahi/",
};

export function pageTitle(page) {
  return page ? `${page} | ${site.title}` : site.title;
}
