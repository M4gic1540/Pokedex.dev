import { useEffect, useMemo, useState } from 'react'
import type { TrainerBattleRecord } from '../../../types/pokemon'

const STORAGE_KEY = 'pokedex:trainer-log'

type FormState = {
  opponent: string
  result: TrainerBattleRecord['result']
  team: string
  notes: string
}

const initialForm: FormState = {
  opponent: '',
  result: 'victoria',
  team: '',
  notes: ''
}

const loadStoredRecords = (): TrainerBattleRecord[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored) as TrainerBattleRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('No se pudo cargar el registro de entrenador', error)
    return []
  }
}

const persistRecords = (records: TrainerBattleRecord[]) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

const generateId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`

export const TrainerMode = () => {
  const [records, setRecords] = useState<TrainerBattleRecord[]>(() => loadStoredRecords())
  const [form, setForm] = useState<FormState>(initialForm)

  useEffect(() => {
    persistRecords(records)
  }, [records])

  const stats = useMemo(() => {
    const totals = { victorias: 0, derrotas: 0, empates: 0 }
    for (const record of records) {
      if (record.result === 'victoria') totals.victorias += 1
      if (record.result === 'derrota') totals.derrotas += 1
      if (record.result === 'empate') totals.empates += 1
    }
    const total = records.length || 1
    const ratio = ((totals.victorias + totals.empates * 0.5) / total) * 100
    return { ...totals, ratio: Math.round(ratio) }
  }, [records])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.opponent.trim()) return

    const newRecord: TrainerBattleRecord = {
      id: generateId(),
      opponent: form.opponent.trim(),
      result: form.result,
      team: form.team
        .split(',')
        .map((member) => member.trim().toLowerCase())
        .filter(Boolean),
      notes: form.notes.trim() || undefined,
      createdAt: new Date().toISOString()
    }

    setRecords((prev) => [newRecord, ...prev])
    setForm(initialForm)
  }

  const removeRecord = (id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id))
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Modo entrenador</h2>
        <p className="text-sm text-slate-400">
          Registra combates simulados o reales para analizar tu desempeño a lo largo del tiempo.
          Controla victorias, derrotas y empates, y toma notas sobre estrategias efectivas.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/30 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Rival / equipo
            <input
              type="text"
              value={form.opponent}
              onChange={(event) => setForm((prev) => ({ ...prev, opponent: event.target.value }))}
              placeholder="Ej. Gimnasio de Ciudad Celeste"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Resultado
            <select
              value={form.result}
              onChange={(event) => setForm((prev) => ({ ...prev, result: event.target.value as TrainerBattleRecord['result'] }))}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
            >
              <option value="victoria">Victoria</option>
              <option value="derrota">Derrota</option>
              <option value="empate">Empate</option>
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Equipo usado
          <input
            type="text"
            value={form.team}
            onChange={(event) => setForm((prev) => ({ ...prev, team: event.target.value }))}
            placeholder="Lista tus Pokémon separados por coma (ej. pikachu, snorlax, gengar)"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          Notas
          <textarea
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            rows={3}
            placeholder="Observaciones clave, aprendizajes, movimientos decisivos, etc."
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-amber-400"
          />
        </label>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">Los registros se almacenan localmente en tu navegador.</p>
          <button
            type="submit"
            className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-300"
          >
            Guardar combate
          </button>
        </div>
      </form>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6">
        <h3 className="text-lg font-semibold text-white">Resumen</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Victorias</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">{stats.victorias}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Derrotas</p>
            <p className="mt-2 text-2xl font-semibold text-rose-400">{stats.derrotas}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Empates</p>
            <p className="mt-2 text-2xl font-semibold text-slate-300">{stats.empates}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Ratio</p>
            <p className="mt-2 text-2xl font-semibold text-amber-300">{stats.ratio}%</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {records.length === 0 ? (
            <p className="text-sm text-slate-400">Aún no registras combates. ¡Comienza agregando uno arriba!</p>
          ) : (
            records.map((record) => (
              <article key={record.id} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{new Date(record.createdAt).toLocaleString()}</p>
                    <h4 className="text-base font-semibold text-white">vs {record.opponent}</h4>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                      record.result === 'victoria'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : record.result === 'derrota'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-slate-500/20 text-slate-200'
                    }`}
                  >
                    {record.result}
                  </span>
                </header>

                {record.team.length > 0 ? (
                  <p className="text-xs text-slate-400">
                    Equipo: <span className="text-slate-200">{record.team.join(', ')}</span>
                  </p>
                ) : null}

                {record.notes ? <p className="text-sm text-slate-300">{record.notes}</p> : null}

                <button
                  type="button"
                  onClick={() => removeRecord(record.id)}
                  className="text-xs font-semibold text-slate-500 transition hover:text-rose-300"
                >
                  Eliminar
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </section>
  )
}
