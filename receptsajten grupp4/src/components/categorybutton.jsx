import React from "react";
import { useNavigate } from "react-router-dom";
import "./categorybutton.css";

export default function CategoryButton({ name, isActive, onClick, count }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof onClick === "function") onClick();
    const categoryId = String(name).toLowerCase().replace("drinkar", "").trim();
    if (isActive) {
      navigate("/");
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  return (
    <button
      className={`categorybutton ${isActive ? "active" : ""}`}
      onClick={handleClick}
      aria-pressed={isActive}
      data-count={count}               
      title={`${name} (${count ?? 0})`} 
    >
      <span className="label">{name}</span>
      <span className="count">({count ?? 0})</span> {/* ← no cons showed */}
    </button>
  );
}
