import { GhostIO } from "../dist/index.js";

describe("GhostIO", () => {
  let ghost: GhostIO;

  beforeEach(() => {
    // Mock DOM if needed, or set up JSDOM environment
    (global as any).document = {
      addEventListener: jest.fn(),
      querySelectorAll: jest.fn(() => []),
    };
    ghost = new GhostIO({
      maxCacheSize: 2,
      concurrencyLimit: 1
    });
  });

  afterEach(() => {
    // Cleanup
    delete (global as any).document;
  });

  it("initializes with config", () => {
    expect(ghost).toBeTruthy();
  });

  it("can store and retrieve from cache", () => {
    ghost["storeInCache"]("/test", { foo: "bar" });
    const data = ghost.get("/test");
    expect(data).toEqual({ foo: "bar" });
  });

  it("evicts oldest when exceeding maxCacheSize", () => {
    ghost["storeInCache"]("/first", { a: 1 });
    ghost["storeInCache"]("/second", { b: 2 });
    ghost["storeInCache"]("/third", { c: 3 });
    // since maxCacheSize = 2, it should have removed "/first"
    expect(ghost.get("/first")).toBeNull();
    expect(ghost.get("/second")).toEqual({ b: 2 });
    expect(ghost.get("/third")).toEqual({ c: 3 });
  });

  // Additional tests for concurrency, etc.
});
