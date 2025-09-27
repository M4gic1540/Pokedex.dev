import { useMemo, useState } from 'react'
import { useTeamRecommendation } from '../hooks/useTeamRecommendation'

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
]

export const TeamRecommender = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [activeTypes, setActiveTypes] = useState<string[]>([])

  const recommendation = useTeamRecommendation(activeTypes)

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((item) => item !== type)
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), type]
      }
      return [...prev, type]
    })
  }

  const handleGenerate = () => {
    setActiveTypes(selectedTypes)
  }

  const footerMessage = useMemo(() => {
    if (recommendation.isLoading) return 'Calculando mejor combinación…'
    if (recommendation.isError) return recommendation.error?.message ?? 'No se pudo generar un equipo.'
    if ((recommendation.data?.length ?? 0) === 0) return 'Selecciona al menos un tipo para generar el equipo.'
    return 'Los equipos priorizan variedad de tipologías para cubrir debilidades comunes.'
  }, [recommendation.isLoading, recommendation.isError, recommendation.data, recommendation.error?.message])

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Recomendador de equipos</h2>
        <p className="text-sm text-slate-400">
          Selecciona hasta tres tipos principales y genera un equipo balanceado de seis Pokémon que cubra
          la mayoría de debilidades. Ideal como punto de partida para torneos o aventuras.
        </p>
      </header>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Tipos foco</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {TYPE_OPTIONS.map((type) => (
            <label key={type} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm capitalize text-slate-200">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => toggleType(type)}
                className="size-4 rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400"
              />
              {type}
            </label>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            Puedes elegir hasta tres tipos. Si seleccionas más, se remplazará el más antiguo.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-300 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
              disabled={selectedTypes.length === 0 || recommendation.isLoading}
            >
              Generar equipo
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTypes([])
                setActiveTypes([])
              }}
              className="rounded-md border border-transparent px-4 py-2 text-xs font-semibold text-slate-400 transition hover:text-amber-300"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {recommendation.data && recommendation.data.length > 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6">
          <h3 className="text-lg font-semibold text-white">Equipo sugerido</h3>
          <p className="text-sm text-slate-400">Equilibrio entre roles ofensivos, defensivos y velocidad.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommendation.data.map((pokemon) => (
              <article key={pokemon.id} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="size-20 rounded-xl border border-slate-800 bg-slate-950 object-contain"
                />
                <div className="space-y-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">#{pokemon.id.toString().padStart(3, '0')}</p>
                    <h4 className="text-base font-semibold capitalize text-white">{pokemon.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400">Tipos: {pokemon.types.join(', ')}</p>
                  <p className="text-xs text-slate-400">
                    Ataque base: {pokemon.stats.find((stat) => stat.name === 'attack')?.value ?? '—'} · Defensa base:{' '}
                    {pokemon.stats.find((stat) => stat.name === 'defense')?.value ?? '—'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      <footer className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4 text-xs text-slate-400">
        {footerMessage}
      </footer>
    </section>
  )
}
