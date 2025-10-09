import './categorybutton.css';

export default function CategoryButton({name}){
    return(
        <button className='categorybutton'>
            {name}
        </button>
    )
}