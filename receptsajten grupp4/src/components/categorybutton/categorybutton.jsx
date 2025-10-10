import './categorybutton.css';

export default function CategoryButton({ name, onClick, isActive }) {
    return (
        <button
            className={`categorybutton ${isActive ? 'active' : ''}`}
            onClick={onClick}>
            {name}
        </button>
    )
}