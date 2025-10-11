import { useParams, Link } from "react-router-dom";

export default function CategoryPage() {
  const { categoryId } = useParams();
  return (
    <div style={{ padding: 24 }}>
      <h2>Category: {categoryId}</h2>
      <p>(占位页面，下一步会替换为真实的分类列表)</p>
      <Link to="/">← Tillbaka</Link>
    </div>
  );
}
