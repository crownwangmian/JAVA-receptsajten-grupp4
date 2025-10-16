import React, { useState, useEffect, useMemo } from "react";
import { getRecipes } from "../services/recipes";
import ReceptLista from "./Receptlista";
import "./Startsida.css";
import Categorybutton from "./categorybutton";
import { categories } from "../data/categories";
import SearchBar from "./ui/SearchBar";

export default function Startsida() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getRecipes()
      .then((data) => {
        if (mounted) setRecipes(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        if (mounted) setError(err.message || "Failed to load");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      // 先按分类过滤
      if (
        selectedCategory &&
        !recipe?.categories?.includes(selectedCategory)
      ) {
        return false;
      }
      if (!q) return true;
      // 再按搜索词过滤（标题/描述/配料）
      const title = (recipe.title || "").toLowerCase();
      const desc = (recipe.description || "").toLowerCase();
      const ings = (recipe.ingredients || [])
        .map((i) => (typeof i === "string" ? i : i?.name || ""))
        .join(" ")
        .toLowerCase();
      return (
        title.includes(q) ||
        desc.includes(q) ||
        ings.includes(q)
      );
    });
  }, [recipes, selectedCategory, query]);

  if (loading) return <div>Loading recipes…</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="drink-app">
      <header className="hero">
        <img src="hero.jpg" alt="Drink hero background" />
        <a className="hero-home" href="/">
          Hem
        </a>

        {/* 右上角搜索框 */}
        <div className="hero-search">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Sök recept eller ingrediens…"
          />
        </div>

        <div className="hero-text">
          <h1>Drinkrecept</h1>
          <nav>
            {categories.map((cat) => (
              <Categorybutton
                key={cat.name}
                name={cat.name}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.dbCategory ? null : cat.dbCategory
                  )
                }
                isActive={selectedCategory === cat.dbCategory}
              />
            ))}
          </nav>
        </div>
      </header>

      <section className="drink-list">
        {filtered.map((recipe, i) => (
          <ReceptLista key={recipe.title || recipe._id} recipe={recipe} index={i} />
        ))}
        {filtered.length === 0 && (
          <p className="no-result">Inga recept matchar din sökning.</p>
        )}
      </section>
    </div>
  );
}
