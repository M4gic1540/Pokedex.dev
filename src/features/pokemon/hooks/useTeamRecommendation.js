import { useQuery } from '@tanstack/react-query';
import { recommendTeamByTypes } from '../../../services/pokeapi';
export const useTeamRecommendation = (types) => {
    const sanitized = types.map((type) => type.trim().toLowerCase()).filter(Boolean);
    return useQuery({
        queryKey: ['pokemon-team-recommendation', sanitized.sort().join('-')],
        queryFn: async () => await recommendTeamByTypes(sanitized),
        enabled: sanitized.length > 0
    });
};
