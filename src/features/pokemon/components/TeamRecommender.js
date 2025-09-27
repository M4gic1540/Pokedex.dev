import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useTeamRecommendation } from '../hooks/useTeamRecommendation';
const TYPE_OPTIONS = [
    'normal',
    'fire',
    'water',
    'grass',
    'electric',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy'
];
export const TeamRecommender = () => {
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [activeTypes, setActiveTypes] = useState([]);
    const recommendation = useTeamRecommendation(activeTypes);
    const toggleType = (type) => {
        setSelectedTypes((prev) => {
            if (prev.includes(type)) {
                return prev.filter((item) => item !== type);
            }
            if (prev.length >= 3) {
                return [...prev.slice(1), type];
            }
            return [...prev, type];
        });
    };
    const handleGenerate = () => {
        setActiveTypes(selectedTypes);
    };
    const footerMessage = useMemo(() => {
        if (recommendation.isLoading)
            return 'Calculando mejor combinación…';
        if (recommendation.isError)
            return recommendation.error?.message ?? 'No se pudo generar un equipo.';
        if ((recommendation.data?.length ?? 0) === 0)
            return 'Selecciona al menos un tipo para generar el equipo.';
        return 'Los equipos priorizan variedad de tipologías para cubrir debilidades comunes.';
    }, [recommendation.isLoading, recommendation.isError, recommendation.data, recommendation.error?.message]);
    return (_jsxs("section", { className: "space-y-6", children: [_jsxs("header", { className: "space-y-2", children: [_jsx("h2", { className: "text-2xl font-semibold text-white", children: "Recomendador de equipos" }), _jsx("p", { className: "text-sm text-slate-400", children: "Selecciona hasta tres tipos principales y genera un equipo balanceado de seis Pok\u00E9mon que cubra la mayor\u00EDa de debilidades. Ideal como punto de partida para torneos o aventuras." })] }), _jsxs("div", { className: "rounded-3xl border border-slate-800 bg-slate-900/30 p-6", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-slate-500", children: "Tipos foco" }), _jsx("div", { className: "mt-3 grid gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6", children: TYPE_OPTIONS.map((type) => (_jsxs("label", { className: "flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm capitalize text-slate-200", children: [_jsx("input", { type: "checkbox", checked: selectedTypes.includes(type), onChange: () => toggleType(type), className: "size-4 rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400" }), type] }, type))) }), _jsxs("div", { className: "mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsx("p", { className: "text-xs text-slate-400", children: "Puedes elegir hasta tres tipos. Si seleccionas m\u00E1s, se remplazar\u00E1 el m\u00E1s antiguo." }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: handleGenerate, className: "rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-300 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500", disabled: selectedTypes.length === 0 || recommendation.isLoading, children: "Generar equipo" }), _jsx("button", { type: "button", onClick: () => {
                                            setSelectedTypes([]);
                                            setActiveTypes([]);
                                        }, className: "rounded-md border border-transparent px-4 py-2 text-xs font-semibold text-slate-400 transition hover:text-amber-300", children: "Limpiar" })] })] })] }), recommendation.data && recommendation.data.length > 0 ? (_jsxs("div", { className: "rounded-3xl border border-slate-800 bg-slate-900/30 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Equipo sugerido" }), _jsx("p", { className: "text-sm text-slate-400", children: "Equilibrio entre roles ofensivos, defensivos y velocidad." }), _jsx("div", { className: "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: recommendation.data.map((pokemon) => (_jsxs("article", { className: "flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4", children: [_jsx("img", { src: pokemon.image, alt: pokemon.name, className: "size-20 rounded-xl border border-slate-800 bg-slate-950 object-contain" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: ["#", pokemon.id.toString().padStart(3, '0')] }), _jsx("h4", { className: "text-base font-semibold capitalize text-white", children: pokemon.name })] }), _jsxs("p", { className: "text-xs text-slate-400", children: ["Tipos: ", pokemon.types.join(', ')] }), _jsxs("p", { className: "text-xs text-slate-400", children: ["Ataque base: ", pokemon.stats.find((stat) => stat.name === 'attack')?.value ?? '—', " \u00B7 Defensa base:", ' ', pokemon.stats.find((stat) => stat.name === 'defense')?.value ?? '—'] })] })] }, pokemon.id))) })] })) : null, _jsx("footer", { className: "rounded-2xl border border-slate-800 bg-slate-900/30 p-4 text-xs text-slate-400", children: footerMessage })] }));
};
