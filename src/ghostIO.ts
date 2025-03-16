import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { GhostIOConfig, AxiosIntegrationOptions } from "../index.js";

interface InternalConfig {
  maxCacheSize: number;
  prefetchOnHover: boolean;
  prefetchOnScroll: boolean;
  idlePrefetchDelay: number;
  concurrencyLimit: number;
}

const defaultConfig: InternalConfig = {
  maxCacheSize: 50,
  prefetchOnHover: true,
  prefetchOnScroll: true,
  idlePrefetchDelay: 5000,
  concurrencyLimit: 3,
};

export class GhostIO {
  private config: InternalConfig;
  private cache: Map<string, any>;
  private inFlight: Set<string>;
  private axiosRegisteredInstances: Set<any>;
  private currentRequestsCount = 0;

  constructor(userConfig?: GhostIOConfig) {
    this.config = { ...defaultConfig, ...userConfig };
    this.cache = new Map();
    this.inFlight = new Set();
    this.axiosRegisteredInstances = new Set();
    console.log("[GhostIO] Initialized with config:", this.config);
    this.initEventListeners();
  }

  registerAxios(options: AxiosIntegrationOptions): void {
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
      async (config: any) => {
        const url = config.url || "";
        // If already cached, short-circuit the request
        if (this.cache.has(url)) {
          console.log(
            `[GhostIO] Short-circuiting axios request from cache: ${url}`
          );
          const fakeResponse = {
            data: this.cache.get(url),
            status: 200,
            statusText: "OK",
            headers: {},
            config,
            __ghostIOCache__: true,
          };
          return Promise.reject(fakeResponse); // trigger short-circuit
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Intercept responses
    instance.interceptors.response.use(
      (response: any) => {
        if (!response.__ghostIOCache__) {
          this.storeInCache(response.config.url, response.data);
        }
        return response;
      },
      (error: any) => {
        if (error && error.__ghostIOCache__) {
          // Return the short-circuited cached data
          return Promise.resolve(error);
        }
        return Promise.reject(error);
      }
    );
    console.log("[GhostIO] Axios integrated successfully.");
  }

  async prefetch(url: string): Promise<void> {
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
        url
      );
      return;
    }

    console.log("[GhostIO] Prefetching:", url);
    this.inFlight.add(url);
    this.currentRequestsCount++;

    try {
      const response = await axios.get(url);
      this.storeInCache(url, response.data);
      console.log("[GhostIO] Prefetch succeeded for:", url);
    } catch (err) {
      console.warn("[GhostIO] Failed to prefetch:", url, err);
    } finally {
      this.inFlight.delete(url);
      this.currentRequestsCount--;
    }
  }

  get(url: string) {
    return this.cache.has(url) ? this.cache.get(url) : null;
  }

  clearCache(): void {
    console.log("[GhostIO] Clearing entire cache.");
    this.cache.clear();
  }

  private storeInCache(url: string, data: any) {
    this.cache.set(url, data);
    console.log("[GhostIO] Stored in cache:", url);
    if (this.cache.size > this.config.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      // Remove the oldest entry
      // @ts-ignore
      this.cache.delete(oldestKey);
      console.log(
        "[GhostIO] Cache exceeded max size; removed oldest entry:",
        oldestKey
      );
    }
  }

  private initEventListeners() {
    if (typeof document === "undefined") {
      console.warn("[GhostIO] No DOM detected; ignoring hover/scroll events.");
      return;
    }

    // Prefetch on hover
    if (this.config.prefetchOnHover) {
      document.addEventListener("mouseover", this.onHover.bind(this));
      console.log("[GhostIO] Hover prefetch event listener attached.");
    }

    // Prefetch on scroll
    if (this.config.prefetchOnScroll) {
      document.addEventListener("scroll", this.onScroll.bind(this));
      console.log("[GhostIO] Scroll prefetch event listener attached.");
    }

    // Idle prefetch
    if (this.config.idlePrefetchDelay > 0) {
      let idleTimeout: NodeJS.Timeout;
      const resetTimer = () => {
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(
          () => this.idlePrefetch(),
          this.config.idlePrefetchDelay
        );
      };
      document.addEventListener("mousemove", resetTimer);
      document.addEventListener("keypress", resetTimer);
      document.addEventListener("scroll", resetTimer);
      resetTimer();
      console.log("[GhostIO] Idle prefetch event listeners attached.");
    }
  }

  private onHover(e: MouseEvent) {
    const target = (e.target as HTMLElement)?.closest("[data-prefetch]");
    if (!target) return;
    const url = target.getAttribute("data-prefetch");
    if (url) {
      console.log("[GhostIO] Detected hover on element with data-prefetch:", url);
      this.prefetch(url);
    }
  }

  private onScroll() {
    const elements = document.querySelectorAll("[data-prefetch]");
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.5) {
        const url = el.getAttribute("data-prefetch");
        if (url) {
          console.log("[GhostIO] Element in view during scroll with data-prefetch:", url);
          this.prefetch(url);
        }
      }
    });
  }

  private idlePrefetch() {
    console.log("[GhostIO] User idle detected; running background prefetch tasks.");
    document.querySelectorAll("[data-prefetch]").forEach((el) => {
      const url = el.getAttribute("data-prefetch");
      if (url) {
        this.prefetch(url);
      }
    });
  }
}
