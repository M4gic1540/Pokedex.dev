import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
const MAX_SLOTS = 3;
const emptySlots = () => Array.from({ length: MAX_SLOTS }, () => '');
const normalizeInput = (value) => value.trim().toLowerCase();
const StatBar = ({ label, value }) => (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-slate-400", children: [_jsx("span", { className: "capitalize", children: label.replace('-', ' ') }), _jsx("span", { className: "font-semibold text-slate-200", children: value })] }), _jsx("div", { className: "h-1.5 overflow-hidden rounded-full bg-slate-800", children: _jsx("div", { className: "h-full rounded-full bg-amber-400", style: { width: `${Math.min(value, 150) / 1.5}%` } }) })] }));
const ComparisonCard = ({ pokemon }) => (_jsxs("article", { className: "flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5", children: [_jsxs("header", { className: "flex items-center gap-4", children: [_jsx("img", { src: pokemon.image, alt: pokemon.name, className: "size-20 rounded-full border border-slate-800 bg-slate-950 object-contain" }), _jsxs("div", { children: [_jsxs("p", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: ["#", pokemon.id.toString().padStart(3, '0')] }), _jsx("h3", { className: "text-lg font-semibold capitalize text-white", children: pokemon.name }), _jsx("div", { className: "mt-1 flex flex-wrap gap-2 text-xs font-semibold uppercase text-slate-300", children: pokemon.types.map((type) => (_jsx("span", { className: "rounded-full bg-slate-800 px-2 py-0.5", children: type }, type))) })] })] }), _jsxs("section", { className: "space-y-3", children: [_jsx("h4", { className: "text-xs uppercase tracking-[0.2em] text-slate-500", children: "Estad\u00EDsticas" }), _jsx("div", { className: "space-y-2", children: pokemon.stats.map((stat) => (_jsx(StatBar, { label: stat.name, value: stat.value }, stat.name))) })] })] }));
export const PokemonComparator = () => {
    const [inputs, setInputs] = useState(() => emptySlots());
    const [selectedNames, setSelectedNames] = useState(() => emptySlots());
    const detailQuery0 = usePokemonDetail(selectedNames[0] || null);
    const detailQuery1 = usePokemonDetail(selectedNames[1] || null);
    const detailQuery2 = usePokemonDetail(selectedNames[2] || null);
    const detailQueries = useMemo(() => [detailQuery0, detailQuery1, detailQuery2], [
        detailQuery0,
        detailQuery1,
        detailQuery2
    ]);
    const handleApply = (index) => {
        const normalized = normalizeInput(inputs[index]);
        setSelectedNames((prev) => {
            const next = [...prev];
            next[index] = normalized;
            return next;
        });
    };
    const handleReset = (index) => {
        setInputs((prev) => {
            const next = [...prev];
            next[index] = '';
            return next;
        });
        setSelectedNames((prev) => {
            const next = [...prev];
            next[index] = '';
            return next;
        });
    };
    const filledEntries = useMemo(() => detailQueries.filter((query) => query.data).map((query) => query.data), [detailQueries]);
    return (_jsxs("section", { className: "space-y-6", children: [_jsxs("header", { className: "space-y-2", children: [_jsx("h2", { className: "text-2xl font-semibold text-white", children: "Comparador de Pok\u00E9mon" }), _jsx("p", { className: "text-sm text-slate-400", children: "Busca hasta tres Pok\u00E9mon y compara r\u00E1pidamente sus estad\u00EDsticas base y tipolog\u00EDas. Ideal para planificar tu equipo o analizar enfrentamientos." })] }), _jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: inputs.map((value, index) => {
                    const query = detailQueries[index];
                    return (_jsxs("div", { className: "flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/30 p-4", children: [_jsxs("label", { className: "text-xs font-semibold uppercase tracking-[0.25em] text-slate-500", children: ["Slot ", index + 1] }), _jsx("input", { type: "text", value: value, onChange: (event) => {
                                    const nextValue = event.target.value;
                                    setInputs((prev) => {
                                        const next = [...prev];
                                        next[index] = nextValue;
                                        return next;
                                    });
                                }, placeholder: "Ej. pikachu", className: "rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400" }), _jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("button", { type: "button", className: "flex-1 rounded-md border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-300 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500", onClick: () => handleApply(index), disabled: !value.trim(), children: "Buscar" }), _jsx("button", { type: "button", className: "rounded-md border border-transparent px-3 py-2 text-xs font-semibold text-slate-400 transition hover:text-amber-300", onClick: () => handleReset(index), disabled: !selectedNames[index] && !value, children: "Limpiar" })] }), query.isLoading ? (_jsx("p", { className: "text-xs text-slate-400", children: "Cargando datos\u2026" })) : null, query.isError ? (_jsx("p", { className: "text-xs text-red-300", children: query.error?.message ?? 'No se pudo encontrar el Pokémon indicado.' })) : null, query.data ? _jsx(ComparisonCard, { pokemon: query.data }) : null] }, index));
                }) }), filledEntries.length >= 2 ? (_jsxs("div", { className: "rounded-3xl border border-slate-800 bg-slate-900/30 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Resumen comparativo" }), _jsx("p", { className: "mt-1 text-sm text-slate-400", children: "Valores promedios y destacados entre los Pok\u00E9mon seleccionados." }), _jsx("div", { className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: filledEntries.map((pokemon) => (_jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/50 p-4", children: [_jsx("h4", { className: "text-sm font-semibold capitalize text-white", children: pokemon.name }), _jsxs("p", { className: "text-xs text-slate-400", children: ["Promedio de stats: ", Math.round(pokemon.stats.reduce((acc, stat) => acc + stat.value, 0) / pokemon.stats.length)] }), _jsxs("p", { className: "mt-1 text-xs text-slate-400", children: ["Tipos: ", pokemon.types.join(', ')] })] }, pokemon.id))) })] })) : null] }));
};
