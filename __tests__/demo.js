import { GhostIO } from "ghost-io";
import axios from "axios";

// 1) Create a GhostIO instance
const ghost = new GhostIO({
  maxCacheSize: 20,
  concurrencyLimit: 2,
  idlePrefetchDelay: 4000,
});

// 2) Integrate with an Axios instance
const api = axios.create({ baseURL: "https://example.com" });
ghost.registerAxios({ instance: api });

// 3) Prefetch some data manually
ghost.prefetch("/api/users");

// 4) In your HTML, mark links or buttons with data-prefetch attributes
// <a data-prefetch="/api/dashboard" href="/dashboard">Go to Dashboard</a>

// GhostIO will automatically prefetch /api/dashboard in the background
// once the user hovers or scrolls near the link!

// 5) If you want to retrieve the cached data manually:
const cachedUsers = ghost.get("/api/users");
if (cachedUsers) {
  console.log("Loaded user data from prefetch cache:", cachedUsers);
} else {
  // fallback to normal fetch
}
