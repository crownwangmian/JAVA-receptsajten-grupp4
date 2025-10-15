import React, { useState, useEffect } from "react";
import { getRecipes } from "../services/recipes";
import ReceptLista from "./Receptlista";
import "./Startsida.css";
import Categorybutton from "./categorybutton"
import { categories } from "../data/categories"

export default function Startsida() {
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);

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
							<Categorybutton
								key={cat.name}
								name={cat.name}
								onClick={() => setSelectedCategory(
									selectedCategory === cat.dbCategory ? null : cat.dbCategory
								)}
								isActive={selectedCategory === cat.dbCategory}
							/>
						))}
					</nav>
				</div>
			</header>
			<section className="drink-list">
				{recipes
					.filter(recipe => !selectedCategory || recipe.categories.includes(selectedCategory))
					.map((recipe, i) => (
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
