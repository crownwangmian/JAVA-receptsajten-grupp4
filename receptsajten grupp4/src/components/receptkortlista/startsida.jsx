import React, { useState } from "react";
import "./DrinkRecipes.css";

const categories = [
  { name: "Gindrinkar", image: "/images/gin.jpg" },
  { name: "Romdrinkar", image: "/images/rum.jpg" },
  { name: "Tequiladrinkar", image: "/images/tequila.jpg" },
  { name: "Vodkadrinkar", image: "/images/vodka.jpg" },
];

const drinks = [
  {
    name: "Mojito",
    image: "/images/mojito.jpg",
    description:
      "En klassisk kubansk cocktail med rom, lime, mynta och sodavatten.",
    ingredients: [
      "4 cl ljus rom (Helst Havana Club Añejo 3 Años)",
      "3 cl limejuice",
      "3 cl sockerlag",
      "4 cl sodavatten",
    ],
    instructions: [
      "Häll rom, limejuice och sockerlag i ett glas.",
      "Tillsätt mynta och pressa sedan ner en bit med en sked.",
      "Fyll på glaset med isbitar och häll sedan på rom.",
      "Addera sodavatten och rör om försiktigt.",
      "Garnera gärna med citronskiva.",
    ],
    rating: 5,
  },
  {
    name: "Pink Spritz",
    image: "/images/pink-spritz.jpg",
    description:
      "En fräsch och spritzig drink med rosé och fruktiga smaker.",
    rating: 4,
  },
];

export default function DrinkRecipes() {
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleRating = (value) => setRating(value);

  return (
    <div className="drink-app">
      <header className="hero">
        <img src="/images/hero-bg.jpg" alt="Drink background" />
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
          {drinks.map((drink) => (
            <div
              className="drink-card"
              key={drink.name}
              onClick={() => setSelectedDrink(drink)}
            >
              <img src={drink.image} alt={drink.name} />
              <div className="drink-info">
                <h3>{drink.name}</h3>
                <p>{drink.description}</p>
                <span>{"⭐".repeat(drink.rating)}</span>
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
