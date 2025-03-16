import { GhostIOConfig, AxiosIntegrationOptions } from "../index.js";
export declare class GhostIO {
  private config;
  private cache;
  private inFlight;
  private axiosRegisteredInstances;
  private currentRequestsCount;
  constructor(userConfig?: GhostIOConfig);
  registerAxios(options: AxiosIntegrationOptions): void;
  prefetch(url: string): Promise<void>;
  get(url: string): any;
  clearCache(): void;
  private storeInCache;
  private initEventListeners;
  private onHover;
  private onScroll;
  private idlePrefetch;
}
//# sourceMappingURL=ghostIO.d.ts.map
