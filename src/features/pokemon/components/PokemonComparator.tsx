import { useMemo, useState } from 'react'
import { usePokemonDetail } from '../hooks/usePokemonDetail'
import type { PokemonSummary } from '../../../types/pokemon'

const MAX_SLOTS = 3

const emptySlots = () => Array.from({ length: MAX_SLOTS }, () => '')

const normalizeInput = (value: string) => value.trim().toLowerCase()

const StatBar = ({ label, value }: { label: string; value: number }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-xs text-slate-400">
      <span className="capitalize">{label.replace('-', ' ')}</span>
      <span className="font-semibold text-slate-200">{value}</span>
    </div>
    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
      <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(value, 150) / 1.5}%` }} />
    </div>
  </div>
)

const ComparisonCard = ({ pokemon }: { pokemon: PokemonSummary }) => (
  <article className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
    <header className="flex items-center gap-4">
      <img
        src={pokemon.image}
        alt={pokemon.name}
        className="size-20 rounded-full border border-slate-800 bg-slate-950 object-contain"
      />
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">#{pokemon.id.toString().padStart(3, '0')}</p>
        <h3 className="text-lg font-semibold capitalize text-white">{pokemon.name}</h3>
        <div className="mt-1 flex flex-wrap gap-2 text-xs font-semibold uppercase text-slate-300">
          {pokemon.types.map((type) => (
            <span key={type} className="rounded-full bg-slate-800 px-2 py-0.5">
              {type}
            </span>
          ))}
        </div>
      </div>
    </header>

    <section className="space-y-3">
      <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500">Estadísticas</h4>
      <div className="space-y-2">
        {pokemon.stats.map((stat) => (
          <StatBar key={stat.name} label={stat.name} value={stat.value} />
        ))}
      </div>
    </section>
  </article>
)

export const PokemonComparator = () => {
  const [inputs, setInputs] = useState<string[]>(() => emptySlots())
  const [selectedNames, setSelectedNames] = useState<string[]>(() => emptySlots())

  const detailQuery0 = usePokemonDetail(selectedNames[0] || null)
  const detailQuery1 = usePokemonDetail(selectedNames[1] || null)
  const detailQuery2 = usePokemonDetail(selectedNames[2] || null)

  const detailQueries = useMemo(() => [detailQuery0, detailQuery1, detailQuery2], [
    detailQuery0,
    detailQuery1,
    detailQuery2
  ])

  const handleApply = (index: number) => {
    const normalized = normalizeInput(inputs[index])
    setSelectedNames((prev) => {
      const next = [...prev]
      next[index] = normalized
      return next
    })
  }

  const handleReset = (index: number) => {
    setInputs((prev) => {
      const next = [...prev]
      next[index] = ''
      return next
    })
    setSelectedNames((prev) => {
      const next = [...prev]
      next[index] = ''
      return next
    })
  }

  const filledEntries = useMemo(
    () => detailQueries.filter((query) => query.data).map((query) => query.data as PokemonSummary),
    [detailQueries]
  )

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Comparador de Pokémon</h2>
        <p className="text-sm text-slate-400">
          Busca hasta tres Pokémon y compara rápidamente sus estadísticas base y tipologías. Ideal para
          planificar tu equipo o analizar enfrentamientos.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {inputs.map((value, index) => {
          const query = detailQueries[index]

          return (
            <div key={index} className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
              <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Slot {index + 1}
              </label>
              <input
                type="text"
                value={value}
                onChange={(event) => {
                  const nextValue = event.target.value
                  setInputs((prev) => {
                    const next = [...prev]
                    next[index] = nextValue
                    return next
                  })
                }}
                placeholder="Ej. pikachu"
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-md border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-300 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
                  onClick={() => handleApply(index)}
                  disabled={!value.trim()}
                >
                  Buscar
                </button>
                <button
                  type="button"
                  className="rounded-md border border-transparent px-3 py-2 text-xs font-semibold text-slate-400 transition hover:text-amber-300"
                  onClick={() => handleReset(index)}
                  disabled={!selectedNames[index] && !value}
                >
                  Limpiar
                </button>
              </div>

              {query.isLoading ? (
                <p className="text-xs text-slate-400">Cargando datos…</p>
              ) : null}

              {query.isError ? (
                <p className="text-xs text-red-300">
                  {query.error?.message ?? 'No se pudo encontrar el Pokémon indicado.'}
                </p>
              ) : null}

              {query.data ? <ComparisonCard pokemon={query.data} /> : null}
            </div>
          )
        })}
      </div>

      {filledEntries.length >= 2 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6">
          <h3 className="text-lg font-semibold text-white">Resumen comparativo</h3>
          <p className="mt-1 text-sm text-slate-400">
            Valores promedios y destacados entre los Pokémon seleccionados.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filledEntries.map((pokemon) => (
              <div key={pokemon.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <h4 className="text-sm font-semibold capitalize text-white">{pokemon.name}</h4>
                <p className="text-xs text-slate-400">
                  Promedio de stats: {Math.round(pokemon.stats.reduce((acc, stat) => acc + stat.value, 0) / pokemon.stats.length)}
                </p>
                <p className="mt-1 text-xs text-slate-400">Tipos: {pokemon.types.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
