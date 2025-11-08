# KT-IO - AI Agent Instructions

## Project Overview

This is a TypeScript library providing comprehensive file I/O operations for Adobe ExtendScript environments (After Effects, Photoshop, Illustrator, etc.). It offers a high-level API for file system operations, path utilities, directory scanning, and JSON serialization with cross-platform compatibility.

## Architecture & Key Components

### Core Module Structure

- **`IO.ts`**: Main module that exports the `IO` class with static submodules (`path`, `fs`, `utils`)
- **`fs.ts`**: File system operations (read/write/copy/move/delete files and directories)
- **`path.ts`**: Path manipulation utilities and cross-platform path handling
- **`utils.ts`**: High-level utilities including directory scanning and folder tree creation
- **`validateFileType.ts`**: File type validation utilities
- **ExtendScript Compatibility**: Targets ES3 with CommonJS modules for Adobe's scripting environment

### Functional Areas

- **`fs` submodule**: Low-level file operations using ExtendScript's File/Folder objects
- **`path` submodule**: Path resolution, joining, sanitization, and file name extraction
- **`utils` submodule**: High-level operations like `scanFolder()` for directory traversal and `createFolderTree()` for project structure creation
- **Descriptor Classes**: `KT_FileDescriptor` and `KT_FolderDescriptor` for structured file system representation

## Development Workflow

### Build System

- **Primary Build**: `npm run build` → invokes `kt-build`
- **Test Builds**:
    - `npm run build-tests` → builds `src/tests/index.test.ts` to `dist.test/index.test.js` (minified)
    - `npm run debug-build-tests` → same build without minification
- **Configuration**: `kt.config.json` defines build inputs/outputs and options

### Testing

- Uses `kt-testing-suite-core` framework
- Tests located in `src/tests/` (not `tests/` root)
- Import testing utilities: `describe`, `it`, `expect`, `runTests`, `beforeAll`, etc.
- Uses testing suite repos: https://github.com/Octopodo/kt-testing-suite-core
- In order to run tests, you need to import the current testing file on `index.test.ts` and comment the other test imports

## Code Patterns & Conventions

- **Comments**: Always write comments in english even if I ask you in another language
- **Naming**: Same as comments, always use english names for variables, functions, classes, etc.
- **Loops**: Use `for` loops instead of Array and Object Methods for compatibility with ExtendScript
- **Spreading**: Avoid using spread operator (`...`) on objects due to ExtendScript transpiler limitations. For arrays, spreading is acceptable.

### Naming & Structure

- **Class Naming**: `KT_` prefix for all classes (`KT_Fs`, `KT_Path`, `KT_IoUtils`)
- **Method Naming**: Descriptive method names with consistent casing
- **Type Definitions**: Inline interfaces for options objects where needed

### ExtendScript API Usage

- **Global Objects**: Direct access to ExtendScript globals (`File`, `Folder`, `$.fileName`)
- **File Operations**: Uses ExtendScript's `File` and `Folder` objects for all I/O operations
- **Path Handling**: Custom path utilities that work across Windows/Mac file systems
- **Documentation Links**: References to ExtendScript documentation for File/Folder API behaviors

### Validation & Safety

- **File Existence**: Always check file/folder existence before operations
- **Type Safety**: Strict TypeScript with comprehensive null checks
- **Error Handling**: Methods return `boolean`, `string | null`, or typed results to indicate success/failure
- **Path Sanitization**: Input validation and path cleaning for security

## Dependencies & Ecosystem

- **`kt-core`**: Framework foundation providing ExtendScript compatibility and utilities like `json2.js` https://github.com/Octopodo/kt-core
- **`types-for-adobe`**: Adobe API type definitions for ExtendScript environments
- **Build Tools**: `kt-extendscript-builder` for ES3 compilation and minification

## Common Patterns

- **File Operations**: Always check existence before read/write operations
- **Path Building**: Use `KT_Path.join()` for cross-platform path construction
- **Directory Traversal**: Use `scanFolder()` with `deep` parameter for recursive operations
- **JSON Operations**: Use `writeJson()`/`readJson()` for structured data persistence
- **Resource Management**: Always close files after operations

## File Organization

- **Source**: `src/` contains all TypeScript source files
- **Tests**: `src/tests/` (not root-level `tests/`)
- **Build Output**: `dist/` for main build, `dist.test/` for test builds
- **Config**: `kt.config.json` for build configuration (not standard tools)
- **Documentation**: `docs/` folder with API reference and examples

## Key Classes & Methods

### Descriptor Classes

- **`KT_FileDescriptor`**: Represents files with metadata (size, modified date, extension)
- **`KT_FolderDescriptor`**: Represents folders with contents array and scanning methods
- **Methods**: `getFiles()`, `getContents()`, `getFolders()`, `getPaths()` with optional `deep` parameter

### Core Operations

- **File I/O**: `readFile()`, `writeFile()`, `copyFile()`, `moveFile()`, `deleteFile()`
- **Directory Ops**: `createDirectory()`, `listFiles()`, `folderExists()`
- **Path Utils**: `join()`, `resolve()`, `getFileName()`, `getFileExtension()`
- **High-level**: `scanFolder()`, `createFolderTree()`

## Development Guidelines

### Code Style

- **TypeScript Strict Mode**: Enabled for type safety
- **Consistent Naming**: CamelCase for methods, PascalCase for classes

### Error Handling

- **Defensive Programming**: Check existence before operations
- **Graceful Degradation**: Return `null`/`false` for failed operations
- **Type Guards**: Use `instanceof` checks for File/Folder objects

### Testing Strategy

- **Unit Tests**: Individual method testing with mock file operations
- **Integration Tests**: End-to-end file system operations
- **Cross-platform**: Test on both Windows and Mac environments
- **Cleanup**: Always clean up test files and directories

## Writing docs

- Documentation consists on one md file at the root of the project and more detailed docs on docs folder for each module
- When writing docs for the root md file, write a brief project overview, some relevant examples of usage and links to the docs folder and other repos used in this project
- Follow the existing documentation style in the codebase
- When documenting functions always write a brief description, include parameter types, defaults(if any) and return types clearly in a table format
- Always include an index of contents at the start of the documentation file
- If a type is on this codebase, try to link to it using the format `{@link TypeName}`

## Donts

- Do not use modern JavaScript features unsupported by ExtendScript (e.g., Promises, async/await, certain ES6+ syntax)
- Do not use the spread operator on objects
- Do not use Array/Object methods that are incompatible with ExtendScript (e.g., forEach, map, filter, find)
- Do not write tests if you are not asked to
- Do not modify tsconfig.json or kt.config.json unless instructed
- Do not write docs if you are not asked to
  <parameter name="filePath">c:\work\dev\KT_es\kt-io\.github\copilot-instructions.md
