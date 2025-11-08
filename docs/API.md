# API Reference

Here you can find a reference to all existing methods in the IO module, organized by `IO.path` and `IO.fs` submodules.

## Index

### IO.path (Path Utilities)

- [getFileName](#getfilename)
- [getFolderName](#getfoldername)
- [getFileExtension](#getfileextension)
- [stripFileExtension](#stripfileextension)
- [resolve](#resolve)
- [join](#join)
- [sanitize](#sanitize)

### IO.fs (File System Operations)

- [fileExists](#fileexists)
- [folderExists](#folderexists)
- [readFile](#readfile)
- [writeFile](#writefile)
- [copyFile](#copyfile)
- [moveFile](#movefile)
- [deleteFile](#deletefile)
- [createDirectory](#createdirectory)
- [listFiles](#listfiles)
- [getFileSize](#getfilesize)
- [getFileModifiedDate](#getfilemodifieddate)
- [writeJson](#writejson)
- [readJson](#readjson)

### IO.utils (High-level Utilities)

- [createFolderTree](#createfoldertree)
- [scanFolder](#scanfolder)

## Path Utilities (IO.path)

### `getFileName`

Returns the filename without extension.

**Arguments:**

| Parameter | Type             | Default | Description                     |
| --------- | ---------------- | ------- | ------------------------------- |
| `file`    | `File \| string` | -       | The file object or path string. |

**Returns:** `string` - The filename without extension.

**Examples:**

```typescript
const file = new File("path/to/document.txt");
const name = IO.path.getFileName(file); // 'document'

// Also accepts string paths
const name2 = IO.path.getFileName("path/to/document.txt"); // 'document'
```

### `getFolderName`

Returns the folder name.

**Arguments:**

| Parameter | Type               | Default | Description                       |
| --------- | ------------------ | ------- | --------------------------------- |
| `folder`  | `Folder \| string` | -       | The folder object or path string. |

**Returns:** `string` - The folder name.

**Examples:**

```typescript
const folder = new Folder("path/to/myfolder");
const name = IO.path.getFolderName(folder); // 'myfolder'

const name2 = IO.path.getFolderName("path/to/myfolder"); // 'myfolder'
```

### `getFileExtension`

Returns the file extension.

**Arguments:**

| Parameter | Type             | Default | Description                     |
| --------- | ---------------- | ------- | ------------------------------- |
| `file`    | `File \| string` | -       | The file object or path string. |

**Returns:** `string` - The file extension (without the dot), or empty string if no extension.

**Examples:**

```typescript
const file = new File("path/to/document.txt");
const ext = IO.path.getFileExtension(file); // 'txt'

// Also accepts string paths
const ext2 = IO.path.getFileExtension("path/to/document.txt"); // 'txt'
```

### `stripFileExtension`

Alias for `getFileName`, returns filename without extension.

**Arguments:**

| Parameter | Type             | Description                     |
| --------- | ---------------- | ------------------------------- |
| `file`    | `File \| string` | The file object or path string. |

**Returns:** `string` - The filename without extension.

**Examples:**

```typescript
const file = new File("path/to/document.txt");
const name = IO.path.stripFileExtension(file); // 'document'

// Also accepts string paths
const name2 = IO.path.stripFileExtension("path/to/document.txt"); // 'document'
```

### `resolve`

Resolves a relative path to an absolute path based on the current script's directory or a provided base path.

**Arguments:**

| Parameter      | Type     | Default          | Description                                       |
| -------------- | -------- | ---------------- | ------------------------------------------------- |
| `relativePath` | `string` | -                | The relative path to resolve.                     |
| `basePath`     | `string` | Script directory | Optional base path. Defaults to script directory. |

**Returns:** `string` - The absolute resolved path.

**Examples:**

```typescript
const absPath = IO.path.resolve("data/file.txt");
// Resolves to: /path/to/script/data/file.txt

const absPath2 = IO.path.resolve("file.txt", "/custom/base");
// Resolves to: /custom/base/file.txt
```

### `join`

Joins multiple path segments into a single path.

**Arguments:**

| Parameter  | Type       | Default | Description            |
| ---------- | ---------- | ------- | ---------------------- |
| `...paths` | `string[]` | -       | Path segments to join. |

**Returns:** `string` - The joined path with normalized separators.

**Examples:**

```typescript
const path = IO.path.join("folder", "subfolder", "file.txt");
// Result: "folder/subfolder/file.txt"
```

### `sanitize`

Normalizes path separators and removes duplicate slashes.

**Arguments:**

| Parameter | Type     | Default | Description           |
| --------- | -------- | ------- | --------------------- |
| `path`    | `string` | -       | The path to sanitize. |

**Returns:** `string` - The sanitized path with normalized separators.

**Examples:**

```typescript
// Convert backslashes to forward slashes
const cleanPath = IO.path.sanitize("folder\\subfolder\\file.txt");
// Result: "folder/subfolder/file.txt"

// Remove duplicate slashes
const normalizedPath = IO.path.sanitize("folder//subfolder///file.txt");
// Result: "folder/subfolder/file.txt"

// Handle mixed backslashes and forward slashes
const mixedPath = IO.path.sanitize("my/path/with\\mixed\\slashes\\/file.txt");
// Result: "my/path/with/mixed/slashes/file.txt"
```

## File System Operations (IO.fs)

### `fileExists`

Checks if a file exists at the given path.

**Arguments:**

| Parameter  | Type     | Default | Description           |
| ---------- | -------- | ------- | --------------------- |
| `filePath` | `string` | -       | The path to the file. |

**Returns:** `boolean` - True if the file exists, false otherwise.

**Examples:**

```typescript
expect(IO.fs.fileExists("data.txt")).toBe(true);
expect(IO.fs.fileExists("nonexistent.txt")).toBe(false);
```

### `folderExists`

Checks if a folder exists at the given path.

**Arguments:**

| Parameter    | Type     | Description             |
| ------------ | -------- | ----------------------- |
| `folderPath` | `string` | The path to the folder. |

**Returns:** `boolean` - True if the folder exists, false otherwise.

**Examples:**

```typescript
expect(IO.fs.folderExists("myfolder")).toBe(true);
expect(IO.fs.folderExists("nonexistent")).toBe(false);
```

### `readFile`

Reads the content of a file.

**Arguments:**

| Parameter    | Type             | Description                   |
| ------------ | ---------------- | ----------------------------- |
| `fileOrPath` | `string \| File` | The file path or File object. |

**Returns:** `string | null` - The file content as a string, or null if the file doesn't exist or can't be read.

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

| Parameter    | Type             | Default   | Description                   |
| ------------ | ---------------- | --------- | ----------------------------- |
| `fileOrPath` | `string \| File` | -         | The file path or File object. |
| `content`    | `string`         | -         | The content to write.         |
| `encoding`   | `string`         | `'UTF-8'` | The encoding.                 |

**Returns:** `boolean` - True if the file was written successfully, false otherwise.

**Examples:**

```typescript
IO.fs.writeFile("output.txt", "Hello World");
IO.fs.writeFile("output.txt", "Hello World", "UTF-8");
```

## File Operations

### `copyFile`

Copies a file from source to destination.

**Arguments:**

| Parameter    | Type             | Default | Description                                 |
| ------------ | ---------------- | ------- | ------------------------------------------- |
| `sourcePath` | `string \| File` | -       | Source file.                                |
| `destPath`   | `string \| File` | -       | Destination file.                           |
| `overwrite`  | `boolean`        | `false` | Whether to overwrite if destination exists. |

**Returns:** `boolean` - True if the file was copied successfully, false otherwise.

**Examples:**

```typescript
IO.fs.copyFile("source.txt", "dest.txt");
IO.fs.copyFile("source.txt", "dest.txt", true);
```

### `moveFile`

Moves (renames) a file.

**Arguments:**

| Parameter    | Type             | Default | Description                                 |
| ------------ | ---------------- | ------- | ------------------------------------------- |
| `sourcePath` | `string \| File` | -       | Source file.                                |
| `destPath`   | `string \| File` | -       | Destination file.                           |
| `overwrite`  | `boolean`        | `false` | Whether to overwrite if destination exists. |

**Returns:** `boolean` - True if the file was moved successfully, false otherwise.

**Examples:**

```typescript
IO.fs.moveFile("old.txt", "new.txt");
IO.fs.moveFile("old.txt", "new.txt", true);
```

### `deleteFile`

Deletes a file.

**Arguments:**

| Parameter    | Type             | Description         |
| ------------ | ---------------- | ------------------- |
| `fileOrPath` | `string \| File` | The file to delete. |

**Returns:** `boolean` - True if the file was deleted successfully, false otherwise.

**Examples:**

```typescript
IO.fs.deleteFile("temp.txt");
```

## Directory Operations

### `createDirectory`

Creates a directory.

**Arguments:**

| Parameter   | Type      | Default | Description                           |
| ----------- | --------- | ------- | ------------------------------------- |
| `path`      | `string`  | -       | The directory path.                   |
| `recursive` | `boolean` | `false` | Whether to create parent directories. |

**Returns:** `boolean` - True if the directory was created successfully, false otherwise.

**Examples:**

```typescript
IO.fs.createDirectory("logs");
IO.fs.createDirectory("path/to/new/folder", true);
```

### `listFiles`

Lists files in a directory, optionally filtered.

**Arguments:**

| Parameter    | Type                              | Default | Description                            |
| ------------ | --------------------------------- | ------- | -------------------------------------- |
| `folderPath` | `string`                          | -       | The directory.                         |
| `filter`     | `RegExp \| Function \| undefined` | -       | Filter for files (RegExp or Function). |

**Returns:** `Array<File>` - Array of File objects matching the criteria.

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

| Parameter    | Type             | Description |
| ------------ | ---------------- | ----------- |
| `fileOrPath` | `string \| File` | The file.   |

**Returns:** `number | null` - The file size in bytes, or null if the file doesn't exist.

**Examples:**

```typescript
const size = IO.fs.getFileSize("largefile.dat");
```

### `getFileModifiedDate`

Gets the last modified date.

**Arguments:**

| Parameter    | Type             | Description |
| ------------ | ---------------- | ----------- |
| `fileOrPath` | `string \| File` | The file.   |

**Returns:** `Date | null` - The last modified date, or null if the file doesn't exist.

**Examples:**

```typescript
const modified = IO.fs.getFileModifiedDate("document.txt");
```

## JSON Operations

### `writeJson`

Writes data as JSON to a file.

**Arguments:**

| Parameter    | Type             | Description            |
| ------------ | ---------------- | ---------------------- |
| `fileOrPath` | `string \| File` | The file.              |
| `data`       | `any`            | The data to serialize. |

**Returns:** `boolean` - True if the JSON was written successfully, false otherwise.

**Examples:**

```typescript
const config = { theme: "dark", language: "en" };
IO.fs.writeJson("config.json", config);
```

### `readJson`

Reads JSON from a file.

**Arguments:**

| Parameter    | Type             | Description |
| ------------ | ---------------- | ----------- |
| `fileOrPath` | `string \| File` | The file.   |

**Returns:** `any | null` - The parsed JSON data, or null if the file doesn't exist or JSON is invalid.

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

| Parameter     | Type                    | Description               |
| ------------- | ----------------------- | ------------------------- |
| `prompt`      | `string`                | Dialog prompt.            |
| `fileChecker` | `Function \| undefined` | Function to filter files. |

**Returns:** `Array<File>` - Array of selected files.

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

| Parameter | Type     | Description    |
| --------- | -------- | -------------- |
| `prompt`  | `string` | Dialog prompt. |

**Returns:** `Folder | null` - The selected folder or null if cancelled.

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

| Parameter  | Type     | Description                                         |
| ---------- | -------- | --------------------------------------------------- |
| `tree`     | `any`    | Object or JSON string representing folder structure |
| `rootPath` | `string` | Root path where the structure will be created       |

**Returns:** `any` - Object representing the created folder structure with paths.

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

### `scanFolder`

Scans a folder and returns a `KT_FolderDescriptor` object representing the folder structure.

**Arguments:**

| Parameter    | Type      | Default | Description                                                                |
| ------------ | --------- | ------- | -------------------------------------------------------------------------- |
| `folderPath` | `string`  | -       | Path to the folder to scan                                                 |
| `deep`       | `boolean` | `false` | If `true`, recursively scans subfolders. If `false`, only scans top level. |

**Returns:** `KT_FolderDescriptor` - A descriptor object containing folder information and contents.

**Examples:**

```typescript
// Shallow scan (only top-level contents)
const folder = IO.utils.scanFolder("/path/to/project");
console.log(folder.name); // "project"
console.log(folder.contents.length); // Number of files/folders in root

// Deep scan (recursive)
const deepFolder = IO.utils.scanFolder("/path/to/project", true);
console.log(deepFolder.contents.length); // All files/folders recursively

// Access specific content
const firstItem = folder.contents[0];
if (firstItem.type === "file") {
    console.log("File:", firstItem.name, "Size:", firstItem.size);
} else if (firstItem.type === "folder") {
    console.log(
        "Folder:",
        firstItem.name,
        "Contents:",
        firstItem.contents.length
    );
}

// Use descriptor methods
const allFiles = folder.getFiles(true); // Get all files recursively
const allFolders = folder.getFolders(true); // Get all subfolders recursively
const allContents = folder.getContents(true); // Get all contents recursively
```

## Descriptor Classes

The `scanFolder` function returns descriptor objects that provide structured access to file system information.

### `KT_FolderDescriptor`

Represents a folder with its contents and provides methods to query files and subfolders.

**Properties:**

| Property   | Type              | Description                              |
| ---------- | ----------------- | ---------------------------------------- |
| `path`     | `string`          | Full path to the folder                  |
| `name`     | `string`          | Folder name                              |
| `type`     | `"folder"`        | Always "folder"                          |
| `exists`   | `boolean`         | Whether the folder exists                |
| `contents` | `KT_Descriptor[]` | Array of files and subfolder descriptors |

**Methods:**

#### `getFiles(deep?: boolean)`

Returns all files in the folder.

**Arguments:**

| Parameter | Type      | Default | Description                               |
| --------- | --------- | ------- | ----------------------------------------- |
| `deep`    | `boolean` | `false` | If `true`, includes files from subfolders |

**Returns:** `KT_FileDescriptor[]` - Array of file descriptors.

#### `getContents(deep?: boolean)`

Returns all contents (files and folders) in the folder.

**Arguments:**

| Parameter | Type      | Default | Description                                  |
| --------- | --------- | ------- | -------------------------------------------- |
| `deep`    | `boolean` | `false` | If `true`, includes contents from subfolders |

**Returns:** `KT_Descriptor[]` - Array of file and folder descriptors.

#### `getFolders(deep?: boolean)`

Returns all subfolders in the folder.

**Arguments:**

| Parameter | Type      | Default | Description                                |
| --------- | --------- | ------- | ------------------------------------------ |
| `deep`    | `boolean` | `false` | If `true`, includes subfolders recursively |

**Returns:** `KT_FolderDescriptor[]` - Array of folder descriptors.

### `KT_FileDescriptor`

Represents a file with its metadata.

**Properties:**

| Property    | Type     | Description                  |
| ----------- | -------- | ---------------------------- |
| `path`      | `string` | Full path to the file        |
| `name`      | `string` | File name without extension  |
| `type`      | `"file"` | Always "file"                |
| `extension` | `string` | File extension (without dot) |
| `size`      | `number` | File size in bytes           |
| `modified`  | `string` | Last modified date as string |

**Examples:**

```typescript
const folder = IO.utils.scanFolder("/path/to/project", true);

// Get all TypeScript files recursively
const tsFiles = folder.getFiles(true).filter((file) => file.extension === "ts");

// Get all subfolders
const subfolders = folder.getFolders(false);

// Check if folder exists
if (!folder.exists) {
    console.log("Folder does not exist:", folder.path);
}

// Access file information
folder.contents.forEach((item) => {
    if (item.type === "file") {
        console.log(
            `File: ${item.name}.${item.extension}, Size: ${item.size} bytes`
        );
    } else {
        console.log(
            `Folder: ${item.name}, Contents: ${item.contents.length} items`
        );
    }
});
```

```

```
