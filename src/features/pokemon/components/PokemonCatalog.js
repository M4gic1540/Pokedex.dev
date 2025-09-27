import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { PokemonGrid } from './PokemonGrid';
import { Pagination } from './Pagination';
import { usePokemonList, PAGE_SIZE } from '../hooks/usePokemonList';
import { SearchBar } from './SearchBar';
const SkeletonCard = () => (_jsxs("div", { className: "animate-pulse rounded-3xl border border-slate-800 bg-slate-900/30 p-6", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "h-3 w-16 rounded bg-slate-700/60" }), _jsx("div", { className: "h-6 w-24 rounded bg-slate-700/60" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "h-6 w-16 rounded-full bg-slate-800" }), _jsx("div", { className: "h-6 w-16 rounded-full bg-slate-800" })] })] }), _jsx("div", { className: "size-28 rounded-full bg-slate-800/60" })] }), _jsxs("div", { className: "mt-6 grid grid-cols-3 gap-3 text-xs text-slate-300", children: [_jsx("div", { className: "h-16 rounded-2xl bg-slate-800/60" }), _jsx("div", { className: "h-16 rounded-2xl bg-slate-800/60" }), _jsx("div", { className: "h-16 rounded-2xl bg-slate-800/60" })] }), _jsxs("div", { className: "mt-6 space-y-2", children: [_jsx("div", { className: "h-2 w-full rounded-full bg-slate-800" }), _jsx("div", { className: "h-2 w-full rounded-full bg-slate-800" }), _jsx("div", { className: "h-2 w-full rounded-full bg-slate-800" })] })] }));
const SkeletonGrid = () => (_jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: Array.from({ length: PAGE_SIZE }).map((_, index) => (_jsx(SkeletonCard, {}, index))) }));
export const PokemonCatalog = () => {
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const filters = useMemo(() => (searchTerm ? { search: searchTerm } : undefined), [searchTerm]);
    const { data, isFetching, isLoading, isError, error } = usePokemonList({ page, filters });
    const totalPages = useMemo(() => {
        if (!data?.total)
            return 1;
        return Math.max(1, Math.ceil(data.total / PAGE_SIZE));
    }, [data?.total]);
    const handlePageChange = (nextPage) => {
        if (nextPage < 0 || nextPage >= totalPages)
            return;
        setPage(nextPage);
    };
    const handleSearchSubmit = (term) => {
        setSearchTerm(term);
        setPage(0);
    };
    const handleSearchClear = () => {
        setSearchTerm('');
        setPage(0);
    };
    const hasNoResults = data && data.items.length === 0;
    return (_jsxs("section", { className: "space-y-8", children: [_jsxs("header", { className: "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-3xl font-semibold text-white", children: "Listado principal" }), _jsx("p", { className: "text-sm text-slate-400", children: "Consulta los primeros 386 Pok\u00E9mon (Gen I a III). Esta primera iteraci\u00F3n incluye paginaci\u00F3n, b\u00FAsqueda global y datos esenciales por criatura." })] }), _jsx("div", { className: "w-full sm:max-w-md", children: _jsx(SearchBar, { value: searchTerm, onSubmit: handleSearchSubmit, onClear: handleSearchClear }) })] }), isError ? (_jsxs("div", { className: "rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200", children: [_jsx("p", { className: "font-semibold", children: "No se pudo cargar la Pok\u00E9dex." }), _jsx("p", { children: error?.message ?? 'Error desconocido. Intenta nuevamente más tarde.' })] })) : null, isLoading ? (_jsx(SkeletonGrid, {})) : (_jsxs(_Fragment, { children: [hasNoResults ? (_jsxs("div", { className: "flex flex-col items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-slate-200", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold", children: "Sin coincidencias" }), _jsxs("p", { className: "text-sm text-slate-400", children: ["No encontramos Pok\u00E9mon que coincidan con \u201C", searchTerm, "\u201D. Ajusta tu b\u00FAsqueda o limpia los filtros para volver a ver el listado completo."] })] }), _jsx("button", { type: "button", onClick: handleSearchClear, className: "rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:border-amber-400 hover:bg-amber-500/20", children: "Limpiar b\u00FAsqueda" })] })) : null, data && !hasNoResults ? _jsx(PokemonGrid, { items: data.items }) : null, _jsx(Pagination, { page: page, totalPages: totalPages, onPageChange: handlePageChange, isLoading: isFetching })] }))] }));
};
