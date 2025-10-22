const BASE = "https://grupp4-pkfud.reky.se";

export async function getRecipes() {
	const res = await fetch(`${BASE}/recipes`);
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Failed to load recipes: ${res.status} ${text}`);
	}
	// expecting an array
	return res.json();
}

export async function updateRecipe(id, patch) {
	const res = await fetch(`${BASE}/recipes/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(patch),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Failed to update recipe: ${res.status} ${text}`);
	}
	return res.json();
}

// Post a single rating to the recipe ratings endpoint.
// Server expects { rating: number } at POST /recipes/:id/ratings
export async function postRating(id, rating) {
	const res = await fetch(`${BASE}/recipes/${id}/ratings`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ rating }),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Failed to post rating: ${res.status} ${text}`);
	}
	return res.json();
}
