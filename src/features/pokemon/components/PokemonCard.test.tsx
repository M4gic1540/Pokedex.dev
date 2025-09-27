import { render, screen, fireEvent } from '@testing-library/react'
import { PokemonCard } from './PokemonCard'
import { FavoritesProvider } from '../../../store/favorites'
import type { PokemonSummary } from '../../../types/pokemon'

const pokemonMock: PokemonSummary = {
  id: 1,
  name: 'bulbasaur',
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
  types: ['grass', 'poison'],
  height: 7,
  weight: 69,
  abilities: ['overgrow', 'chlorophyll'],
  generation: 1,
  stats: [
    { name: 'hp', value: 45 },
    { name: 'attack', value: 49 },
    { name: 'defense', value: 49 },
    { name: 'special-attack', value: 65 },
    { name: 'special-defense', value: 65 },
    { name: 'speed', value: 45 }
  ]
}

describe('PokemonCard', () => {
  it('renderiza la información principal', () => {
    render(
      <FavoritesProvider>
        <PokemonCard pokemon={pokemonMock} />
      </FavoritesProvider>
    )

    expect(screen.getByText('#001')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /bulbasaur/i })).toBeInTheDocument()
    expect(screen.getByText(/grass/i)).toBeInTheDocument()
    expect(screen.getByText(/poison/i)).toBeInTheDocument()
  })

  it('permite marcar como favorito', () => {
    render(
      <FavoritesProvider>
        <PokemonCard pokemon={pokemonMock} />
      </FavoritesProvider>
    )

    const toggle = screen.getByRole('button', { name: /agregar a favoritos/i })
    fireEvent.click(toggle)
    expect(screen.getByRole('button', { name: /quitar de favoritos/i })).toBeInTheDocument()
  })
})
