export const recipes = [
  {
    id: "oats",
    name: "Oats, yogurt, berries",
    slot: "breakfast",
    mins: 10,
    diets: ["vegetarian"],
    avoid: ["dairy"],
    ingredients: ["oats", "yogurt", "berries", "honey"],
    note: "Ten minutes, one bowl, no stove decision.",
  },
  {
    id: "eggs",
    name: "Eggs and greens",
    slot: "breakfast",
    mins: 15,
    diets: ["high-protein"],
    avoid: [],
    ingredients: ["eggs", "greens", "chili", "olive oil"],
    note: "Protein without a recipe you have to follow.",
  },
  {
    id: "tofu-scramble",
    name: "Tofu scramble",
    slot: "breakfast",
    mins: 20,
    diets: ["vegetarian", "high-protein"],
    avoid: [],
    ingredients: ["tofu", "greens", "chili", "olive oil"],
    note: "The greens from dinner can start the next morning.",
  },
  {
    id: "banana-oats",
    name: "Banana oats",
    slot: "breakfast",
    mins: 8,
    diets: ["vegetarian"],
    avoid: [],
    ingredients: ["oats", "banana", "honey"],
    note: "The short breakfast, when the clock is the real constraint.",
  },
  {
    id: "chicken-bowl",
    name: "Chicken, rice, herbs",
    slot: "lunch",
    mins: 30,
    diets: ["high-protein"],
    avoid: [],
    ingredients: ["chicken", "rice", "herbs", "lemon", "greens"],
    note: "One pot of rice covers lunch and can anchor dinner.",
  },
  {
    id: "lentils",
    name: "Lentils, lemon, herbs",
    slot: "lunch",
    mins: 35,
    diets: ["vegetarian", "high-protein"],
    avoid: [],
    ingredients: ["lentils", "onion", "herbs", "lemon", "greens"],
    note: "A pot that tastes better after it sits.",
  },
  {
    id: "peanut-noodles",
    name: "Peanut noodles",
    slot: "lunch",
    mins: 20,
    diets: ["vegetarian"],
    avoid: ["nuts", "gluten"],
    ingredients: ["noodles", "peanut", "greens", "chili"],
    note: "Fast, and the first thing to drop if nuts or gluten are out.",
  },
  {
    id: "salmon",
    name: "Salmon, potatoes, herbs",
    slot: "dinner",
    mins: 30,
    diets: ["high-protein"],
    avoid: [],
    ingredients: ["salmon", "potatoes", "herbs", "lemon"],
    note: "A proper plate that still shares the herb bunch with lunch.",
  },
  {
    id: "chickpeas",
    name: "Chickpeas and tomato",
    slot: "dinner",
    mins: 25,
    diets: ["vegetarian"],
    avoid: [],
    ingredients: ["chickpeas", "tomato", "onion", "herbs", "lemon"],
    note: "Pantry dinner. The lemon is the part worth buying fresh.",
  },
  {
    id: "tofu-rice",
    name: "Tofu, rice, chili",
    slot: "dinner",
    mins: 20,
    diets: ["vegetarian", "high-protein"],
    avoid: [],
    ingredients: ["tofu", "rice", "greens", "chili"],
    note: "Uses the tofu and the rice you already started.",
  },
  {
    id: "omelette",
    name: "Herb omelette",
    slot: "dinner",
    mins: 15,
    diets: ["high-protein"],
    avoid: [],
    ingredients: ["eggs", "herbs", "greens", "olive oil"],
    note: "Dinner when the day ran long and the herbs should not die in the drawer.",
  },
];

function allowed(recipe, { mins, diet, avoid }) {
  if (recipe.mins > mins) return false;
  if (diet !== "anything" && !recipe.diets.includes(diet)) return false;
  if (recipe.avoid.some((item) => avoid.includes(item))) return false;
  return true;
}

export function reportIngredients(list) {
  const counts = new Map();
  list.forEach((recipe) => {
    recipe.ingredients.forEach((item) => counts.set(item, (counts.get(item) || 0) + 1));
  });
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function sharedIngredients(meals) {
  return reportIngredients(meals)
    .filter((item) => item.count > 1)
    .map((item) => item.name);
}

export function generateDay({ servings, mins, diet, avoid }) {
  const pool = recipes.filter((recipe) => allowed(recipe, { mins, diet, avoid }));
  const breakfasts = pool.filter((recipe) => recipe.slot === "breakfast");
  const lunches = pool.filter((recipe) => recipe.slot === "lunch");
  const dinners = pool.filter((recipe) => recipe.slot === "dinner");

  const gaps = [];
  if (!breakfasts.length) gaps.push("breakfast");
  if (!lunches.length) gaps.push("lunch");
  if (!dinners.length) gaps.push("dinner");
  if (gaps.length) {
    return {
      ok: false,
      gaps,
      message: `Nothing fits ${gaps.join(" and ")} once the clock, the diet, and the exclusions are all applied. Loosen one of them.`,
    };
  }

  let best = null;
  breakfasts.forEach((breakfast) => {
    lunches.forEach((lunch) => {
      dinners.forEach((dinner) => {
        const meals = [breakfast, lunch, dinner];
        const shared = sharedIngredients(meals);
        const totalMins = breakfast.mins + lunch.mins + dinner.mins;
        const score = shared.length * 10 - totalMins / 30;
        if (!best || score > best.score) best = { meals, shared, score };
      });
    });
  });

  const [breakfast, lunch, dinner] = best.meals;
  const sharedText = best.shared.length
    ? `${best.shared.join(", ")} show up more than once, so the shop is smaller than three separate recipes.`
    : "These three barely share a shopping list. If you have another ten minutes, a looser clock usually finds overlap.";

  return {
    ok: true,
    servings,
    meals: [
      { slot: "Breakfast", recipe: breakfast },
      { slot: "Lunch", recipe: lunch },
      { slot: "Dinner", recipe: dinner },
    ],
    shared: best.shared,
    note: sharedText,
  };
}

export const overlapSource = `function sharedIngredients(meals) {
  const counts = new Map();
  meals.forEach((recipe) => {
    recipe.ingredients.forEach((item) => {
      counts.set(item, (counts.get(item) || 0) + 1);
    });
  });
  return [...counts.entries()].filter(([, count]) => count > 1);
}`;
