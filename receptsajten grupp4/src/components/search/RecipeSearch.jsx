export default function RecipeSearch({ value = "", onChange = () => {} }) {
  return (
    <div className="recipe-search">
      <input
        type="text"
        placeholder="Sök recept eller ingrediens..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
