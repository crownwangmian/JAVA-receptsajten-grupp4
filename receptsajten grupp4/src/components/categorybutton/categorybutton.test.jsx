import {render,screen, fireEvent} from '@testing-library/react'
import CategoryButton from './categorybutton'
import {test,expect} from 'vitest'

test('renders button w/ correct name',()=>{
    render(<CategoryButton name="Gindrinkar" onClick={() => {}} />)
    const button = screen.getByText('Gindrinkar')
    expect(button).toBeInTheDocument();
});