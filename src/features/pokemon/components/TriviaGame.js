import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import { fetchRandomPokemonSummary } from '../../../services/pokeapi';
export const TriviaGame = () => {
    const [state, setState] = useState({ pokemon: null, status: 'idle', attempts: 0 });
    const [guess, setGuess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const loadPokemon = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const pokemon = await fetchRandomPokemonSummary();
            setState({ pokemon, status: 'playing', attempts: 0 });
            setGuess('');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo cargar el desafío. Intenta nuevamente.');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        void loadPokemon();
    }, [loadPokemon]);
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!state.pokemon)
            return;
        const normalizedGuess = guess.trim().toLowerCase();
        if (!normalizedGuess)
            return;
        const isCorrect = normalizedGuess === state.pokemon.name.toLowerCase();
        setState((prev) => ({
            ...prev,
            status: isCorrect ? 'correct' : 'incorrect',
            attempts: prev.attempts + 1,
            message: isCorrect
                ? '¡Correcto! Has identificado al Pokémon.'
                : 'No es correcto, revisa la silueta y vuelve a intentar.'
        }));
    };
    const handleNext = () => {
        void loadPokemon();
    };
    return (_jsxs("section", { className: "space-y-6", children: [_jsxs("header", { className: "space-y-2", children: [_jsx("h2", { className: "text-2xl font-semibold text-white", children: "Minijuego: \u00BFQui\u00E9n es ese Pok\u00E9mon?" }), _jsx("p", { className: "text-sm text-slate-400", children: "Adivina el nombre del Pok\u00E9mon a partir de su silueta. Ideal para aprender tipolog\u00EDas y reforzar la memoria visual." })] }), _jsx("div", { className: "rounded-3xl border border-slate-800 bg-slate-900/30 p-6", children: isLoading ? (_jsx("p", { className: "text-sm text-slate-400", children: "Preparando un nuevo desaf\u00EDo\u2026" })) : error ? (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-sm text-red-300", children: error }), _jsx("button", { type: "button", onClick: handleNext, className: "rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-300", children: "Intentar otra vez" })] })) : state.pokemon ? (_jsxs("div", { className: "flex flex-col gap-6 md:flex-row md:items-center", children: [_jsxs("div", { className: "flex-1 text-center", children: [_jsx("div", { className: "relative mx-auto flex size-48 items-center justify-center rounded-full bg-slate-950", children: _jsx("img", { src: state.pokemon.image, alt: "Silueta del Pok\u00E9mon", className: `size-40 object-contain transition ${state.status === 'correct' ? 'opacity-100 drop-shadow-[0_0_25px_rgba(255,203,5,0.35)]' : 'opacity-10 invert contrast-200 brightness-50'}`, draggable: false }) }), _jsxs("p", { className: "mt-3 text-xs uppercase tracking-[0.3em] text-slate-500", children: ["Intentos: ", state.attempts] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "flex-1 space-y-3", children: [_jsx("label", { className: "text-xs font-semibold uppercase tracking-[0.25em] text-slate-500", children: "Tu respuesta" }), _jsx("input", { type: "text", value: guess, onChange: (event) => setGuess(event.target.value), placeholder: "Escribe el nombre del Pok\u00E9mon", className: "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400" }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { type: "submit", className: "rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300", disabled: state.status === 'correct', children: "Comprobar" }), _jsx("button", { type: "button", onClick: handleNext, className: "rounded-md border border-transparent px-4 py-2 text-xs font-semibold text-slate-400 transition hover:text-amber-300", children: "Nuevo desaf\u00EDo" })] }), state.message ? (_jsx("p", { className: `text-sm ${state.status === 'correct' ? 'text-emerald-300' : 'text-amber-200'}`, children: state.message })) : null, state.status === 'correct' ? (_jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200", children: [_jsx("p", { className: "font-semibold capitalize", children: state.pokemon.name }), _jsxs("p", { className: "text-xs text-slate-400", children: ["Tipos: ", state.pokemon.types.join(', ')] })] })) : null] })] })) : (_jsx("p", { className: "text-sm text-slate-400", children: "Pulsa el bot\u00F3n para comenzar." })) })] }));
};
