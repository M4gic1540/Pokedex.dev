import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useFavorites } from '../../../store/favorites';
const FORMATTERS = {
    id: (id) => `#${id.toString().padStart(3, '0')}`,
    height: (value) => `${(value / 10).toFixed(1)} m`,
    weight: (value) => `${(value / 10).toFixed(1)} kg`
};
const TYPE_STYLES = {
    fire: 'from-orange-500 to-red-500',
    water: 'from-sky-500 to-cyan-500',
    grass: 'from-emerald-500 to-lime-400',
    electric: 'from-amber-400 to-yellow-300',
    psychic: 'from-pink-500 to-purple-500',
    ice: 'from-sky-300 to-cyan-200',
    dragon: 'from-indigo-500 to-purple-500',
    dark: 'from-slate-700 to-slate-900',
    fairy: 'from-fuchsia-400 to-pink-400',
    normal: 'from-slate-500 to-slate-400',
    fighting: 'from-red-600 to-orange-600',
    flying: 'from-sky-300 to-indigo-400',
    poison: 'from-purple-500 to-fuchsia-500',
    ground: 'from-amber-600 to-yellow-600',
    rock: 'from-stone-500 to-yellow-700',
    bug: 'from-lime-500 to-emerald-500',
    ghost: 'from-purple-700 to-indigo-700',
    steel: 'from-slate-400 to-slate-500'
};
const getTypeBadgeClasses = (type) => TYPE_STYLES[type] ?? 'from-slate-500 to-slate-600';
export const PokemonCard = ({ pokemon }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite(pokemon.id);
    return (_jsxs("article", { className: "group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/30 p-5 transition-all hover:-translate-y-1 hover:border-amber-400 hover:bg-slate-900/70", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-slate-500", children: FORMATTERS.id(pokemon.id) }), _jsx("h2", { className: "mt-2 text-xl font-semibold capitalize text-white", children: pokemon.name }), _jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: pokemon.types.map((type) => (_jsx("span", { className: `inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${getTypeBadgeClasses(type)}`, children: type }, type))) })] }), _jsxs("div", { className: "flex flex-col items-end gap-3", children: [_jsx("button", { type: "button", onClick: () => toggleFavorite(pokemon.id), className: `rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${favorite
                                    ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                                    : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-amber-400 hover:text-amber-300'}`, "aria-pressed": favorite, "aria-label": favorite ? 'Quitar de favoritos' : 'Agregar a favoritos', children: favorite ? 'Favorito' : 'Guardar' }), _jsx("img", { src: pokemon.image, alt: `Imagen oficial de ${pokemon.name}`, loading: "lazy", className: "size-28 select-none drop-shadow-[0_30px_40px_rgba(255,203,5,0.25)] transition group-hover:scale-105" })] })] }), _jsxs("dl", { className: "mt-4 grid grid-cols-3 gap-3 text-xs text-slate-300", children: [_jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-center", children: [_jsx("dt", { className: "uppercase tracking-wide text-slate-500", children: "Altura" }), _jsx("dd", { className: "mt-1 font-semibold text-white", children: FORMATTERS.height(pokemon.height) })] }), _jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-center", children: [_jsx("dt", { className: "uppercase tracking-wide text-slate-500", children: "Peso" }), _jsx("dd", { className: "mt-1 font-semibold text-white", children: FORMATTERS.weight(pokemon.weight) })] }), _jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-center", children: [_jsx("dt", { className: "uppercase tracking-wide text-slate-500", children: "Habs." }), _jsx("dd", { className: "mt-1 line-clamp-2 font-semibold text-white", children: pokemon.abilities.slice(0, 2).join(', ') })] })] }), _jsxs("div", { className: "mt-4", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-500", children: "Estad\u00EDsticas base" }), _jsx("div", { className: "mt-3 space-y-2", children: pokemon.stats.map((stat) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "w-20 text-xs font-medium uppercase tracking-wide text-slate-400", children: stat.name }), _jsx("div", { className: "h-2 flex-1 overflow-hidden rounded-full bg-slate-800", children: _jsx("div", { className: "h-full rounded-full bg-amber-400", style: { width: `${Math.min(stat.value, 150) / 1.5}%` } }) }), _jsx("span", { className: "w-10 text-right text-xs font-semibold text-slate-200", children: stat.value })] }, stat.name))) })] })] }));
};
