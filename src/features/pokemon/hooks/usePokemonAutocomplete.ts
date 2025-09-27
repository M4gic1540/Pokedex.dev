import { useQuery } from '@tanstack/react-query'
import { searchPokemonSuggestions } from '../../../services/pokeapi'
import type { PokemonSummary } from '../../../types/pokemon'

export const usePokemonAutocomplete = (term: string) => {
  const normalized = term.trim().toLowerCase()

  return useQuery<PokemonSummary[], Error>({
    queryKey: ['pokemon-autocomplete', normalized],
    queryFn: async () => await searchPokemonSuggestions(normalized),
    enabled: normalized.length >= 2,
    staleTime: 1000 * 60 * 10
  })
}
