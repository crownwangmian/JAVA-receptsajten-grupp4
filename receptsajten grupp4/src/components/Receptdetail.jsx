// src/components/Receptdetail.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRecipes, postRating, updateRecipe } from "../services/recipes";
import SearchBar from "./ui/SearchBar.jsx";
import DifficultyBadge from "./ui/DifficultyBadge"; // 若没有可先删掉这行与下方组件
import "./Startsida.css"; // 你已有
import "./receptdetail.css"; // 👈 新增样式文件（第2步给出）
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

	useEffect(() => {
		let alive = true;
		setLoading(true);
		getRecipes()
			.then((data) => {
				if (!alive) return;
				const list = Array.isArray(data) ? data : [];
				const found = list.find(
					(r) => String(r._id ?? r.id) === String(recipeId)
				);
				setRecipe(found || null);
			})
			.catch((e) => alive && setError(e.message || "Failed to load"))
			.finally(() => alive && setLoading(false));
		return () => {
			alive = false;
		};
	}, [recipeId]);

	if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
	if (error)
		return <div style={{ padding: 16, color: "crimson" }}>Error: {error}</div>;
	if (!recipe)
		return <div style={{ padding: 16 }}>Receptet hittades inte.</div>;

	// 展示字段准备
	const title = recipe.title || recipe.name || "Mojito";
	const img = recipe.imageUrl || recipe.image || "/hero.jpg";
	const mins = recipe.timeInMins ?? recipe.time ?? 0;
	const ings = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
	const steps = Array.isArray(recipe.instructions) ? recipe.instructions : [];
	const price = recipe.price || recipe.svårighetsgrad || "Mellan";

	// avgRating may be stored as an array of numeric ratings or a single number
	const ratingsArray = Array.isArray(recipe.avgRating)
		? recipe.avgRating.map((n) => Number(n)).filter((n) => !Number.isNaN(n))
		: typeof recipe.avgRating === "number"
		? [Number(recipe.avgRating)]
		: [];

	const avg =
		ratingsArray.length > 0
			? ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length
			: 0;

	return (
		<div className="drink-app">
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
									: i?.amount + " " + i?.unit + " " + i?.name || ""}
							</li>
						))}
					</ul>
				</div>

				<div className="detail-col">
					<h3>Instruktioner</h3>
					<ol className="step-list">
						{steps.map((s, idx) => (
							<li key={idx}>{s}</li>
						))}
					</ol>
				</div>
			</section>

			{/* Frame 4：反馈区 */}
			<section className="detail-feedback">
				<h4>Vad tyckte du om receptet?</h4>

				<div className="stars">
					{[1, 2, 3, 4, 5].map((star) => (
						<span
							key={star}
							className={`${star <= rating ? "active" : ""}${
								hasRated ? " disabled" : ""
							}`}
							onClick={async () => {
								if (hasRated) return; // already rated this session
								// set local selection immediately
								setRating(star);
								try {
									const id = recipe._id ?? recipe.id;
									if (!id) throw new Error("Recipe id missing");

									// Send single rating to server
									const resp = await postRating(id, Number(star));

									// If server returns updated recipe or ratings, use it
									if (resp && resp.avgRating !== undefined) {
										// server returned avgRating — it may be a number or an array
										if (typeof resp.avgRating === "number") {
											// convert scalar to array and persist to DB so future clients see array
											const arr = [Number(resp.avgRating)];
											try {
												await updateRecipe(id, { avgRating: arr });
												setRecipe({ ...recipe, avgRating: arr });
											} catch {
												// if patch fails, still set local state to array for UI consistency
												setRecipe({ ...recipe, avgRating: arr });
											}
										} else {
											// assume server returned an array
											setRecipe({ ...recipe, avgRating: resp.avgRating });
										}
									} else if (resp && resp.ratings) {
										setRecipe({ ...recipe, avgRating: resp.ratings });
									} else {
										// fallback: append locally
										const newRatings = Array.from(ratingsArray);
										newRatings.push(Number(star));
										setRecipe({ ...recipe, avgRating: newRatings });
									}

									setHasRated(true);
									setRatedMessage("Tack! Du har betygsatt detta recept.");
								} catch (e) {
									console.error(e);
									setRatedMessage("Kunde inte spara omdömet. Försök igen.");
								}
							}}
							role="button"
						>
							☆
						</span>
					))}
				</div>
				{ratedMessage && <div className="rated-message">{ratedMessage}</div>}

				<div className="feedback-form">
					Lämna gärna en kommentar
					<input
						className="input"
						placeholder="Namn..."
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<textarea
						className="textarea"
						placeholder="Kommentar..."
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<button
						className="btn"
						onClick={() =>
							alert("Kommentarsfunktion inte implementerad i detta demo.")
						}
					>
						Skicka kommentar
					</button>
				</div>
			</section>
		</div>
	);
}
