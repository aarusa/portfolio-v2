import { fitSource } from "../lib/dayload";
import { overlapSource } from "../lib/yam";

export const labItems = [
  {
    slug: "dayload",
    kind: "experiment",
    name: "Dayload",
    line: "Fill a groomer’s day until the long job no longer fits.",
    dek: "An eight-hour desk with honest service lengths. Book until a double coat is refused. The rule on the page is the rule in the snippet.",
    year: "2026",
    code: fitSource,
    codeLabel: "fit — src/lib/dayload.js",
    github: "https://github.com/aarusa",
  },
  {
    slug: "pantry",
    kind: "experiment",
    name: "Pantry",
    line: "See which ingredients a set of recipes actually shares.",
    dek: "Pick meals and watch the shopping list split into things you buy once and things you buy twice. Overlap is the whole experiment.",
    year: "2026",
    code: overlapSource,
    codeLabel: "sharedIngredients — src/lib/yam.js",
    github: "https://github.com/aarusa",
  },
  {
    slug: "rinse",
    kind: "game",
    name: "Rinse",
    line: "A one-button timing toy for a wet table.",
    dek: "The brush crosses a muddy span. Rinse while it is over the coat. Built while thinking about one-handed confirmation, then kept because it is a game.",
    year: "2026",
  },
  {
    slug: "range",
    kind: "game",
    name: "Range",
    line: "Guess the calorie. Score the band, not the digit.",
    dek: "Eight sessions, described in a sentence. You name a number and score if it lands inside the band. A lab game, separate from Burnit’s distance calculator.",
    year: "2026",
  },
];

export function getLabItem(slug) {
  return labItems.find((item) => item.slug === slug);
}
