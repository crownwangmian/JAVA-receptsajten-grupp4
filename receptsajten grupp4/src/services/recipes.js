const BASE = 'https://grupp4-pkfud.reky.se';

export async function getRecipes() {
  const res = await fetch(`${BASE}/recipes`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load recipes: ${res.status} ${text}`);
  }
  // expecting an array
  return res.json();
}
