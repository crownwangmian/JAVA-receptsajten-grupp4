const BASE = "https://grupp4-pkfud.reky.se";

export async function getRecipes() {
  const res = await fetch(`${BASE}/recipes`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load recipes: ${res.status} ${text}`);
  }
  return res.json();
}

export async function getRecipeById(id) {
  const res = await fetch(`${BASE}/recipes/${id}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load recipe: ${res.status} ${text}`);
  }
  return res.json();
}
