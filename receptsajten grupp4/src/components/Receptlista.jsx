// src/components/Receptlista.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // ← add
import RatingStars from "./ui/RatingStars";
import DifficultyBadge from "./ui/DifficultyBadge";

export default function ReceptLista({ recipe, onClick, index = 0 }) {
  if (!recipe) return null;

  const displayRating = recipe.avgRating || 0;
  const isReversed = index % 2 === 1;

  const navigate = useNavigate(); // ← add

  // navigate to /recipe/:id when clicking the "Recept" button
  const goToDetail = (e) => {
    e.stopPropagation(); // prevent triggering article onClick
    const id = recipe._id ?? recipe.id; // support both _id or id
    if (!id) {
      console.warn("Recipe id not found on recipe:", recipe);
      return;
    }
    navigate(`/recipe/${id}`);
  };

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

        <p>{recipe.description}</p>

        <div className="recipe-meta">
          <span className="time">
            Förberedningstid: {recipe.timeInMins} min
          </span>

          <div className="meta-row">
            <button className="recept-button" onClick={goToDetail}>
              Recept
            </button>

            <div className="rating-wrap">
              <RatingStars value={displayRating} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
