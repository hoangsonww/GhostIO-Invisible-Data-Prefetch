import axios from "axios";
const defaultConfig = {
  maxCacheSize: 50,
  prefetchOnHover: true,
  prefetchOnScroll: true,
  idlePrefetchDelay: 5000,
  concurrencyLimit: 3,
};
export class GhostIO {
  constructor(userConfig) {
    this.currentRequestsCount = 0;
    this.config = { ...defaultConfig, ...userConfig };
    this.cache = new Map();
    this.inFlight = new Set();
    this.axiosRegisteredInstances = new Set();
    console.log("[GhostIO] Initialized with config:", this.config);
    this.initEventListeners();
  }
  registerAxios(options) {
    const { instance } = options;
    if (!instance) {
      console.warn("[GhostIO] No Axios instance provided.");
      return;
    }
    if (this.axiosRegisteredInstances.has(instance)) {
      console.log("[GhostIO] Axios instance already registered.");
      return;
    }
    this.axiosRegisteredInstances.add(instance);
    // Intercept requests
    instance.interceptors.request.use(
      async (config) => {
        const url = config.url || "";
        // If already cached, short-circuit
        if (this.cache.has(url)) {
          console.log(
            `[GhostIO] Short-circuiting axios request from cache: ${url}`,
          );
          const fakeResponse = {
            data: this.cache.get(url),
            status: 200,
            statusText: "OK",
            headers: {},
            config,
            __ghostIOCache__: true,
          };
          return Promise.reject(fakeResponse); // cause short-circuit
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
    // Intercept responses
    instance.interceptors.response.use(
      (response) => {
        if (!response.__ghostIOCache__) {
          this.storeInCache(response.config.url, response.data);
        }
        return response;
      },
      (error) => {
        if (error && error.__ghostIOCache__) {
          // Return the short-circuited cached data
          return Promise.resolve(error);
        }
        return Promise.reject(error);
      },
    );
    console.log("[GhostIO] Axios integrated successfully.");
  }
  async prefetch(url) {
    if (this.cache.has(url)) {
      console.log(`[GhostIO] Prefetch skipped; already in cache: ${url}`);
      return;
    }
    if (this.inFlight.has(url)) {
      console.log(`[GhostIO] Prefetch skipped; already in-flight: ${url}`);
      return;
    }
    if (this.currentRequestsCount >= this.config.concurrencyLimit) {
      console.log(
        "[GhostIO] Concurrency limit reached; deferring prefetch:",
        url,
      );
      return;
    }
    console.log("[GhostIO] Prefetching:", url);
    this.inFlight.add(url);
    this.currentRequestsCount++;
    try {
      const response = await axios.get(url);
      this.storeInCache(url, response.data);
    } catch (err) {
      console.warn("[GhostIO] Failed to prefetch:", url, err);
    } finally {
      this.inFlight.delete(url);
      this.currentRequestsCount--;
    }
  }
  get(url) {
    return this.cache.has(url) ? this.cache.get(url) : null;
  }
  clearCache() {
    console.log("[GhostIO] Clearing entire cache.");
    this.cache.clear();
  }
  storeInCache(url, data) {
    this.cache.set(url, data);
    console.log("[GhostIO] Stored in cache:", url);
    if (this.cache.size > this.config.maxCacheSize) {
      // Remove oldest key
      const oldestKey = this.cache.keys().next().value;
      // @ts-ignore
      this.cache.delete(oldestKey);
      console.log(
        "[GhostIO] Cache exceeded max size; removed oldest entry:",
        oldestKey,
      );
    }
  }
  initEventListeners() {
    if (typeof document === "undefined") {
      console.warn("[GhostIO] No DOM detected; ignoring hover/scroll events.");
      return;
    }
    // Prefetch on hover
    if (this.config.prefetchOnHover) {
      document.addEventListener("mouseover", this.onHover.bind(this));
    }
    // Prefetch on scroll
    if (this.config.prefetchOnScroll) {
      document.addEventListener("scroll", this.onScroll.bind(this));
    }
    // Idle prefetch
    if (this.config.idlePrefetchDelay > 0) {
      let idleTimeout;
      const resetTimer = () => {
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(
          () => this.idlePrefetch(),
          this.config.idlePrefetchDelay,
        );
      };
      document.addEventListener("mousemove", resetTimer);
      document.addEventListener("keypress", resetTimer);
      document.addEventListener("scroll", resetTimer);
      // initial
      resetTimer();
    }
  }
  onHover(e) {
    const target = e.target?.closest("[data-prefetch]");
    if (!target) return;
    const url = target.getAttribute("data-prefetch");
    if (url) {
      this.prefetch(url);
    }
  }
  onScroll() {
    // look for any elements with data-prefetch in view
    const elements = document.querySelectorAll("[data-prefetch]");
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.5) {
        const url = el.getAttribute("data-prefetch");
        if (url) {
          this.prefetch(url);
        }
      }
    });
  }
  idlePrefetch() {
    console.log(
      "[GhostIO] User idle detected; running background prefetch tasks.",
    );
    document.querySelectorAll("[data-prefetch]").forEach((el) => {
      const url = el.getAttribute("data-prefetch");
      if (url) this.prefetch(url);
    });
  }
}
