// src/components/Receptdetail.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRecipes } from "../services/recipes";
import SearchBar from "./ui/SearchBar.jsx";
import DifficultyBadge from "./ui/DifficultyBadge"; // 若没有可先删掉这行与下方组件
import "./Startsida.css"; // 你已有
import "./receptdetail.css"; // 👈 新增样式文件（第2步给出）

export default function Receptdetail() {
  const navigate = useNavigate();
  const { recipeId } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // feedback
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getRecipes()
      .then((data) => {
        if (!alive) return;
        const list = Array.isArray(data) ? data : [];
        const found = list.find((r) => String(r._id ?? r.id) === String(recipeId));
        setRecipe(found || null);
      })
      .catch((e) => alive && setError(e.message || "Failed to load"))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [recipeId]);

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (error)   return <div style={{ padding: 16, color: "crimson" }}>Error: {error}</div>;
  if (!recipe) return <div style={{ padding: 16 }}>Receptet hittades inte.</div>;

  // 展示字段准备
  const title = recipe.title || recipe.name || "Mojito";
  const img   = recipe.imageUrl || recipe.image || "/hero.jpg";
  const mins  = recipe.timeInMins ?? recipe.time ?? 0;
  const ings  = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const steps = Array.isArray(recipe.instructions) ? recipe.instructions : [];
  const diff  = recipe.difficulty || recipe.svårighetsgrad || "Mellan";
  const avg   = Number(recipe.avgRating ?? recipe.rating ?? 0);

  return (
    <div className="drink-app">
      {/* Frame 1：头部大图 + 搜索 + 标题 */}
      <header className="hero hero--detail">
        <img src="/hero.jpg" alt="header" />
        <Link className="hero-home" to="/">Hem</Link>

        <div className="hero-search">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={(val) => navigate(val ? `/?q=${encodeURIComponent(val)}` : "/")}
            placeholder="Sök recept eller ingrediens…"
          />
        </div>

        <div className="hero-text">
          <h1>{title}</h1>
        </div>
      </header>

      {/* Frame 2：信息条 */}
      <section className="detail-meta">
        <div className="meta-item"><span className="meta-label">Tid:</span> {mins} min</div>
        <div className="meta-item"><span className="meta-label">Ingredienser:</span> {ings.length}</div>
        <div className="meta-item meta-diff">
          <span className="meta-label">Svårighetsgrad:</span>
          {typeof DifficultyBadge === "function" ? (
            <DifficultyBadge value={diff} />
          ) : (
            <span className="difficulty-chip">{diff}</span>
          )}
        </div>
        <div className="meta-item meta-rating">
          <span className="meta-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < Math.round(avg) ? "active" : ""}>★</span>
            ))}
          </span>
          <span className="meta-score">{avg.toFixed(1)}</span>
        </div>
      </section>

      {/* Frame 3：两列布局 */}
      <section className="detail-body">
        <div className="detail-col">
          <h3>Ingredienser</h3>
          <ul className="dot-list">
            {ings.map((i, idx) => (
              <li key={idx}>{typeof i === "string" ? i : i?.name || ""}</li>
            ))}
          </ul>
        </div>

        <div className="detail-col">
          <h3>Instruktioner</h3>
          <ol className="step-list">
            {steps.map((s, idx) => <li key={idx}>{s}</li>)}
          </ol>
        </div>
      </section>

      {/* Frame 4：反馈区 */}
      <section className="detail-feedback">
        <h4>Vad tyckte du om receptet?</h4>

        <div className="stars">
          {[1,2,3,4,5].map((star) => (
            <span
              key={star}
              className={star <= rating ? "active" : ""}
              onClick={() => setRating(star)}
              role="button"
            >★</span>
          ))}
        </div>

        <div className="feedback-form">
          <input
            className="input"
            placeholder="Namn…"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="textarea"
            placeholder="Kommentar…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="btn" onClick={() => alert("Skickat!")}>Skicka</button>
        </div>
      </section>
    </div>
  );
}
