import { useQuery } from '@tanstack/react-query';
import { fetchPokemonByName } from '../../../services/pokeapi';
export const usePokemonDetail = (name) => {
    const normalized = name?.trim().toLowerCase() ?? '';
    return useQuery({
        queryKey: ['pokemon-detail', normalized],
        queryFn: async () => await fetchPokemonByName(normalized),
        enabled: Boolean(normalized)
    });
};
