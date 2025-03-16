export interface GhostIOConfig {
  maxCacheSize?: number;
  prefetchOnHover?: boolean;
  prefetchOnScroll?: boolean;
  idlePrefetchDelay?: number;
  concurrencyLimit?: number;
}

export interface AxiosIntegrationOptions {
  instance: any;
}

export declare class GhostIO {
  constructor(config?: GhostIOConfig);
  registerAxios(options: AxiosIntegrationOptions): void;
  prefetch(url: string): Promise<void>;
  get(url: string): any | null;
  clearCache(): void;
}
