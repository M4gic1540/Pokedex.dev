import { useMemo, useState } from 'react'
import { PokemonGrid } from './PokemonGrid'
import { Pagination } from './Pagination'
import { usePokemonList, PAGE_SIZE } from '../hooks/usePokemonList'
import { SearchBar } from './SearchBar'

const SkeletonCard = () => (
  <div className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900/30 p-6">
    <div className="flex items-start justify-between">
      <div className="space-y-3">
        <div className="h-3 w-16 rounded bg-slate-700/60" />
        <div className="h-6 w-24 rounded bg-slate-700/60" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-slate-800" />
          <div className="h-6 w-16 rounded-full bg-slate-800" />
        </div>
      </div>
      <div className="size-28 rounded-full bg-slate-800/60" />
    </div>
    <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-slate-300">
      <div className="h-16 rounded-2xl bg-slate-800/60" />
      <div className="h-16 rounded-2xl bg-slate-800/60" />
      <div className="h-16 rounded-2xl bg-slate-800/60" />
    </div>
    <div className="mt-6 space-y-2">
      <div className="h-2 w-full rounded-full bg-slate-800" />
      <div className="h-2 w-full rounded-full bg-slate-800" />
      <div className="h-2 w-full rounded-full bg-slate-800" />
    </div>
  </div>
)

const SkeletonGrid = () => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: PAGE_SIZE }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
)

export const PokemonCatalog = () => {
  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const filters = useMemo(() => (searchTerm ? { search: searchTerm } : undefined), [searchTerm])

  const { data, isFetching, isLoading, isError, error } = usePokemonList({ page, filters })

  const totalPages = useMemo(() => {
    if (!data?.total) return 1
    return Math.max(1, Math.ceil(data.total / PAGE_SIZE))
  }, [data?.total])

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 0 || nextPage >= totalPages) return
    setPage(nextPage)
  }

  const handleSearchSubmit = (term: string) => {
    setSearchTerm(term)
    setPage(0)
  }

  const handleSearchClear = () => {
    setSearchTerm('')
    setPage(0)
  }

  const hasNoResults = data && data.items.length === 0

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-white">Listado principal</h2>
          <p className="text-sm text-slate-400">
            Consulta los primeros 386 Pokémon (Gen I a III). Esta primera iteración incluye paginación,
            búsqueda global y datos esenciales por criatura.
          </p>
        </div>
        <div className="w-full sm:max-w-md">
          <SearchBar value={searchTerm} onSubmit={handleSearchSubmit} onClear={handleSearchClear} />
        </div>
      </header>

      {isError ? (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
          <p className="font-semibold">No se pudo cargar la Pokédex.</p>
          <p>{error?.message ?? 'Error desconocido. Intenta nuevamente más tarde.'}</p>
        </div>
      ) : null}

      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <>
          {hasNoResults ? (
            <div className="flex flex-col items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-slate-200">
              <div>
                <h3 className="text-lg font-semibold">Sin coincidencias</h3>
                <p className="text-sm text-slate-400">
                  No encontramos Pokémon que coincidan con “{searchTerm}”. Ajusta tu búsqueda o limpia los
                  filtros para volver a ver el listado completo.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSearchClear}
                className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:border-amber-400 hover:bg-amber-500/20"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : null}
          {data && !hasNoResults ? <PokemonGrid items={data.items} /> : null}
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} isLoading={isFetching} />
        </>
      )}
    </section>
  )
}
