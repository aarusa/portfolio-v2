import { useMemo, useState } from "react";
import { recipes, reportIngredients } from "../lib/yam";

export function Pantry() {
  const [selected, setSelected] = useState(["chicken-bowl", "salmon"]);

  function toggle(id) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  const chosen = recipes.filter((recipe) => selected.includes(recipe.id));
  const rows = useMemo(() => reportIngredients(chosen), [chosen]);
  const shared = rows.filter((row) => row.count > 1).length;

  return (
    <div className="widget pantry">
      <ul className="pantry__recipes">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <label className="check">
              <input type="checkbox" checked={selected.includes(recipe.id)} onChange={() => toggle(recipe.id)} />
              <span>
                <strong>{recipe.name}</strong>
                <small>
                  {recipe.slot} · {recipe.mins} min
                </small>
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div>
        <p className="widget__stat">
          {shared} shared
          <span>{rows.length} ingredients on the list</span>
        </p>
        <ul className="pantry__ings">
          {rows.map((row) => (
            <li key={row.name} className={row.count > 1 ? "is-shared" : ""}>
              {row.name}
              <span>×{row.count}</span>
            </li>
          ))}
        </ul>
        {!rows.length ? <p className="widget__note">Tick at least one recipe.</p> : null}
      </div>
    </div>
  );
}
