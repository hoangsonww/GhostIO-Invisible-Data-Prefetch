# 👻 GhostIO – Invisible Background Data Prefetching

[![NPM version](https://img.shields.io/npm/v/ghost-io.svg?style=flat&logo=npm)](https://www.npmjs.com/package/ghost-io)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat&logo=opensource)](LICENSE)  
[![Node.js](https://img.shields.io/badge/Node-%3E%3D14-brightgreen.svg?style=flat&logo=node.js)](https://nodejs.org/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)

**GhostIO** is a smart background prefetching library that invisibly loads API data based on user behavior. By leveraging heuristics like hover, scroll, and idle detection, GhostIO speeds up your SPA or dashboard by preloading API responses before they’re requested.

Currently available on NPM: [https://www.npmjs.com/package/ghost-io](https://www.npmjs.com/package/ghost-io)

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Prefetch on Hover, Scroll, & Idle](#prefetch-on-hover-scroll--idle)
  - [Axios Integration](#axios-integration)
  - [Manually Prefetching and Retrieving Cached Data](#manually-prefetching-and-retrieving-cached-data)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Building & Publishing](#building--publishing)
- [Contributing](#contributing)
- [License](#license)
- [Final Remarks](#final-remarks)

---

## Features

- **Invisible Prefetching:** Automatically preloads API data based on user behavior before it is needed.
- **Heuristic-Driven:** Detects hover, scroll proximity, and idle network time to trigger prefetching.
- **In-Memory Caching:** Caches prefetched responses for quick retrieval and deduplication.
- **Concurrency Control:** Limits the number of simultaneous prefetch requests.
- **Axios Integration:** Seamlessly integrate with Axios to intercept and reuse prefetched responses.
- **Customizable:** Fully configurable behavior through an easy-to-use API.
- **TypeScript Support:** Written in TypeScript with complete type definitions for robust development.

---

## Installation

### Prerequisites

- Node.js v14 or higher
- npm v6 or higher

### Via NPM

```bash
npm install ghost-io
```

### Via Yarn

```bash
yarn add ghost-io
```

---

## Usage

GhostIO can be used to automatically prefetch API data based on various user interactions. Below are several use case examples.

### Basic Usage

Create a new instance of GhostIO with default configuration:

```ts
import { GhostIO } from "ghost-io";

const ghost = new GhostIO();
```

This initializes GhostIO with default settings:

- Maximum cache size of 50 items.
- Prefetching on hover and scroll enabled.
- Idle prefetch triggered after 5000ms.
- Concurrency limited to 3 simultaneous requests.

### Prefetch on Hover, Scroll, & Idle

GhostIO listens for user interactions (hover, scroll, idle) on elements marked with a `data-prefetch` attribute.

#### Example HTML

```html
<!-- When user hovers or scrolls near this link, GhostIO prefetches the data -->
<a href="/dashboard" data-prefetch="/api/dashboard">Dashboard</a>
```

#### How It Works

- **Hover:** GhostIO listens for `mouseover` events on elements with `data-prefetch` and triggers prefetching.
- **Scroll:** GhostIO checks for elements with `data-prefetch` that are near the viewport.
- **Idle:** After a period of inactivity (configurable delay), GhostIO prefetches all resources marked with `data-prefetch`.

### Axios Integration

Integrate GhostIO with your Axios instance to deduplicate requests and utilize cached data.

```ts
import axios from "axios";
import { GhostIO } from "ghost-io";

const ghost = new GhostIO();

// Create an Axios instance
const api = axios.create({ baseURL: "https://api.example.com" });

// Register the Axios instance with GhostIO
ghost.registerAxios({ instance: api });

// Now when you make requests, if the data has been prefetched,
// GhostIO intercepts and serves cached data.
api
  .get("/user-data")
  .then((response) => console.log("Axios fetched data:", response.data))
  .catch((error) => console.error("Axios error:", error));
```

### Manually Prefetching and Retrieving Cached Data

You can manually trigger prefetching and later retrieve cached data.

#### Manually Trigger Prefetch

```ts
import { GhostIO } from "ghost-io";

const ghost = new GhostIO();
ghost
  .prefetch("/api/stats")
  .then(() => console.log("Successfully prefetched /api/stats"))
  .catch((err) => console.error("Prefetch error:", err));
```

#### Retrieve Cached Data

```ts
const cachedStats = ghost.get("/api/stats");
if (cachedStats) {
  console.log("Cached stats:", cachedStats);
} else {
  console.log("No cached data; fetch from API instead.");
}
```

---

## API Reference

### `class GhostIO`

- **Constructor:**  
  `new GhostIO(config?: GhostIOConfig)`  
  Initializes GhostIO with the following configurable options:
  - `maxCacheSize` (default: 50): Maximum number of prefetched items.
  - `prefetchOnHover` (default: true): Enable prefetching on hover events.
  - `prefetchOnScroll` (default: true): Enable prefetching when scrolling near elements.
  - `idlePrefetchDelay` (default: 5000): Delay (in ms) before prefetching when the user is idle.
  - `concurrencyLimit` (default: 3): Maximum number of simultaneous prefetch requests.

### Methods

- **`prefetch(url: string): Promise<void>`**  
  Manually prefetch data from the specified URL.

- **`get(url: string): any | null`**  
  Returns the cached data for the given URL, or `null` if not cached.

- **`clearCache(): void`**  
  Clears the entire prefetch cache.

- **`registerAxios(options: AxiosIntegrationOptions): void`**  
  Integrates GhostIO with a provided Axios instance.  
  _Parameters:_
  - `instance`: An Axios instance.

---

## Testing

The package comes with a comprehensive Jest test suite.

### Run Tests

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run tests:
   ```bash
   npm test
   ```

Test files in the `__tests__` directory cover event-based prefetching, cache management, and Axios integration.

### Demo Script

A demo script is included in the `__tests__` directory. To run the demo:

```bash
npm run demo
```

This will execute a series of prefetching scenarios to showcase GhostIO's capabilities.

---

## Building & Publishing

### Building

Compile the TypeScript source code:

```bash
npm run build
```

### Publishing

1. Log in to npm:
   ```bash
   npm login
   ```
2. Publish the package:
   ```bash
   npm publish --access public
   ```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. **Commit Your Changes**
4. **Submit a Pull Request**

For major changes, please open an issue first to discuss your ideas.

---

## License

This project is licensed under the MIT License.

---

## Final Remarks

**GhostIO** enhances user experience by prefetching API data based on real user interactions such as hover, scroll, and idle time. With support for Axios integration and configurable options, it is perfect for SPAs, dashboards, and dynamic web applications where speed and responsiveness are key.

Happy prefetching! 👻🚀
