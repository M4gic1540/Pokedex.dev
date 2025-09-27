import { PokemonCatalog } from './features/pokemon/components/PokemonCatalog'
import { AdvancedFeatures } from './features/pokemon/components/AdvancedFeatures'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Proyecto MVP</p>
            <h1 className="text-2xl font-semibold text-amber-300">Pokédex Interactiva</h1>
          </div>
          <span className="rounded-full bg-slate-800/60 px-4 py-1 text-sm text-amber-300">
            Primera iteración
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="space-y-16">
          <PokemonCatalog />
          <AdvancedFeatures />
        </div>
      </main>
    </div>
  )
}

export default App
