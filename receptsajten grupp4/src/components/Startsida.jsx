// src/components/Startsida.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRecipes } from "../services/recipes";
import ReceptLista from "./Receptlista";
import SearchBar from "./ui/SearchBar.jsx";
import Categorybutton from "./categorybutton";
import { categories } from "../data/categories";
import Header from './ui/Header.jsx'
import "./Startsida.css";

export default function Startsida() {
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [selectedCategory, setSelectedCategory] = useState(null);
	const [query, setQuery] = useState("");

	const location = useLocation();
	const navigate = useNavigate();

	// 初始化 & 每次 URL 变化时，从 ?q= 读入搜索词
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		setQuery(params.get("q") || "");
	}, [location.search]);

	// 拉取数据
	useEffect(() => {
		let mounted = true;
		setLoading(true);
		getRecipes()
			.then((data) => mounted && setRecipes(Array.isArray(data) ? data : []))
			.catch((err) => mounted && setError(err.message || "Failed to load"))
			.finally(() => mounted && setLoading(false));
		return () => {
			mounted = false;
		};
	}, []);

	// 分类 + 关键词 联合过滤
	const filtered = useMemo(() => {
		const byCat = recipes.filter((r) =>
			!selectedCategory ? true : r?.categories?.includes(selectedCategory)
		);
		const q = query.trim().toLowerCase();
		if (!q) return byCat;

		return byCat.filter((r) => {
			const title = (r.title || "").toLowerCase();
			const desc = (r.description || "").toLowerCase();
			const ings = (r.ingredients || [])
				.map((i) => (typeof i === "string" ? i : i?.name || ""))
				.join(" ")
				.toLowerCase();
			return title.includes(q) || desc.includes(q) || ings.includes(q);
		});
	}, [recipes, selectedCategory, query]);

	// Always render the hero/header. The body below will show loading/error/empty states.
	return (
		<div className="drink-app">
			<Header query={query} setQuery={setQuery} navigate={navigate} />
			<section className="drink-list">
				{/* Loading state */}
				{loading && <div style={{ padding: 16 }}>Loading recipes…</div>}

				{/* Error contacting DB */}
				{!loading && error && (
					<div style={{ padding: 16, color: "crimson" }}>
						Kunde inte kontakta databasen: {String(error)}
					</div>
				)}

				{/* No recipes in DB */}
				{!loading && !error && filtered.length === 0 && (
					<p className="no-result">Inga recept i databasen.</p>
				)}

				{/* Normal list */}
				{!loading &&
					!error &&
					filtered.length > 0 &&
					filtered.map((recipe, i) => (
						<ReceptLista
							key={recipe._id || recipe.id || recipe.title || i}
							recipe={recipe}
							index={i}
						/>
					))}
			</section>
		</div >
	);
}
