import { useState } from 'react'
import { useEvolutionTimeline } from '../hooks/useEvolutionTimeline'

export const EvolutionTimeline = () => {
  const [input, setInput] = useState('')
  const [activePokemon, setActivePokemon] = useState('')

  const timelineQuery = useEvolutionTimeline(activePokemon)

  const handleSearch = () => {
    setActivePokemon(input.trim().toLowerCase())
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Timeline de evoluciones</h2>
        <p className="text-sm text-slate-400">
          Ingresa un Pokémon para visualizar su línea evolutiva, condiciones y requisitos especiales.
        </p>
      </header>

      <div className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900/30 p-6 md:flex-row md:items-center md:gap-4">
        <div className="flex-1">
          <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500" htmlFor="timeline-search">
            Pokémon
          </label>
          <input
            id="timeline-search"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ej. eevee"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-300 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
          disabled={!input.trim()}
        >
          Consultar
        </button>
      </div>

      {timelineQuery.isLoading ? (
        <p className="text-sm text-slate-400">Cargando línea evolutiva…</p>
      ) : null}

      {timelineQuery.isError ? (
        <p className="text-sm text-red-300">
          {timelineQuery.error?.message ?? 'No se pudo obtener la cadena evolutiva. Intenta con otro Pokémon.'}
        </p>
      ) : null}

      {timelineQuery.data ? (
        <div className="overflow-x-auto">
          <ol className="flex min-w-full items-stretch gap-6">
            {timelineQuery.data.map((step, index) => (
              <li key={step.id} className="relative flex-1 min-w-[200px] rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex items-center gap-3">
                  <img src={step.image} alt={step.name} className="size-16 rounded-full border border-slate-800 bg-slate-950 object-contain" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Etapa {index + 1}</p>
                    <h3 className="text-base font-semibold capitalize text-white">{step.name}</h3>
                    <p className="text-xs text-slate-400">Trigger: {step.trigger}</p>
                    {step.minLevel ? <p className="text-xs text-slate-400">Nivel mínimo: {step.minLevel}</p> : null}
                  </div>
                </div>
                {step.conditions && step.conditions.length > 0 ? (
                  <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Condiciones</p>
                    <ul className="mt-2 space-y-1 text-xs text-slate-300">
                      {step.conditions.map((condition, conditionIndex) => (
                        <li key={conditionIndex}>• {condition}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  )
}
