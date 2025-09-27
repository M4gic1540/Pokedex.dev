import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
const STORAGE_KEY = 'pokedex:trainer-log';
const initialForm = {
    opponent: '',
    result: 'victoria',
    team: '',
    notes: ''
};
const loadStoredRecords = () => {
    if (typeof window === 'undefined')
        return [];
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored)
            return [];
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch (error) {
        console.warn('No se pudo cargar el registro de entrenador', error);
        return [];
    }
};
const persistRecords = (records) => {
    if (typeof window === 'undefined')
        return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};
const generateId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const TrainerMode = () => {
    const [records, setRecords] = useState(() => loadStoredRecords());
    const [form, setForm] = useState(initialForm);
    useEffect(() => {
        persistRecords(records);
    }, [records]);
    const stats = useMemo(() => {
        const totals = { victorias: 0, derrotas: 0, empates: 0 };
        for (const record of records) {
            if (record.result === 'victoria')
                totals.victorias += 1;
            if (record.result === 'derrota')
                totals.derrotas += 1;
            if (record.result === 'empate')
                totals.empates += 1;
        }
        const total = records.length || 1;
        const ratio = ((totals.victorias + totals.empates * 0.5) / total) * 100;
        return { ...totals, ratio: Math.round(ratio) };
    }, [records]);
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!form.opponent.trim())
            return;
        const newRecord = {
            id: generateId(),
            opponent: form.opponent.trim(),
            result: form.result,
            team: form.team
                .split(',')
                .map((member) => member.trim().toLowerCase())
                .filter(Boolean),
            notes: form.notes.trim() || undefined,
            createdAt: new Date().toISOString()
        };
        setRecords((prev) => [newRecord, ...prev]);
        setForm(initialForm);
    };
    const removeRecord = (id) => {
        setRecords((prev) => prev.filter((record) => record.id !== id));
    };
    return (_jsxs("section", { className: "space-y-6", children: [_jsxs("header", { className: "space-y-2", children: [_jsx("h2", { className: "text-2xl font-semibold text-white", children: "Modo entrenador" }), _jsx("p", { className: "text-sm text-slate-400", children: "Registra combates simulados o reales para analizar tu desempe\u00F1o a lo largo del tiempo. Controla victorias, derrotas y empates, y toma notas sobre estrategias efectivas." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 rounded-3xl border border-slate-800 bg-slate-900/30 p-6", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("label", { className: "flex flex-col gap-2 text-sm text-slate-200", children: ["Rival / equipo", _jsx("input", { type: "text", value: form.opponent, onChange: (event) => setForm((prev) => ({ ...prev, opponent: event.target.value })), placeholder: "Ej. Gimnasio de Ciudad Celeste", className: "rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400", required: true })] }), _jsxs("label", { className: "flex flex-col gap-2 text-sm text-slate-200", children: ["Resultado", _jsxs("select", { value: form.result, onChange: (event) => setForm((prev) => ({ ...prev, result: event.target.value })), className: "rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400", children: [_jsx("option", { value: "victoria", children: "Victoria" }), _jsx("option", { value: "derrota", children: "Derrota" }), _jsx("option", { value: "empate", children: "Empate" })] })] })] }), _jsxs("label", { className: "flex flex-col gap-2 text-sm text-slate-200", children: ["Equipo usado", _jsx("input", { type: "text", value: form.team, onChange: (event) => setForm((prev) => ({ ...prev, team: event.target.value })), placeholder: "Lista tus Pok\u00E9mon separados por coma (ej. pikachu, snorlax, gengar)", className: "rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400" })] }), _jsxs("label", { className: "flex flex-col gap-2 text-sm text-slate-200", children: ["Notas", _jsx("textarea", { value: form.notes, onChange: (event) => setForm((prev) => ({ ...prev, notes: event.target.value })), rows: 3, placeholder: "Observaciones clave, aprendizajes, movimientos decisivos, etc.", className: "rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400" })] }), _jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", children: [_jsx("p", { className: "text-xs text-slate-400", children: "Los registros se almacenan localmente en tu navegador." }), _jsx("button", { type: "submit", className: "rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-300", children: "Guardar combate" })] })] }), _jsxs("section", { className: "rounded-3xl border border-slate-800 bg-slate-900/30 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Resumen" }), _jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [_jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: "Victorias" }), _jsx("p", { className: "mt-2 text-2xl font-semibold text-emerald-400", children: stats.victorias })] }), _jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: "Derrotas" }), _jsx("p", { className: "mt-2 text-2xl font-semibold text-rose-400", children: stats.derrotas })] }), _jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: "Empates" }), _jsx("p", { className: "mt-2 text-2xl font-semibold text-slate-300", children: stats.empates })] }), _jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: "Ratio" }), _jsxs("p", { className: "mt-2 text-2xl font-semibold text-amber-300", children: [stats.ratio, "%"] })] })] }), _jsx("div", { className: "mt-6 space-y-4", children: records.length === 0 ? (_jsx("p", { className: "text-sm text-slate-400", children: "A\u00FAn no registras combates. \u00A1Comienza agregando uno arriba!" })) : (records.map((record) => (_jsxs("article", { className: "space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4", children: [_jsxs("header", { className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: new Date(record.createdAt).toLocaleString() }), _jsxs("h4", { className: "text-base font-semibold text-white", children: ["vs ", record.opponent] })] }), _jsx("span", { className: `rounded-full px-3 py-1 text-xs font-semibold uppercase ${record.result === 'victoria'
                                                ? 'bg-emerald-500/20 text-emerald-300'
                                                : record.result === 'derrota'
                                                    ? 'bg-rose-500/20 text-rose-300'
                                                    : 'bg-slate-500/20 text-slate-200'}`, children: record.result })] }), record.team.length > 0 ? (_jsxs("p", { className: "text-xs text-slate-400", children: ["Equipo: ", _jsx("span", { className: "text-slate-200", children: record.team.join(', ') })] })) : null, record.notes ? _jsx("p", { className: "text-sm text-slate-300", children: record.notes }) : null, _jsx("button", { type: "button", onClick: () => removeRecord(record.id), className: "text-xs font-semibold text-slate-500 transition hover:text-rose-300", children: "Eliminar" })] }, record.id)))) })] })] }));
};
