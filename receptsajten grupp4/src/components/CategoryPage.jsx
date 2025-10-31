// src/components/CategoryPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipes } from "../services/recipes";
import ReceptLista from "./Receptlista";
import { categories as CATEGORY_META } from "../data/categories";
import "./Startsida.css";
import SearchBar from "./ui/SearchBar.jsx";
import CategoryButton from "./categorybutton.jsx";
import Header from "./ui/Header.jsx";
export default function CategoryPage() {
  const { categoryId } = useParams(); // e.g. "gin", "rom", "tequila", "vodka"

  // data state
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // local search state (category-scoped)
  const [query, setQuery] = useState("");

  // ---- utils: normalize & extract categories from a recipe ----
  const norm = (s) =>
    String(s || "").toLowerCase().replace(/drinkar?$/i, "").trim();

  // supports ["Gin"], [{name:"Gin"}], recipe.category, recipe.tags
  const extractRecipeCats = (r) => {
    if (!r) return [];
    const raw = r.categories ?? r.category ?? r.tags ?? [];
    let arr = [];
    if (Array.isArray(raw)) {
      arr = raw.map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          return item.name || item.title || item.label || item.id || "";
        }
        return "";
      });
    } else if (typeof raw === "string") {
      arr = [raw];
    }
    return arr.map(norm).filter(Boolean);
  };

  // Map route param ("gin") -> backend key via CATEGORY_META
  const dbCategory = useMemo(() => {
    const id = norm(categoryId || "");
    const found = CATEGORY_META.find(
      (c) =>
        norm(c.dbCategory).includes(id) ||
        norm(c.name).startsWith(id)
    );
    // retuen
    return found?.dbCategory || categoryId || "";
  }, [categoryId]);

  // Fetch all recipes once
  useEffect(() => {
    let alive = true;
    setLoading(true);
    getRecipes()
      .then((data) => alive && setRecipes(Array.isArray(data) ? data : []))
      .catch((e) => alive && setError(e.message || "Failed to load"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // ---- counts for each category button (shown in the header nav) ----
  // Build a map like { gin: 3, rom: 5, tequila: 2, vodka: 4 }
  const countsByCategory = useMemo(() => {
    const map = {};
    // init keys with 0 using CATEGORY_META
    for (const cat of CATEGORY_META) {
      const key = norm(cat.dbCategory ?? cat.name);
      map[key] = 0;
    }
    // accumulate from recipes
    for (const r of recipes) {
      const rcats = extractRecipeCats(r); // normalized array
      for (const key of rcats) {
        if (map.hasOwnProperty(key)) map[key] += 1;
      }
    }
    return map;
  }, [recipes]);

  // Filter by current category (from route), then by local query
  const selectedKey = norm(categoryId);
  const filtered = useMemo(() => {
    const base = recipes.filter((r) => extractRecipeCats(r).includes(selectedKey));
    const q = query.trim().toLowerCase();
    if (!q) return base;

    return base.filter((r) => {
      const title = (r.title || "").toLowerCase();
      const desc = (r.description || "").toLowerCase();
      const ings = (r.ingredients || [])
        .map((i) => (typeof i === "string" ? i : i?.name || ""))
        .join(" ")
        .toLowerCase();
      return title.includes(q) || desc.includes(q) || ings.includes(q);
    });
  }, [recipes, selectedKey, query]);

  if (loading) return <div style={{ padding: 16 }}>Loading recipes…</div>;
  if (error) return <div style={{ padding: 16, color: "crimson" }}>Error: {error}</div>;

  const prettyTitle =
    CATEGORY_META.find((c) => norm(c.dbCategory) === selectedKey)?.name ||
    `${categoryId}-drinkar`;

  return (
    <div className="drink-app">
      {/* <header className="hero" style={{ minHeight: 120 }}>
        <img src="/hero.jpg" alt="header" />
        <Link className="hero-home" to="/">
          Hem
        </Link>

        <div style={{ position: "absolute", top: 10, right: 20, zIndex: 6 }}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Sök i denna kategori…"
          />
        </div>

        <div className="hero-text">
          <h1 style={{ textTransform: "capitalize" }}>{prettyTitle}</h1>
        </div>

        <nav>
          {CATEGORY_META.map((cat) => {
            const id = norm(cat.dbCategory || cat.name); // "gin"/"rom"/"tequila"/"vodka"
            return (
              <CategoryButton
                key={cat.name}
                name={cat.name}
                isActive={selectedKey === id}
                count={countsByCategory[id] || 0}   // ←
              />
            );
          })}
        </nav>
      </header> */}

      <Header query={query} setQuery={setQuery} />

      <section className="drink-list">
        {filtered.map((recipe, i) => (
          <ReceptLista
            key={recipe._id || recipe.id || recipe.title || i}
            recipe={recipe}
            index={i}
          />
        ))}

        {filtered.length === 0 && (
          <p className="no-result">Inga recept i kategorin “{categoryId}”.</p>
        )}
      </section>
    </div>
  );
}
