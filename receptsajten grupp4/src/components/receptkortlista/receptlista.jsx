import React, { useState } from "react";
import "./DrinkRecipes.css";

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

}