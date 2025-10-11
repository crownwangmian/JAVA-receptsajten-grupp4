import React, { useState, useEffect } from "react";
import { getRecipes } from "../services/recipes";
import "./Startsida.css";
import { categories } from "../data/categories";
import Categorybutton from "./categorybutton/categorybutton";
import ReceptLista from "./Receptlista";
import RecipeSearch from "./search/RecipeSearch.jsx";

export default function Startsida() {
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getRecipes()
      .then((data) => mounted && setRecipes(Array.isArray(data) ? data : []))
      .catch((err) => mounted && setError(err?.message || "Failed to load"))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="page-feedback">Loading recipes…</div>;
  if (error)   return <div className="page-feedback error">Error: {error}</div>;

  const filtered = recipes
    .filter(r => !selectedCategory || r?.categories?.includes(selectedCategory))
    .filter(r => {
      const text = `${r?.title ?? ""} ${r?.description ?? ""} ${
        Array.isArray(r?.ingredients) ? r.ingredients.join(" ") : ""
      }`.toLowerCase();
      return text.includes(query.toLowerCase());
    });

  const showNoResult = query.trim() !== "" && filtered.length === 0;

  return (
    <div className="drink-app">
      {/* Hero：宽度和内容区一致，保持原样 */}
      <header className="hero">
        <img src="hero.jpg" alt="Drink hero background" />
        <a className="hero-home" href="/">Hem</a>
        <div className="hero-text">
          <h1>Drinkrecept</h1>
          <nav className="cat-bar">
            {categories.map((cat) => (
              <Categorybutton
                key={cat.name}
                name={cat.name}
                isActive={selectedCategory === cat.dbCategory}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.dbCategory ? null : cat.dbCategory
                  )
                }
              />
            ))}
          </nav>
        </div>
      </header>

      <section className="search-section">
        <div className="search-wrap">
          <RecipeSearch value={query} onChange={setQuery} />
          {showNoResult && (
            <div className="noresult-pop" role="status" aria-live="polite">
              Vi hittade tyvärr inga träffar på den sökningen.
            </div>
          )}
        </div>
      </section>

      <main className="content">
        {!selectedDrink ? (
          filtered.length > 0 && (
            <section className="drink-list">
              {filtered.map((recipe, i) => (
                <ReceptLista
                  key={recipe.title || recipe._id || i}
                  recipe={recipe}
                  index={i}
                />
              ))}
            </section>
          )
        ) : (
          <section className="drink-detail">
            <button className="back" onClick={() => setSelectedDrink(null)}>
              ← Tillbaka
            </button>

            <h2>{selectedDrink?.name}</h2>
            {selectedDrink?.image && (
              <img src={selectedDrink.image} alt={selectedDrink.name} />
            )}

            <div className="recipe">
              <div>
                <h3>Ingredienser</h3>
                <ul>
                  {(selectedDrink?.ingredients ?? []).map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Instruktioner</h3>
                <ol>
                  {(selectedDrink?.instructions ?? []).map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="feedback">
              <h4>Vad tyckte du om receptet?</h4>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={s <= rating ? "active" : ""}
                    onClick={() => setRating(s)}
                  >★</span>
                ))}
              </div>
              <textarea
                placeholder="Lämna en kommentar"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button>Skicka</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
