import { useQuery } from '@tanstack/react-query'
import { recommendTeamByTypes } from '../../../services/pokeapi'
import type { PokemonSummary } from '../../../types/pokemon'

export const useTeamRecommendation = (types: string[]) => {
  const sanitized = types.map((type) => type.trim().toLowerCase()).filter(Boolean)

  return useQuery<PokemonSummary[], Error>({
    queryKey: ['pokemon-team-recommendation', sanitized.sort().join('-')],
    queryFn: async () => await recommendTeamByTypes(sanitized),
    enabled: sanitized.length > 0
  })
}
