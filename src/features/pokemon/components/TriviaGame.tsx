import { useCallback, useEffect, useState } from 'react'
import { fetchRandomPokemonSummary } from '../../../services/pokeapi'
import type { PokemonSummary } from '../../../types/pokemon'

interface GameState {
  pokemon: PokemonSummary | null
  status: 'idle' | 'playing' | 'correct' | 'incorrect'
  attempts: number
  message?: string
}

export const TriviaGame = () => {
  const [state, setState] = useState<GameState>({ pokemon: null, status: 'idle', attempts: 0 })
  const [guess, setGuess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPokemon = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const pokemon = await fetchRandomPokemonSummary()
      setState({ pokemon, status: 'playing', attempts: 0 })
      setGuess('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el desafío. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPokemon()
  }, [loadPokemon])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!state.pokemon) return

    const normalizedGuess = guess.trim().toLowerCase()
    if (!normalizedGuess) return

    const isCorrect = normalizedGuess === state.pokemon.name.toLowerCase()
    setState((prev) => ({
      ...prev,
      status: isCorrect ? 'correct' : 'incorrect',
      attempts: prev.attempts + 1,
      message: isCorrect
        ? '¡Correcto! Has identificado al Pokémon.'
        : 'No es correcto, revisa la silueta y vuelve a intentar.'
    }))
  }

  const handleNext = () => {
    void loadPokemon()
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Minijuego: ¿Quién es ese Pokémon?</h2>
        <p className="text-sm text-slate-400">
          Adivina el nombre del Pokémon a partir de su silueta. Ideal para aprender tipologías y reforzar la
          memoria visual.
        </p>
      </header>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6">
        {isLoading ? (
          <p className="text-sm text-slate-400">Preparando un nuevo desafío…</p>
        ) : error ? (
          <div className="space-y-3">
            <p className="text-sm text-red-300">{error}</p>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-300"
            >
              Intentar otra vez
            </button>
          </div>
        ) : state.pokemon ? (
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex-1 text-center">
              <div className="relative mx-auto flex size-48 items-center justify-center rounded-full bg-slate-950">
                <img
                  src={state.pokemon.image}
                  alt="Silueta del Pokémon"
                  className={`size-40 object-contain transition ${state.status === 'correct' ? 'opacity-100 drop-shadow-[0_0_25px_rgba(255,203,5,0.35)]' : 'opacity-10 invert contrast-200 brightness-50'}`}
                  draggable={false}
                />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-slate-500">
                Intentos: {state.attempts}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Tu respuesta
              </label>
              <input
                type="text"
                value={guess}
                onChange={(event) => setGuess(event.target.value)}
                placeholder="Escribe el nombre del Pokémon"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300"
                  disabled={state.status === 'correct'}
                >
                  Comprobar
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-md border border-transparent px-4 py-2 text-xs font-semibold text-slate-400 transition hover:text-amber-300"
                >
                  Nuevo desafío
                </button>
              </div>
              {state.message ? (
                <p
                  className={`text-sm ${
                    state.status === 'correct' ? 'text-emerald-300' : 'text-amber-200'
                  }`}
                >
                  {state.message}
                </p>
              ) : null}
              {state.status === 'correct' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200">
                  <p className="font-semibold capitalize">{state.pokemon.name}</p>
                  <p className="text-xs text-slate-400">Tipos: {state.pokemon.types.join(', ')}</p>
                </div>
              ) : null}
            </form>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Pulsa el botón para comenzar.</p>
        )}
      </div>
    </section>
  )
}
