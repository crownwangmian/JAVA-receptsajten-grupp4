import './categorybutton.css';

export default function CategoryButton({name,onClick}){
    return(
        <button className='categorybutton' onClick={onClick}>
            {name}
        </button>
    )
}