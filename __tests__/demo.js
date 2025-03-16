import { GhostIO } from "ghost-io";
import axios from "axios";

// Create a GhostIO instance (user must provide full URLs)
const ghost = new GhostIO({
  maxCacheSize: 20,
  concurrencyLimit: 2,
  idlePrefetchDelay: 4000,
});

// Optionally, integrate with an Axios instance
const api = axios.create();
ghost.registerAxios({ instance: api });

// Prefetch using a full absolute URL (no baseURL handling)
ghost
  .prefetch("https://pokeapi.co/api/v2/pokemon/ditto")
  .then(() => console.log("Prefetched Pokémon data for Ditto"))
  .catch((err) => console.error("Prefetch error:", err));

// Retrieve cached data after a delay
setTimeout(() => {
  const data = ghost.get("https://pokeapi.co/api/v2/pokemon/ditto");
  if (data) {
    console.log("Loaded Pokémon data from prefetch cache:", data);
  } else {
    console.log("No cached data for https://pokeapi.co/api/v2/pokemon/ditto");
  }
}, 5000);

// Should output something like:
// > ghost-io@1.1.2 demo
// > node __tests__/demo.js
//
// [GhostIO] Initialized with config: {
//   maxCacheSize: 20,
//   prefetchOnHover: true,
//   prefetchOnScroll: true,
//   idlePrefetchDelay: 4000,
//   concurrencyLimit: 2
// }
// [GhostIO] No DOM detected; ignoring hover/scroll events.
// [GhostIO] Axios integrated successfully.
// [GhostIO] Prefetching: https://pokeapi.co/api/v2/pokemon/ditto
// [GhostIO] Stored in cache: https://pokeapi.co/api/v2/pokemon/ditto
// [GhostIO] Prefetch succeeded for: https://pokeapi.co/api/v2/pokemon/ditto
// Prefetched Pokémon data for Ditto
// Loaded Pokémon data from prefetch cache: {
//   abilities: [
//     { ability: [Object], is_hidden: false, slot: 1 },
//     { ability: [Object], is_hidden: true, slot: 3 }
//   ],
//   base_experience: 101,
//   cries: {
//     latest: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/132.ogg',
//     legacy: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/132.ogg'
//   },
//   forms: [
//     {
//       name: 'ditto',
//       url: 'https://pokeapi.co/api/v2/pokemon-form/132/'
//     }
//   ],
//   game_indices: [
//     { game_index: 76, version: [Object] },
//     { game_index: 76, version: [Object] },
//     { game_index: 76, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] },
//     { game_index: 132, version: [Object] }
//   ],
//   height: 3,
//   held_items: [
//     { item: [Object], version_details: [Array] },
//     { item: [Object], version_details: [Array] }
//   ],
//   id: 132,
//   is_default: true,
//   location_area_encounters: 'https://pokeapi.co/api/v2/pokemon/132/encounters',
//   moves: [ { move: [Object], version_group_details: [Array] } ],
//   name: 'ditto',
//   order: 214,
//   past_abilities: [],
//   past_types: [],
//   species: {
//     name: 'ditto',
//     url: 'https://pokeapi.co/api/v2/pokemon-species/132/'
//   },
//   sprites: {
//     back_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/132.png',
//     back_female: null,
//     back_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/132.png',
//     back_shiny_female: null,
//     front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png',
//     front_female: null,
//     front_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/132.png',
//     front_shiny_female: null,
//     other: {
//       dream_world: [Object],
//       home: [Object],
//       'official-artwork': [Object],
//       showdown: [Object]
//     },
//     versions: {
//       'generation-i': [Object],
//       'generation-ii': [Object],
//       'generation-iii': [Object],
//       'generation-iv': [Object],
//       'generation-v': [Object],
//       'generation-vi': [Object],
//       'generation-vii': [Object],
//       'generation-viii': [Object]
//     }
//   },
//   stats: [
//     { base_stat: 48, effort: 1, stat: [Object] },
//     { base_stat: 48, effort: 0, stat: [Object] },
//     { base_stat: 48, effort: 0, stat: [Object] },
//     { base_stat: 48, effort: 0, stat: [Object] },
//     { base_stat: 48, effort: 0, stat: [Object] },
//     { base_stat: 48, effort: 0, stat: [Object] }
//   ],
//   types: [ { slot: 1, type: [Object] } ],
//   weight: 40
// }
