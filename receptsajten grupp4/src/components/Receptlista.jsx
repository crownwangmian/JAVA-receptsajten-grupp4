import React from "react";
import RatingStars from "./ui/RatingStars";
import DifficultyBadge from "./ui/DifficultyBadge";

export default function ReceptLista({ recipe, onClick, index = 0 }) {
	if (!recipe) return null;

	const displayRating = recipe.avgRating || 0;
	const isReversed = index % 2 === 1;

	// Difficulty rule: under 5 -> Lätt, exactly 5 -> Mellan, over 5 -> Svår
	const difficulty =
		recipe.timeInMins < 5
			? "Lätt"
			: recipe.timeInMins === 5
			? "Mellan"
			: "Svår";

	return (
		<article
			className={`recipe-item ${isReversed ? "reverse" : ""}`}
			onClick={() => onClick && onClick(recipe)}
		>
			<div className="recipe-media">
				<img src={recipe.imageUrl} alt={recipe.title} />
			</div>

			<div className="recipe-content">
				<h3>{recipe.title}</h3>

				<div className="difficulty-row">
					<span className="difficulty-label">Svårighetsgrad:</span>
					<span className="difficulty">{difficulty}</span>
				</div>

				<p>{recipe.description}</p>

				<div className="recipe-meta">
					<span className="time">
						Förberedningstid: {recipe.timeInMins} min
					</span>
					<span className="price">Pris: {recipe.price} kr</span>
					<div className="meta-row">
						<button className="recept-button">Recept</button>
						<div className="rating-wrap">
							<RatingStars value={displayRating} />
						</div>
					</div>
				</div>
			</div>
		</article>
	);
}
