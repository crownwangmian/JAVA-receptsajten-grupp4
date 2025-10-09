import React, { useState, useEffect } from "react";
import { getRecipes } from "../../services/recipes";
import "./Startsida.css";

const categories = [
  { name: "Gindrinkar", image: "/images/gin.jpg" },
  { name: "Romdrinkar", image: "/images/rum.jpg" },
  { name: "Tequiladrinkar", image: "/images/tequila.jpg" },
  { name: "Vodkadrinkar", image: "/images/vodka.jpg" },
];

export default function Startsida() {
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const handleRating = (value) => setRating(value);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getRecipes()
      .then(data => {
        if (mounted) setRecipes(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error(err);
        if (mounted) setError(err.message || 'Failed to load');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Loading recipes…</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div className="drink-app">
      <header className="hero">
        <img src="hero.jpg" alt="Drink hero background" />
        <div className="hero-text">
          <h1>Drinkrecept</h1>
          <nav>
            {categories.map((cat) => (
              <button key={cat.name}>{cat.name}</button>
            ))}
          </nav>
        </div>
      </header>

      {!selectedDrink ? (
        <section className="drink-list">
          {recipes.map((drink) => (
            <div
              className="drink-card"
              key={drink.title}
              onClick={() => setSelectedDrink(drink)}
            >
              <img src={drink.imageUrl} alt={drink.title} />
              <div className="drink-info">
                <h3>{drink.title}</h3>
                <p>{drink.description}</p>
                <span>{"⭐".repeat(drink.avgRating)}</span>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="drink-detail">
          <button className="back" onClick={() => setSelectedDrink(null)}>
            ← Tillbaka
          </button>
          <h2>{selectedDrink.name}</h2>
          <img src={selectedDrink.image} alt={selectedDrink.name} />

          <div className="recipe">
            <div>
              <h3>Ingredienser</h3>
              <ul>
                {selectedDrink.ingredients.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Instruktioner</h3>
              <ol>
                {selectedDrink.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="feedback">
            <h4>Vad tyckte du om receptet?</h4>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= rating ? "active" : ""}
                  onClick={() => handleRating(star)}
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
    </div>
  );
}
