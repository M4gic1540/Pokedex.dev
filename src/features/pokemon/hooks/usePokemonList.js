import { useQuery } from '@tanstack/react-query';
import { fetchPokemonList } from '../../../services/pokeapi';
export const PAGE_SIZE = 24;
export const usePokemonList = ({ page, pageSize = PAGE_SIZE, filters }) => useQuery({
    queryKey: ['pokemon', { page, pageSize, filters }],
    queryFn: async () => await fetchPokemonList({ page, pageSize, filters }),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData
});
