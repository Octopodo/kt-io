# API Reference

Here you can find a reference to all existing methods in the IO module, organized by `IO.path` and `IO.fs` submodules.

## Index

### IO.path (Path Utilities)

- [getFileName](#getfilename)
- [getFileExtension](#getfileextension)
- [stripFileExtension](#stripfileextension)
- [resolvePath](#resolvepath)
- [joinPath](#joinpath)

### IO.utils (High-level Utilities)

- [createFolderTree](#createfoldertree)

## Path Utilities (IO.path)

### `getFileName`

Returns the filename without extension.

**Arguments:**

| Parameter | Description      |
| --------- | ---------------- |
| `file`    | The file object. |

**Examples:**

```typescript
const file = new File("path/to/document.txt");
const name = IO.path.getFileName(file); // 'document'
```

### `getFileExtension`

Returns the file extension.

**Arguments:**

| Parameter | Description      |
| --------- | ---------------- |
| `file`    | The file object. |

**Examples:**

```typescript
const file = new File("path/to/document.txt");
const ext = IO.path.getFileExtension(file); // 'txt'
```

### `stripFileExtension`

Alias for `getFileName`, returns filename without extension.

**Arguments:**

| Parameter | Description      |
| --------- | ---------------- |
| `file`    | The file object. |

**Examples:**

```typescript
const file = new File("path/to/document.txt");
const name = IO.path.stripFileExtension(file); // 'document'
```

### `resolvePath`

Resolves a relative path to an absolute path based on the current script's directory or a provided base path.

**Arguments:**

| Parameter      | Description                                       |
| -------------- | ------------------------------------------------- |
| `relativePath` | The relative path to resolve.                     |
| `basePath?`    | Optional base path. Defaults to script directory. |

**Examples:**

```typescript
const absPath = IO.path.resolvePath("data/file.txt");
// Resolves to: /path/to/script/data/file.txt

const absPath2 = IO.path.resolvePath("file.txt", "/custom/base");
// Resolves to: /custom/base/file.txt
```

### `joinPath`

Joins multiple path segments into a single path.

**Arguments:**

| Parameter  | Description            |
| ---------- | ---------------------- |
| `...paths` | Path segments to join. |

**Examples:**

```typescript
const path = IO.path.joinPath("folder", "subfolder", "file.txt");
// Result: "folder/subfolder/file.txt"
```

## File System Operations (IO.fs)

### `fileExists`

Checks if a file exists at the given path.

**Arguments:**

| Parameter  | Description           |
| ---------- | --------------------- |
| `filePath` | The path to the file. |

**Examples:**

```typescript
expect(IO.fs.fileExists("data.txt")).toBe(true);
expect(IO.fs.fileExists("nonexistent.txt")).toBe(false);
```

### `readFile`

Reads the content of a file.

**Arguments:**

| Parameter    | Description                   |
| ------------ | ----------------------------- |
| `fileOrPath` | The file path or File object. |

**Examples:**

```typescript
const content = IO.fs.readFile("data.txt");
if (content) {
    // Process content
}
```

### `writeFile`

Writes content to a file.

**Arguments:**

| Parameter    | Description                      |
| ------------ | -------------------------------- |
| `fileOrPath` | The file path or File object.    |
| `content`    | The content to write.            |
| `encoding`   | The encoding (default: 'UTF-8'). |

**Examples:**

```typescript
IO.fs.writeFile("output.txt", "Hello World");
IO.fs.writeFile("output.txt", "Hello World", "UTF-8");
```

## File Operations

### `copyFile`

Copies a file from source to destination.

**Arguments:**

| Parameter    | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| `sourcePath` | Source file.                                                 |
| `destPath`   | Destination file.                                            |
| `overwrite`  | Whether to overwrite if destination exists (default: false). |

**Examples:**

```typescript
IO.fs.copyFile("source.txt", "dest.txt");
IO.fs.copyFile("source.txt", "dest.txt", true);
```

### `moveFile`

Moves (renames) a file.

**Arguments:**

| Parameter    | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| `sourcePath` | Source file.                                                 |
| `destPath`   | Destination file.                                            |
| `overwrite`  | Whether to overwrite if destination exists (default: false). |

**Examples:**

```typescript
IO.fs.moveFile("old.txt", "new.txt");
IO.fs.moveFile("old.txt", "new.txt", true);
```

### `deleteFile`

Deletes a file.

**Arguments:**

| Parameter    | Description         |
| ------------ | ------------------- |
| `fileOrPath` | The file to delete. |

**Examples:**

```typescript
IO.fs.deleteFile("temp.txt");
```

## Directory Operations

### `createDirectory`

Creates a directory.

**Arguments:**

| Parameter   | Description                                            |
| ----------- | ------------------------------------------------------ |
| `path`      | The directory path.                                    |
| `recursive` | Whether to create parent directories (default: false). |

**Examples:**

```typescript
IO.fs.createDirectory("logs");
IO.fs.createDirectory("path/to/new/folder", true);
```

### `listFiles`

Lists files in a directory, optionally filtered.

**Arguments:**

| Parameter    | Description                            |
| ------------ | -------------------------------------- |
| `folderPath` | The directory.                         |
| `filter`     | Filter for files (RegExp or Function). |

**Examples:**

```typescript
const files = IO.fs.listFiles("path/to/folder");
const txtFiles = IO.fs.listFiles("path/to/folder", /\.txt$/);
const filteredFiles = IO.fs.listFiles(
    "data",
    (file) => file.name.indexOf("test") !== -1
);
```

## File Metadata

### `getFileSize`

Gets the file size in bytes.

**Arguments:**

| Parameter    | Description |
| ------------ | ----------- |
| `fileOrPath` | The file.   |

**Examples:**

```typescript
const size = IO.fs.getFileSize("largefile.dat");
```

### `getFileModifiedDate`

Gets the last modified date.

**Arguments:**

| Parameter    | Description |
| ------------ | ----------- |
| `fileOrPath` | The file.   |

**Examples:**

```typescript
const modified = IO.fs.getFileModifiedDate("document.txt");
```

## JSON Operations

### `writeJson`

Writes data as JSON to a file.

**Arguments:**

| Parameter    | Description            |
| ------------ | ---------------------- |
| `fileOrPath` | The file.              |
| `data`       | The data to serialize. |

**Examples:**

```typescript
const config = { theme: "dark", language: "en" };
IO.fs.writeJson("config.json", config);
```

### `readJson`

Reads JSON from a file.

**Arguments:**

| Parameter    | Description |
| ------------ | ----------- |
| `fileOrPath` | The file.   |

**Examples:**

```typescript
const config = IO.fs.readJson("config.json");
if (config) {
    // Use config
}
```

## Dialogs

### `openFileDialog`

Opens a file selection dialog.

**Arguments:**

| Parameter     | Description               |
| ------------- | ------------------------- |
| `prompt`      | Dialog prompt.            |
| `fileChecker` | Function to filter files. |

**Examples:**

```typescript
const files = IO.fs.openFileDialog("Select files");
const txtFiles = IO.fs.openFileDialog(
    "Select text files",
    (file) => IO.path.getFileExtension(file) === "txt"
);
```

### `openFolderDialog`

Opens a folder selection dialog.

**Arguments:**

| Parameter | Description    |
| --------- | -------------- |
| `prompt`  | Dialog prompt. |

**Examples:**

```typescript
const folder = IO.openFolderDialog("Select folder");
```

## Utilities

### `getCurrentScriptFile`

Gets the current script file.

**Examples:**

```typescript
const scriptFile = IO.fs.getCurrentScriptFile();
const scriptDir = scriptFile.parent;
```

## High-level Utilities (IO.utils)

### `createFolderTree`

Creates a folder structure based on an object or JSON representation.

**Arguments:**

| Parameter  | Description                                         |
| ---------- | --------------------------------------------------- |
| `tree`     | Object or JSON string representing folder structure |
| `rootPath` | Root path where the structure will be created       |

**Examples:**

```typescript
// Create a project structure
const projectStructure = {
    src: {
        components: {},
        utils: {},
        styles: {},
    },
    docs: {},
    tests: {
        unit: {},
        integration: {},
    },
    build: {},
};

IO.utils.createFolderTree(projectStructure, "/path/to/project");

// Or using JSON string
const jsonStructure = '{"src":{},"docs":{},"tests":{}}';
IO.utils.createFolderTree(jsonStructure, "/path/to/project");
```

```

```
