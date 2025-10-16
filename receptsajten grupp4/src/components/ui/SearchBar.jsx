// src/components/ui/SearchBar.jsx
export default function SearchBar({ value, onChange, placeholder = "Sök..." }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="search-input"
    />
  );
}
