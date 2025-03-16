import { GhostIO } from "ghost-io";
import axios from "axios";

// 1) Create a GhostIO instance with custom configuration
const ghost = new GhostIO({
  maxCacheSize: 20,
  concurrencyLimit: 2,
  idlePrefetchDelay: 4000,
});

// 2) Integrate with an Axios instance
const api = axios.create({ baseURL: "https://pokeapi.co/api/v2" });
ghost.registerAxios({ instance: api });

// 3) Prefetch some data manually from the Pokémon API
ghost.prefetch("/pokemon/ditto")
  .then(() => console.log("Prefetched Pokémon data for Ditto"))
  .catch((err) => console.error("Prefetch error:", err));

// 4) In your HTML, mark links or buttons with data-prefetch attributes
// Example HTML snippet:
// <a data-prefetch="/pokemon/pikachu" href="/pokemon/pikachu">View Pikachu</a>
// GhostIO will automatically prefetch /pokemon/pikachu when the user hovers or scrolls near the element.

// 5) Retrieve cached data manually
setTimeout(() => {
  const cachedData = ghost.get("/pokemon/ditto");
  if (cachedData) {
    console.log("Loaded Pokémon data from prefetch cache:", cachedData);
  } else {
    console.log("No cached data available; fetching fresh data...");
  }
}, 5000);
