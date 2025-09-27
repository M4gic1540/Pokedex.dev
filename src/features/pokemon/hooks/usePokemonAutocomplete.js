import { useQuery } from '@tanstack/react-query';
import { searchPokemonSuggestions } from '../../../services/pokeapi';
export const usePokemonAutocomplete = (term) => {
    const normalized = term.trim().toLowerCase();
    return useQuery({
        queryKey: ['pokemon-autocomplete', normalized],
        queryFn: async () => await searchPokemonSuggestions(normalized),
        enabled: normalized.length >= 2,
        staleTime: 1000 * 60 * 10
    });
};
