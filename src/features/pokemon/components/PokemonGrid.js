import { jsx as _jsx } from "react/jsx-runtime";
import { PokemonCard } from './PokemonCard';
export const PokemonGrid = ({ items }) => (_jsx("section", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: items.map((pokemon) => (_jsx(PokemonCard, { pokemon: pokemon }, pokemon.id))) }));
