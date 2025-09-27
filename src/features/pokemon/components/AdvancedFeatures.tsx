import { PokemonComparator } from './PokemonComparator'
import { TeamRecommender } from './TeamRecommender'
import { EvolutionTimeline } from './EvolutionTimeline'
import { TrainerMode } from './TrainerMode'
import { TriviaGame } from './TriviaGame'

export const AdvancedFeatures = () => (
  <div className="space-y-12">
    <PokemonComparator />
    <TeamRecommender />
    <EvolutionTimeline />
    <TrainerMode />
    <TriviaGame />
  </div>
)
