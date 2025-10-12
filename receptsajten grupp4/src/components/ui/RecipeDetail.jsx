import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecipeById } from "../../services/recipes";

export default function RecipeDetail() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getRecipeById(recipeId)
      .then((data) => {
        if (alive) {
          setRecipe(data);
          setError(null);
        }
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [recipeId]);

  if (loading) return <div style={{ padding: 24 }}>Laddar…</div>;
  if (error) return <div style={{ padding: 24, color: "crimson" }}>{error}</div>;
  if (!recipe) return null;

  return (
    <div style={{ padding: 24 }}>
      <Link to="">{/* 返回上一页 */}
        ← Tillbaka
      </Link>
      <h2 style={{ marginTop: 16 }}>{recipe.title ?? recipe.name}</h2>
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title ?? recipe.name}
          style={{ width: "100%", maxWidth: 900, borderRadius: 16, margin: "12px 0" }}
        />
      )}
      <p>{recipe.description}</p>

      <h3>Ingredienser</h3>
      <ul>
        {(recipe.ingredients ?? []).map((ing, i) => (
          <li key={i}>
            {ing.amount ? `${ing.amount} ` : ""}
            {ing.unit ? `${ing.unit} ` : ""}
            {ing.name ?? ing}
          </li>
        ))}
      </ul>
    </div>
  );
}
