export interface PokemonStat {
  name: string
  value: number
}

export interface PokemonSummary {
  id: number
  name: string
  image: string
  types: string[]
  height: number
  weight: number
  abilities: string[]
  stats: PokemonStat[]
  generation: number
}

export interface PokemonListResult {
  items: PokemonSummary[]
  total: number
  page: number
  pageSize: number
}

export interface PokemonListParams {
  page: number
  pageSize: number
  filters?: PokemonListFilters
}

export interface StatFilter {
  name: string
  min?: number | null
  max?: number | null
}

export interface PokemonListFilters {
  search?: string
  types?: string[]
  generation?: number | null
  statFilter?: StatFilter | null
}

export interface EvolutionStep {
  id: number
  name: string
  trigger: string
  minLevel?: number | null
  conditions?: string[]
  image: string
}

export interface TrainerBattleRecord {
  id: string
  opponent: string
  result: 'victoria' | 'derrota' | 'empate'
  team: string[]
  notes?: string
  createdAt: string
}
