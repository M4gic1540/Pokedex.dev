import { useQuery } from '@tanstack/react-query'
import { fetchPokemonByName } from '../../../services/pokeapi'
import type { PokemonSummary } from '../../../types/pokemon'

export const usePokemonDetail = (name: string | null) => {
  const normalized = name?.trim().toLowerCase() ?? ''

  return useQuery<PokemonSummary, Error>({
    queryKey: ['pokemon-detail', normalized],
    queryFn: async () => await fetchPokemonByName(normalized),
    enabled: Boolean(normalized)
  })
}
