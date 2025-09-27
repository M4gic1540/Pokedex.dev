import { useQuery } from '@tanstack/react-query'
import { fetchEvolutionTimeline } from '../../../services/pokeapi'
import type { EvolutionStep } from '../../../types/pokemon'

export const useEvolutionTimeline = (name: string | null) => {
  const normalized = name?.trim().toLowerCase() ?? ''

  return useQuery<EvolutionStep[], Error>({
    queryKey: ['pokemon-evolution', normalized],
    queryFn: async () => await fetchEvolutionTimeline(normalized),
    enabled: Boolean(normalized)
  })
}
