const API_BASE_URL = 'https://pokeapi.co/api/v2';
const MAX_POKEMON = 386;
export const buildArtworkUrl = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
export const extractIdFromUrl = (url) => {
    const match = url.match(/\/(\d+)\/?$/);
    if (!match)
        throw new Error(`No se pudo extraer el ID de ${url}`);
    return Number.parseInt(match[1], 10);
};
const normalizeStat = ({ base_stat: value, stat }) => ({
    name: stat.name,
    value
});
const computeGeneration = (id) => {
    if (id <= 151)
        return 1;
    if (id <= 251)
        return 2;
    return 3;
};
const normalizePokemon = (raw) => {
    const artwork = raw.sprites.other?.['official-artwork']?.front_default ?? raw.sprites.front_default;
    return {
        id: raw.id,
        name: raw.name,
        image: artwork ?? buildArtworkUrl(raw.id),
        types: raw.types
            .sort((a, b) => a.slot - b.slot)
            .map((entry) => entry.type.name),
        height: raw.height,
        weight: raw.weight,
        abilities: raw.abilities.map((entry) => entry.ability.name),
        stats: raw.stats.map(normalizeStat),
        generation: computeGeneration(raw.id)
    };
};
let allPokemonCache = null;
let allPokemonPromise = null;
const loadAllPokemonSummaries = async () => {
    if (allPokemonCache)
        return allPokemonCache;
    if (allPokemonPromise)
        return await allPokemonPromise;
    allPokemonPromise = (async () => {
        const chunkSize = 60;
        const all = [];
        for (let offset = 0; offset < MAX_POKEMON; offset += chunkSize) {
            const limit = Math.min(chunkSize, MAX_POKEMON - offset);
            const listUrl = `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
            const data = await fetchJson(listUrl);
            const details = await Promise.all(data.results.map(async ({ url }) => await fetchPokemonDetails(url)));
            all.push(...details);
        }
        allPokemonCache = all.sort((a, b) => a.id - b.id);
        return allPokemonCache;
    })();
    const result = await allPokemonPromise;
    return result;
};
const matchesSearch = (pokemon, term) => {
    const normalized = term.trim().toLowerCase();
    if (!normalized)
        return true;
    if (pokemon.name.toLowerCase().includes(normalized))
        return true;
    if (pokemon.types.some((type) => type.toLowerCase().includes(normalized)))
        return true;
    const idString = pokemon.id.toString();
    return idString.startsWith(normalized);
};
const matchesTypes = (pokemon, types) => {
    if (!types || types.length === 0)
        return true;
    return types.every((type) => pokemon.types.includes(type));
};
const matchesGeneration = (pokemon, generation) => {
    if (!generation)
        return true;
    return pokemon.generation === generation;
};
const matchesStatFilter = (pokemon, statFilter) => {
    if (!statFilter || !statFilter.name)
        return true;
    const stat = pokemon.stats.find((entry) => entry.name === statFilter.name);
    if (!stat)
        return false;
    const meetsMin = statFilter.min == null || stat.value >= statFilter.min;
    const meetsMax = statFilter.max == null || stat.value <= statFilter.max;
    return meetsMin && meetsMax;
};
const applyFilters = (pokemon, filters) => {
    if (!filters)
        return true;
    const { search, types, generation, statFilter } = filters;
    return (matchesSearch(pokemon, search ?? '') &&
        matchesTypes(pokemon, types) &&
        matchesGeneration(pokemon, generation) &&
        matchesStatFilter(pokemon, statFilter));
};
const fetchJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error al obtener datos (${response.status})`);
    }
    return await response.json();
};
const fetchPokemonDetails = async (url) => {
    const raw = await fetchJson(url);
    return normalizePokemon(raw);
};
export const fetchPokemonList = async ({ page, pageSize, filters }) => {
    const safePage = Math.max(page, 0);
    const safePageSize = Math.max(pageSize, 1);
    const filtersActive = Boolean(filters && ((filters.search && filters.search.trim() !== '') ||
        (filters.types && filters.types.length > 0) ||
        (filters.generation && filters.generation > 0) ||
        (filters.statFilter && filters.statFilter.name)));
    if (filtersActive) {
        const all = await loadAllPokemonSummaries();
        const filtered = all.filter((pokemon) => applyFilters(pokemon, filters));
        const total = filtered.length;
        const start = safePage * safePageSize;
        const items = filtered.slice(start, start + safePageSize);
        return {
            items,
            total,
            page: safePage,
            pageSize: safePageSize
        };
    }
    const offset = safePage * safePageSize;
    if (offset >= MAX_POKEMON) {
        return {
            items: [],
            total: MAX_POKEMON,
            page: safePage,
            pageSize: safePageSize
        };
    }
    const cappedLimit = Math.min(safePageSize, MAX_POKEMON - offset);
    const listUrl = `${API_BASE_URL}/pokemon?limit=${cappedLimit}&offset=${offset}`;
    const data = await fetchJson(listUrl);
    const items = await Promise.all(data.results.map(async ({ url }) => {
        const id = extractIdFromUrl(url);
        const pokemonUrl = `${API_BASE_URL}/pokemon/${id}`;
        return await fetchPokemonDetails(pokemonUrl);
    }));
    return {
        items,
        total: MAX_POKEMON,
        page: safePage,
        pageSize: safePageSize
    };
};
export const fetchPokemonByName = async (term) => {
    const normalizedTerm = term.trim().toLowerCase();
    if (!normalizedTerm) {
        throw new Error('El término de búsqueda no puede estar vacío');
    }
    const url = `${API_BASE_URL}/pokemon/${normalizedTerm}`;
    const raw = await fetchJson(url);
    return normalizePokemon(raw);
};
export const searchPokemonSuggestions = async (term, limit = 10) => {
    const normalizedTerm = term.trim().toLowerCase();
    if (normalizedTerm.length < 2)
        return [];
    const all = await loadAllPokemonSummaries();
    return all
        .filter((pokemon) => matchesSearch(pokemon, normalizedTerm))
        .slice(0, limit);
};
const describeEvolutionDetail = (detail) => {
    const conditions = [];
    if (detail.min_level) {
        conditions.push(`Nivel ${detail.min_level}`);
    }
    if (detail.item) {
        conditions.push(`Item: ${detail.item.name}`);
    }
    if (detail.held_item) {
        conditions.push(`Objeto equipado: ${detail.held_item.name}`);
    }
    if (detail.location) {
        conditions.push(`Ubicación: ${detail.location.name}`);
    }
    if (detail.time_of_day && detail.time_of_day !== '') {
        conditions.push(`Momento del día: ${detail.time_of_day}`);
    }
    if (detail.min_happiness) {
        conditions.push(`Amistad mínima: ${detail.min_happiness}`);
    }
    if (detail.min_beauty) {
        conditions.push(`Belleza mínima: ${detail.min_beauty}`);
    }
    if (detail.min_affection) {
        conditions.push(`Afecto mínimo: ${detail.min_affection}`);
    }
    if (detail.needs_overworld_rain) {
        conditions.push('Lluvia en el mapa');
    }
    if (detail.turn_upside_down) {
        conditions.push('Consola invertida');
    }
    if (detail.relative_physical_stats !== null) {
        const relation = detail.relative_physical_stats === 1 ? 'Ataque > Defensa' : 'Ataque < Defensa';
        conditions.push(`Estadísticas: ${relation}`);
    }
    if (detail.gender !== null) {
        conditions.push(`Género: ${detail.gender === 1 ? 'Hembra' : 'Macho'}`);
    }
    if (detail.known_move) {
        conditions.push(`Movimiento: ${detail.known_move.name}`);
    }
    if (detail.known_move_type) {
        conditions.push(`Tipo de movimiento: ${detail.known_move_type.name}`);
    }
    return conditions;
};
const flattenEvolutionChain = (link, accumulator = [], incomingDetail = null) => {
    const id = extractIdFromUrl(link.species.url);
    const trigger = incomingDetail?.trigger?.name ?? 'Inicio';
    const step = {
        id,
        name: link.species.name,
        trigger,
        minLevel: incomingDetail?.min_level ?? null,
        conditions: incomingDetail ? describeEvolutionDetail(incomingDetail) : undefined,
        image: buildArtworkUrl(id)
    };
    accumulator.push(step);
    for (const child of link.evolves_to) {
        if (child.evolution_details.length === 0) {
            flattenEvolutionChain(child, accumulator, null);
            continue;
        }
        for (const detail of child.evolution_details) {
            flattenEvolutionChain(child, accumulator, detail);
        }
    }
    return accumulator;
};
export const fetchEvolutionTimeline = async (name) => {
    const normalizedName = name.trim().toLowerCase();
    if (!normalizedName)
        throw new Error('Debes indicar un Pokémon válido');
    const speciesUrl = `${API_BASE_URL}/pokemon-species/${normalizedName}`;
    const species = await fetchJson(speciesUrl);
    const chain = await fetchJson(species.evolution_chain.url);
    const timeline = flattenEvolutionChain(chain.chain);
    // Garantiza orden por aparición en la cadena
    const uniqueById = new Map();
    timeline.forEach((step) => {
        if (!uniqueById.has(step.id)) {
            uniqueById.set(step.id, { ...step, conditions: step.conditions ?? undefined });
        }
        else if (step.conditions?.length) {
            const existing = uniqueById.get(step.id);
            uniqueById.set(step.id, {
                ...existing,
                conditions: Array.from(new Set([...(existing.conditions ?? []), ...step.conditions]))
            });
        }
    });
    return Array.from(uniqueById.values());
};
const fetchPokemonByType = async (type) => {
    const normalizedType = type.trim().toLowerCase();
    const url = `${API_BASE_URL}/type/${normalizedType}`;
    const data = await fetchJson(url);
    return data.pokemon.map((entry) => entry.pokemon.name);
};
const FALLBACK_TEAM = ['pikachu', 'charizard', 'blastoise', 'venusaur', 'gengar', 'dragonite'];
export const recommendTeamByTypes = async (types) => {
    const sanitizedTypes = types.map((type) => type.trim().toLowerCase()).filter(Boolean);
    const pools = [];
    if (sanitizedTypes.length === 0) {
        pools.push(FALLBACK_TEAM);
    }
    else {
        const results = await Promise.allSettled(sanitizedTypes.map(async (type) => await fetchPokemonByType(type)));
        for (const result of results) {
            if (result.status === 'fulfilled') {
                pools.push(result.value);
            }
        }
    }
    if (pools.length === 0) {
        pools.push(FALLBACK_TEAM);
    }
    const candidates = Array.from(new Set(pools.flat())).slice(0, 60);
    const team = [];
    for (const name of candidates) {
        try {
            const pokemon = await fetchPokemonByName(name);
            if (team.some((member) => member.id === pokemon.id))
                continue;
            team.push(pokemon);
            if (team.length === 6)
                break;
        }
        catch (error) {
            // ignorar y seguir con el siguiente candidato
        }
    }
    if (team.length < 6) {
        for (const fallbackName of FALLBACK_TEAM) {
            if (team.length === 6)
                break;
            if (team.some((member) => member.name === fallbackName))
                continue;
            try {
                const pokemon = await fetchPokemonByName(fallbackName);
                team.push(pokemon);
            }
            catch (error) {
                // ignorar
            }
        }
    }
    return team;
};
export const fetchRandomPokemonSummary = async () => {
    const randomId = Math.floor(Math.random() * MAX_POKEMON) + 1;
    const url = `${API_BASE_URL}/pokemon/${randomId}`;
    const raw = await fetchJson(url);
    return normalizePokemon(raw);
};
