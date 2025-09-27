import type { PokemonSummary } from '../../../types/pokemon'
import { useFavorites } from '../../../store/favorites'

const FORMATTERS = {
  id: (id: number) => `#${id.toString().padStart(3, '0')}`,
  height: (value: number) => `${(value / 10).toFixed(1)} m`,
  weight: (value: number) => `${(value / 10).toFixed(1)} kg`
}

const TYPE_STYLES: Record<string, string> = {
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
}

const getTypeBadgeClasses = (type: string) =>
  TYPE_STYLES[type] ?? 'from-slate-500 to-slate-600'

interface PokemonCardProps {
  pokemon: PokemonSummary
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(pokemon.id)

  return (
  <article className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/30 p-5 transition-all hover:-translate-y-1 hover:border-amber-400 hover:bg-slate-900/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            {FORMATTERS.id(pokemon.id)}
          </span>
          <h2 className="mt-2 text-xl font-semibold capitalize text-white">{pokemon.name}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${getTypeBadgeClasses(
                  type
                )}`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={() => toggleFavorite(pokemon.id)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
              favorite
                ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-amber-400 hover:text-amber-300'
            }`}
            aria-pressed={favorite}
            aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {favorite ? 'Favorito' : 'Guardar'}
          </button>
          <img
            src={pokemon.image}
            alt={`Imagen oficial de ${pokemon.name}`}
            loading="lazy"
            className="size-28 select-none drop-shadow-[0_30px_40px_rgba(255,203,5,0.25)] transition group-hover:scale-105"
          />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-300">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-center">
          <dt className="uppercase tracking-wide text-slate-500">Altura</dt>
          <dd className="mt-1 font-semibold text-white">{FORMATTERS.height(pokemon.height)}</dd>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-center">
          <dt className="uppercase tracking-wide text-slate-500">Peso</dt>
          <dd className="mt-1 font-semibold text-white">{FORMATTERS.weight(pokemon.weight)}</dd>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-center">
          <dt className="uppercase tracking-wide text-slate-500">Habs.</dt>
          <dd className="mt-1 line-clamp-2 font-semibold text-white">
            {pokemon.abilities.slice(0, 2).join(', ')}
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Estadísticas base</p>
        <div className="mt-3 space-y-2">
          {pokemon.stats.map((stat) => (
            <div key={stat.name} className="flex items-center gap-3">
              <span className="w-20 text-xs font-medium uppercase tracking-wide text-slate-400">
                {stat.name}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${Math.min(stat.value, 150) / 1.5}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs font-semibold text-slate-200">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
