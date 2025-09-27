import type { PokemonSummary } from '../../../types/pokemon'
import { PokemonCard } from './PokemonCard'

interface PokemonGridProps {
  items: PokemonSummary[]
}

export const PokemonGrid = ({ items }: PokemonGridProps) => (
  <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {items.map((pokemon) => (
      <PokemonCard key={pokemon.id} pokemon={pokemon} />
    ))}
  </section>
)
