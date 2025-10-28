// src/components/Receptdetail.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRecipes, postRating, updateRecipe } from "../services/recipes";
import SearchBar from "./ui/SearchBar.jsx";
import DifficultyBadge from "./ui/DifficultyBadge";
import "./Startsida.css";
import "./receptdetail.css";
import RatingStars from "./ui/RatingStars.jsx";

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
  const [hasRated, setHasRated] = useState(false);
  const [ratedMessage, setRatedMessage] = useState("");
  const [query, setQuery] = useState("");
  const [comments, setComments] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!recipeId) return;
    fetch(`https://grupp4-pkfud.reky.se/recipes/${recipeId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]));
  }, [recipeId]);

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
    return () => {
      alive = false;
    };
  }, [recipeId]);

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (error) return <div style={{ padding: 16, color: "crimson" }}>Error: {error}</div>;
  if (!recipe) return <div style={{ padding: 16 }}>Receptet hittades inte.</div>;

  const title = recipe.title || recipe.name || "Mojito";
  const img = recipe.imageUrl || recipe.image || "/hero.jpg";
  const mins = recipe.timeInMins ?? recipe.time ?? 0;
  const ings = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const steps = Array.isArray(recipe.instructions) ? recipe.instructions : [];
  const price = recipe.price || recipe.svårighetsgrad || "Mellan";

<<<<<<< HEAD
	// avgRating may be stored as an array of numeric ratings or a single number
	const ratingsArray = Array.isArray(recipe.avgRating)
		? recipe.avgRating.map((n) => Number(n)).filter((n) => !Number.isNaN(n))
		: typeof recipe.avgRating === "number"
			? [Number(recipe.avgRating)]
			: [];
=======
  const ratingsArray = Array.isArray(recipe.avgRating)
    ? recipe.avgRating.map((n) => Number(n)).filter((n) => !Number.isNaN(n))
    : typeof recipe.avgRating === "number"
    ? [Number(recipe.avgRating)]
    : [];
>>>>>>> 759af4100e080af9f7045af7e148cacfae2175e4

  const avg =
    ratingsArray.length > 0
      ? ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length
      : 0;

  const displayRating = hasRated ? Math.round(avg) : rating;

  async function sendComment() {
    if (!name.trim() || !comment.trim()) {
      alert("Vänligen fyll i både namn och kommentar.");
      return;
    }
    try {
      const res = await fetch(
        `https://grupp4-pkfud.reky.se/recipes/${recipeId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            comment: comment.trim(),
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          (err && (err.error || err.message)) || "Kunde inte skicka kommentar"
        );
      }
      setName("");
      setComment("");
      setIsSubmitted(true);

      const commentsRes = await fetch(
        `https://grupp4-pkfud.reky.se/recipes/${recipeId}/comments`
      );
      const newComments = await commentsRes.json();
      setComments(Array.isArray(newComments) ? newComments : []);

      alert("Kommentar skickad");
    } catch (e) {
      alert(e.message || "Något gick fel vid skickandet.");
    }
  }

  return (
    <div className="drink-app receptdetail-page">
      {/* Frame 1：头部大图 + 搜索 + 标题 */}
      <header className="hero hero--detail">
        <img src="/hero.jpg" alt="header" />
        <Link className="hero-home" to="/">
          Hem
        </Link>

        <div className="hero-search">
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

        <div className="hero-text">
          <h1>{title}</h1>
        </div>
      </header>

      {/* Frame 2：信息条 */}
      <section className="detail-meta">
        <img className="hero-image" src={img} alt={title} />

        <div className="meta-column">
          <div className="meta-item">
            <span className="meta-label">Tid:</span> {mins} min
          </div>
          <div className="meta-item">
            <span className="meta-label">Ingredienser:</span> {ings.length}
          </div>
          <div className="meta-item meta-diff">
            <span className="meta-label">Svårighetsgrad:</span>
            <DifficultyBadge price={price} />
          </div>
          <div className="meta-item meta-rating">
            [
            <span className="meta-stars">
              <RatingStars value={avg} />
            </span>
            <span className="meta-score">{avg.toFixed(1)}</span>]
          </div>
        </div>
      </section>

      {/* Frame 3：两列布局 */}
      <section className="detail-body">
        <div className="detail-col">
          <h3>Ingredienser</h3>
          <ul className="dot-list">
            {ings.map((i, idx) => (
              <li key={idx}>
                {typeof i === "string"
                  ? i
                  : [i?.amount, i?.unit, i?.name].filter(Boolean).join(" ")}
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-col">
          <h3>Instruktioner</h3>
          <ol className="step-list">
            {steps.map((s, idx) => (
              <li key={idx}>
                <input type="checkbox" name={`step[${idx}]`} value="1" />
                {s}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 评论区 */}
      <section className="comments-section">
        <h4>Kommentarer</h4>
        {comments.map((c) => (
          <div key={c.id || c._id || `${c.name}-${c.createdAt}-${idx}`}>
            <strong>{c.name}</strong>
            <div className="comment-meta">
              {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
            </div>
            <p>{c.comment}</p>
          </div>
        ))}
      </section>

      {/* Frame 4：反馈区 */}
      <section className="detail-feedback">
        <h4>Vad tyckte du om receptet?</h4>

<<<<<<< HEAD
				<div className="stars">
					{[1, 2, 3, 4, 5].map((star) => (
						<span
							key={star}
							className={`${star <= displayRating ? "active" : ""}${hasRated ? " disabled" : ""
								}`}
							onClick={async () => {
								if (hasRated) return; // already rated this session — locked
								// set local selection immediately
								setRating(star);
								try {
									const id = recipe._id ?? recipe.id;
									if (!id) throw new Error("Recipe id missing");
=======
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`${star <= displayRating ? "active" : ""}${
                hasRated ? " disabled" : ""
              }`}
              onClick={async () => {
                if (hasRated) return;
                setRating(star);
                try {
                  const id = recipe._id ?? recipe.id;
                  if (!id) throw new Error("Recipe id missing");
                  const resp = await postRating(id, Number(star));
>>>>>>> 759af4100e080af9f7045af7e148cacfae2175e4

                  if (resp && resp.avgRating !== undefined) {
                    if (typeof resp.avgRating === "number") {
                      const arr = [Number(resp.avgRating)];
                      try {
                        await updateRecipe(id, { avgRating: arr });
                        setRecipe({ ...recipe, avgRating: arr });
                      } catch {
                        setRecipe({ ...recipe, avgRating: arr });
                      }
                    } else {
                      setRecipe({ ...recipe, avgRating: resp.avgRating });
                    }
                  } else if (resp && resp.ratings) {
                    setRecipe({ ...recipe, avgRating: resp.ratings });
                  } else {
                    const newRatings = Array.from(ratingsArray);
                    newRatings.push(Number(star));
                    setRecipe({ ...recipe, avgRating: newRatings });
                  }

                  setHasRated(true);
                  setRating(0);
                  setRatedMessage("Tack! Du har betygsatt detta recept.");
                } catch (e) {
                  console.error(e);
                  setRatedMessage("Kunde inte spara omdömet. Försök igen.");
                }
              }}
              role="button"
              aria-disabled={hasRated}
              style={{ pointerEvents: hasRated ? "none" : undefined }}
            >
              ☆
            </span>
          ))}
        </div>
        {ratedMessage && <div className="rated-message">{ratedMessage}</div>}

<<<<<<< HEAD
									// Lock the rating so the user cannot rate again on this page.
									setHasRated(true);
									// Clear the temporary selection so the UI shows the average instead
									// of the clicked star on this page.
									setRating(0);
									setRatedMessage("Tack! Du har betygsatt detta recept.");
								} catch (e) {
									console.error(e);
									setRatedMessage("Kunde inte spara omdömet. Försök igen.");
								}
							}}
							role="button"
							aria-disabled={hasRated}
							style={{ pointerEvents: hasRated ? "none" : undefined }}
						>
							☆
						</span>
					))}
				</div>
				{ratedMessage && <div className="rated-message">{ratedMessage}</div>}

				{isSubmitted ? (
					<div className="thank-you-message">
						<p>Tack för din kommentar!</p>
					</div>
				) : (
					<div className="feedback-form">
						Lämna gärna en kommentar
						<input
							className="input"
							placeholder="Namn..."
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={isSubmitted}
						/>
						<textarea
							className="textarea"
							placeholder="Kommentar..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							disabled={isSubmitted}
						/>
						<button className="btn" onClick={sendComment} disabled={isSubmitted}>
							Skicka
						</button>
					</div>
				)}
			</section>
		</div>
	);
=======
        <div className="feedback-form">
          Lämna gärna en kommentar
          <input
            className="input"
            placeholder="Namn..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitted}
          />
          <textarea
            className="textarea"
            placeholder="Kommentar..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitted}
          />
          <button className="btn" onClick={sendComment} disabled={isSubmitted}>
            Skicka
          </button>
        </div>
      </section>
    </div>
  );
>>>>>>> 759af4100e080af9f7045af7e148cacfae2175e4
}
