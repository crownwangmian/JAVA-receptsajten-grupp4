// Import required libraries
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'

describe('App component', () => {
  it('renders loading state on first render', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    // Assert the loading text that appears before data is loaded
    expect(screen.getByText(/Loading recipes/i)).toBeInTheDocument()
  })
})
