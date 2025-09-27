import { useQuery } from '@tanstack/react-query'
import { fetchPokemonList } from '../../../services/pokeapi'
import type { PokemonListFilters, PokemonListResult } from '../../../types/pokemon'

export const PAGE_SIZE = 24

interface UsePokemonListOptions {
  page: number
  pageSize?: number
  filters?: PokemonListFilters
}

export const usePokemonList = ({ page, pageSize = PAGE_SIZE, filters }: UsePokemonListOptions) =>
  useQuery<PokemonListResult, Error>({
    queryKey: ['pokemon', { page, pageSize, filters }],
    queryFn: async () => await fetchPokemonList({ page, pageSize, filters }),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData
  })
