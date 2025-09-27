import { useQuery } from '@tanstack/react-query';
import { fetchEvolutionTimeline } from '../../../services/pokeapi';
export const useEvolutionTimeline = (name) => {
    const normalized = name?.trim().toLowerCase() ?? '';
    return useQuery({
        queryKey: ['pokemon-evolution', normalized],
        queryFn: async () => await fetchEvolutionTimeline(normalized),
        enabled: Boolean(normalized)
    });
};
