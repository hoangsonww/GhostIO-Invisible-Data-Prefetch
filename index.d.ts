export interface GhostIOConfig {
  maxCacheSize?: number;        // max items to store in memory
  prefetchOnHover?: boolean;    // fetch on element hover
  prefetchOnScroll?: boolean;   // fetch on scroll proximity
  idlePrefetchDelay?: number;   // ms to wait after user idle to prefetch
  concurrencyLimit?: number;    // limit concurrent prefetch requests
}

export interface AxiosIntegrationOptions {
  instance: any;               // user-provided Axios instance
}

export declare class GhostIO {
  constructor(config?: GhostIOConfig);

  // Attach prefetch to an Axios instance
  registerAxios(options: AxiosIntegrationOptions): void;

  // Prefetch data for the given URL
  prefetch(url: string): Promise<void>;

  // Returns data from the cache (or null)
  get(url: string): any | null;

  // Clears the entire prefetch cache
  clearCache(): void;
}
