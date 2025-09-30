# API Reference

Here you can find a reference to all existing methods in the IO class.

## Index

- [copyFile](#copyfile)
- [createDirectory](#createdirectory)
- [deleteFile](#deletefile)
- [fileExists](#fileexists)
- [getCurrentScriptFile](#getcurrentscriptfile)
- [getFileExtension](#getfileextension)
- [getFileModifiedDate](#getfilemodifieddate)
- [getFileName](#getfilename)
- [getFileSize](#getfilesize)
- [listFiles](#listfiles)
- [moveFile](#movefile)
- [openFileDialog](#openfiledialog)
- [openFolderDialog](#openfolderdialog)
- [readFile](#readfile)
- [readJson](#readjson)
- [resolvePath](#resolvepath)
- [stripFileExtension](#stripfileextension)
- [writeFile](#writefile)
- [writeJson](#writejson)

## File Existence

### `fileExists`

Checks if a file exists at the given path.

**Arguments:**

| Parameter  | Description           |
| ---------- | --------------------- |
| `filePath` | The path to the file. |

**Examples:**

```typescript
expect(IO.fileExists("data.txt")).toBe(true);
expect(IO.fileExists("nonexistent.txt")).toBe(false);
```

## File Name and Extension

### `getFileName`

Returns the filename without extension.

**Arguments:**

| Parameter | Description      |
| --------- | ---------------- |
| `file`    | The file object. |

**Examples:**

```typescript
const file = new File("path/to/document.txt");
const name = IO.getFileName(file); // 'document'
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
const ext = IO.getFileExtension(file); // 'txt'
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
const name = IO.stripFileExtension(file); // 'document'
```

## File Reading and Writing

### `readFile`

Reads the content of a file.

**Arguments:**

| Parameter    | Description                   |
| ------------ | ----------------------------- |
| `fileOrPath` | The file path or File object. |

**Examples:**

```typescript
const content = IO.readFile("data.txt");
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
IO.writeFile("output.txt", "Hello World");
IO.writeFile("output.txt", "Hello World", "UTF-8");
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
IO.copyFile("source.txt", "dest.txt");
IO.copyFile("source.txt", "dest.txt", true);
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
IO.moveFile("old.txt", "new.txt");
IO.moveFile("old.txt", "new.txt", true);
```

### `deleteFile`

Deletes a file.

**Arguments:**

| Parameter    | Description         |
| ------------ | ------------------- |
| `fileOrPath` | The file to delete. |

**Examples:**

```typescript
IO.deleteFile("temp.txt");
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
IO.createDirectory("logs");
IO.createDirectory("path/to/new/folder", true);
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
const files = IO.listFiles("path/to/folder");
const txtFiles = IO.listFiles("path/to/folder", /\.txt$/);
const filteredFiles = IO.listFiles(
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
const size = IO.getFileSize("largefile.dat");
```

### `getFileModifiedDate`

Gets the last modified date.

**Arguments:**

| Parameter    | Description |
| ------------ | ----------- |
| `fileOrPath` | The file.   |

**Examples:**

```typescript
const modified = IO.getFileModifiedDate("document.txt");
```

## Path Resolution

### `resolvePath`

Resolves a relative path to an absolute path.

**Arguments:**

| Parameter      | Description                            |
| -------------- | -------------------------------------- |
| `relativePath` | The relative path.                     |
| `basePath`     | Base path (default: script directory). |

**Examples:**

```typescript
const absPath = IO.resolvePath("data/file.txt");
const absPath2 = IO.resolvePath("file.txt", "/base/path");
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
IO.writeJson("config.json", config);
```

### `readJson`

Reads JSON from a file.

**Arguments:**

| Parameter    | Description |
| ------------ | ----------- |
| `fileOrPath` | The file.   |

**Examples:**

```typescript
const config = IO.readJson("config.json");
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
const files = IO.openFileDialog("Select files");
const txtFiles = IO.openFileDialog(
    "Select text files",
    (file) => IO.getFileExtension(file) === "txt"
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
const scriptFile = IO.getCurrentScriptFile();
const scriptDir = scriptFile.parent;
```
