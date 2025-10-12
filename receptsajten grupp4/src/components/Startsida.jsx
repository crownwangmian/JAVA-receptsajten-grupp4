import React, { useEffect, useState } from "react";
import { getRecipes } from "../services/recipes";
import "./Startsida.css";
import { categories } from "../data/categories";
import Categorybutton from "./categorybutton/categorybutton";
import ReceptLista from "./Receptlista";
import RecipeSearch from "./search/RecipeSearch.jsx";

export default function Startsida() {
  // Detail / Category / Search
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");

  // Data
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Rating and comment (demo only)
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch data on mount
  useEffect(() => {
    let alive = true;
    setLoading(true);
    getRecipes()
      .then((data) => alive && setRecipes(Array.isArray(data) ? data : []))
      .catch((e) => alive && setError(e?.message || "Failed to load"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <div className="page-feedback">Loading recipes…</div>;
  if (error) return <div className="page-feedback error">Error: {error}</div>;

  // Filter by category + search keyword
  const filtered = recipes
    .filter(
      (r) => !selectedCategory || (r?.categories || []).includes(selectedCategory)
    )
    .filter((r) => {
      const ingText = Array.isArray(r?.ingredients)
        ? r.ingredients
            .map((it) => (typeof it === "string" ? it : it?.name ?? ""))
            .join(" ")
        : "";
      const text = `${r?.title ?? ""} ${r?.description ?? ""} ${ingText}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });

  const showNoResult = query.trim() !== "" && filtered.length === 0;

  return (
    <div className="drink-app">
      {/* === HERO SECTION === */}
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

      {/* === SEARCH SECTION === */}
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

      {/* === MAIN CONTENT: LIST or DETAIL === */}
      <main className="content">
        {!selectedDrink ? (
          // Always render drink-list to keep layout stable
          <section className="drink-list">
            {filtered.length > 0 ? (
              filtered.map((recipe, i) => (
                <ReceptLista
                  key={recipe.id ?? recipe.recipeId ?? recipe._id ?? recipe.title ?? i}
                  recipe={recipe}
                  index={i}
                  onClick={(r) => setSelectedDrink(r)} // Simple “navigation”
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-card">
                  <p>Vi hittade tyvärr inga träffar på den sökningen.</p>
                  <button className="btn" onClick={() => setQuery("")}>
                    Rensa sökning
                  </button>
                </div>
              </div>
            )}
          </section>
        ) : (
          // === Detail view ===
          <section className="drink-detail">
            <button className="back" onClick={() => setSelectedDrink(null)}>
              ← Tillbaka
            </button>

            <h2 className="detail-title">
              {selectedDrink.title ?? selectedDrink.name}
            </h2>

            {selectedDrink.imageUrl && (
              <img
                src={selectedDrink.imageUrl}
                alt={selectedDrink.title ?? selectedDrink.name}
                className="detail-cover"
              />
            )}

            {selectedDrink.description && (
              <>
                <h3>Beskrivning</h3>
                <p>{selectedDrink.description}</p>
              </>
            )}

            <div className="recipe">
              <div>
                <h3>Ingredienser</h3>
                <ul>
                  {(selectedDrink.ingredients || []).map((it, i) => {
                    if (typeof it === "string") return <li key={i}>{it}</li>;
                    const parts = [it?.amount, it?.unit, it?.name ?? it?.ingredient ?? ""]
                      .filter(Boolean)
                      .join(" ");
                    return <li key={i}>{parts}</li>;
                  })}
                </ul>
              </div>

              <div>
                <h3>Instruktioner</h3>
                {Array.isArray(selectedDrink.instructions) ? (
                  <ol>
                    {selectedDrink.instructions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                ) : selectedDrink.instructions ? (
                  <p className="whitespace-pre-line">{selectedDrink.instructions}</p>
                ) : (
                  <p>—</p>
                )}
              </div>
            </div>

            {/* Rating + comment demo */}
            <div className="feedback">
              <h4>Vad tyckte du om receptet?</h4>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={s <= rating ? "active" : ""}
                    onClick={() => setRating(s)}
                    role="button"
                  >
                    ★
                  </span>
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
