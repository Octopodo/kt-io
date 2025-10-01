![KT IO Banner](docs/img/banner_io.jpg)

# KT-IO

A TypeScript library for file I/O operations in Adobe ExtendScript environments (e.g., After Effects, Photoshop, Illustrator).

## Overview

KT-IO provides a comprehensive set of static methods for common file system operations in ExtendScript. It abstracts away low-level File and Folder objects, offering a simple, consistent API for reading/writing files, JSON serialization, directory management, and path resolution with cross-platform compatibility.

All this environment is based on [Bolt CEP](https://github.com/hyperbrew/bolt-cep) building code, so you can use it with Bolt itself. Also it uses [Types for Adobe](https://github.com/docsforadobe/Types-for-Adobe) for Adobe Apps TypeScript support.

## Installation

To install KT-IO, use the following command:

```bash
npm install kt-io
```

## Basic Usage

Here are some examples of how to use KT-IO:

```typescript
// src/index.ts
import { IO } from "kt-io";

// Check if file exists
if (IO.fs.fileExists("data.txt")) {
    // Read file content
    const content = IO.fs.readFile("data.txt");
    alert("File content: " + content);
}

// Write JSON data
const config = { theme: "dark", language: "en" };
IO.fs.writeJson("config.json", config);

// Copy files
IO.fs.copyFile("source.txt", "backup.txt");
```

## File Operations

KT-IO supports various file operations:

```typescript
// File existence and metadata
const exists = IO.fs.fileExists("file.txt");
const size = IO.fs.getFileSize("file.txt");
const modified = IO.fs.getFileModifiedDate("file.txt");

// File operations
IO.fs.copyFile("source.txt", "dest.txt");
IO.fs.moveFile("old.txt", "new.txt");
IO.fs.deleteFile("temp.txt");

// Directory operations
IO.fs.createDirectory("logs", true); // recursive
const files = IO.fs.listFiles("data", /\.txt$/);
```

## Build Scripts

To transpile for ExtendScript, run:

```bash
npm run build
```

## Documentation

For more detailed documentation, please refer to the specific README files in the `docs` folder:

- [API Reference](docs/API.md)
- [Examples](docs/Examples.md)

## Test Files

You can find the test files in the `src/tests` directory:

- [IO Tests](src/tests/index.test.ts)

For more examples and detailed usage, please refer to the test files in the repository.

## Links

- [KT ExtendScript Builder](https://github.com/Octopodo/kt-extendscript-builder)
- [KT Testing Suite Core](https://github.com/Octopodo/kt-testing-suite-core)
- [Bolt CEP](https://github.com/hyperbrew/bolt-cep)
- [After Effects Scripting Guide](https://ae-scripting.docsforadobe.dev/)
- [Types for Adobe](https://github.com/docsforadobe/Types-for-Adobe)

## License

MIT
