import { useState } from "react";
import { generateDay } from "../lib/yam";

const avoids = [
  ["nuts", "Nuts"],
  ["dairy", "Dairy"],
  ["gluten", "Gluten"],
];

export function MealDay() {
  const [servings, setServings] = useState(2);
  const [mins, setMins] = useState(30);
  const [diet, setDiet] = useState("anything");
  const [avoid, setAvoid] = useState([]);
  const [plan, setPlan] = useState(null);

  function toggleAvoid(id) {
    setAvoid((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function onSubmit(event) {
    event.preventDefault();
    setPlan(generateDay({ servings: Number(servings), mins: Number(mins), diet, avoid }));
  }

  return (
    <div className="widget widget--meals">
      <form className="widget__panel widget__form" onSubmit={onSubmit}>
        <label>
          People
          <input type="number" min="1" max="8" value={servings} onChange={(event) => setServings(event.target.value)} />
        </label>
        <label>
          Minutes
          <select value={mins} onChange={(event) => setMins(Number(event.target.value))}>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={45}>45</option>
          </select>
        </label>
        <label>
          Diet
          <select value={diet} onChange={(event) => setDiet(event.target.value)}>
            <option value="anything">Anything</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="high-protein">High protein</option>
          </select>
        </label>
        <fieldset className="widget__checks">
          <legend>Leave out</legend>
          <div className="widget__check-row">
            {avoids.map(([id, label]) => (
              <label key={id} className="check">
                <input type="checkbox" checked={avoid.includes(id)} onChange={() => toggleAvoid(id)} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <button className="btn" type="submit">
          Plan the day
        </button>
      </form>

      {plan && !plan.ok ? (
        <p className="widget__status" role="status">
          {plan.message}
        </p>
      ) : null}

      {plan?.ok ? (
        <div className="meals" role="status">
          {plan.meals.map((meal) => (
            <article key={meal.slot}>
              <p>{meal.slot}</p>
              <h3>{meal.recipe.name}</h3>
              <p>
                {meal.recipe.mins} min · serves {plan.servings}
              </p>
              <p>{meal.recipe.note}</p>
              <p className="meals__ings">{meal.recipe.ingredients.join(" · ")}</p>
            </article>
          ))}
          <p className="widget__status meals__note">{plan.note}</p>
        </div>
      ) : null}
    </div>
  );
}
