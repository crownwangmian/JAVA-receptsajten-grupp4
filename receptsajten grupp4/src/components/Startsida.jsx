import React, { useState, useEffect } from "react";
import { getRecipes } from "../services/recipes";
import ReceptLista from "./Receptlista";
import "./Startsida.css";

const categories = [
	{ name: "Gindrinkar", image: "/images/gin.jpg" },
	{ name: "Romdrinkar", image: "/images/rum.jpg" },
	{ name: "Tequiladrinkar", image: "/images/tequila.jpg" },
	{ name: "Vodkadrinkar", image: "/images/vodka.jpg" },
];

export default function Startsida() {
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		getRecipes()
			.then((data) => {
				if (mounted) setRecipes(Array.isArray(data) ? data : []);
			})
			.catch((err) => {
				console.error(err);
				if (mounted) setError(err.message || "Failed to load");
			})
			.finally(() => {
				if (mounted) setLoading(false);
			});
		return () => {
			mounted = false;
		};
	}, []);

	if (loading) return <div>Loading recipes…</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="drink-app">
			<header className="hero">
				<img src="hero.jpg" alt="Drink hero background" />
				<a className="hero-home" href="/">
					Hem
				</a>
				<div className="hero-text">
					<h1>Drinkrecept</h1>
					<nav>
						{categories.map((cat) => (
							<button key={cat.name}>{cat.name}</button>
						))}
					</nav>
				</div>
			</header>
			<section className="drink-list">
				{recipes.map((recipe, i) => (
					<ReceptLista
						key={recipe.title || recipe._id}
						recipe={recipe}
						index={i}
						// onClick={setSelectedDrink}
					/>
				))}
			</section>
		</div>
	);
}
