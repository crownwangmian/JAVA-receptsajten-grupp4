import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRecipes } from "../services/recipes";
import ReceptLista from "./Receptlista";
import { categories } from "../data/categories";
import Header from './ui/Header.jsx'
import "./Startsida.css";
export default function Startsida() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();


  const normalize = (s) =>
    String(s || "").toLowerCase().replace(/drinkar?$/i, "").trim();


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
    return arr.map(normalize).filter(Boolean);
  };

  // 从 ?q= read
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q") || "");
  }, [location.search]);

  // pull data
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getRecipes()
      .then((data) => {
        if (mounted) {
          setRecipes(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Failed to load");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // counts：{ gin: 3, rom: 5, tequila: 2, vodka: 4, ... }
  const countsByCategory = useMemo(() => {
    const map = {};
    // inital 0
    for (const cat of categories) {
      const key = normalize(cat.dbCategory ?? cat.name);
      map[key] = 0;
    }
    // add
    for (const r of recipes) {
      const rcats = extractRecipeCats(r);
      for (const key of rcats) {
        if (map.hasOwnProperty(key)) map[key] += 1;
      }
    }
    return map;
  }, [recipes]);

  // key words
  const filtered = useMemo(() => {
    const byCat = recipes.filter((r) => {
      if (!selectedCategory) return true;
      const rcats = extractRecipeCats(r);
      return rcats.includes(normalize(selectedCategory));
    });

    const q = query.trim().toLowerCase();
    if (!q) return byCat;

    return byCat.filter((r) => {
      const title = (r.title || "").toLowerCase();
      const desc = (r.description || "").toLowerCase();
      const ings = (r.ingredients || [])
        .map((i) => (typeof i === "string" ? i : i?.name || ""))
        .join(" ")
        .toLowerCase();
      return title.includes(q) || desc.includes(q) || ings.includes(q);
    });
  }, [recipes, selectedCategory, query]);

  return (
    <div className="drink-app">
      {/* <header className={styles['hero']}>
        <img src="hero.jpg" alt="Drink hero background" />

        <Link className={styles['hero-home']} to="/">Hem</Link>

        <div className={styles['hero-search']}>
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={(val) => {
              const v = (val || "").trim();
              navigate(v ? `/?q=${encodeURIComponent(v)}` : "/");
            }}
            placeholder="Sök recept eller ingrediens…"
          />
        </div>

        <div className={styles['hero-text']}>
          <h1>Drinkrecept</h1>
          <h5>Dina favoritdrinkar samlade på ett ställe</h5>
        </div>

        <nav className={styles['hero-nav']}>
          {categories.map((cat) => {
            const key = normalize(cat.dbCategory ?? cat.name);
            return (
              <Categorybutton
                key={cat.name}
                name={cat.name}
                isActive={selectedCategory === cat.dbCategory}
                count={countsByCategory[key] || 0}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.dbCategory ? null : cat.dbCategory
                  )
                }
              />
            );
          })}
        </nav>
      </header> */}
      <Header query={query} setQuery={setQuery} navigate={navigate} />
      <section className="drink-list">
        {loading && <div style={{ padding: 16 }}>Loading recipes…</div>}

        {!loading && error && (
          <div style={{ padding: 16, color: "crimson" }}>
            Kunde inte kontakta databasen: {String(error)}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="no-result">Inga recept i databasen.</p>
        )}

        {!loading &&
          !error &&
          filtered.length > 0 &&
          filtered.map((recipe, i) => (
            <ReceptLista
              key={recipe._id || recipe.id || recipe.title || i}
              recipe={recipe}
              index={i}
            />
          ))}
      </section>
    </div>
  );
}
