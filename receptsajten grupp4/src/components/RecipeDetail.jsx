import { useParams, Link } from "react-router-dom";

export default function RecipeDetail() {
  const { recipeId } = useParams();
  return (
    <div style={{ padding: 24 }}>
      <h2>Recipe: {recipeId}</h2>
      <p>(占位页面，下一步会替换为真实的详情/评论/评分)</p>
      <Link to="/">← Tillbaka</Link>
    </div>
  );
}
