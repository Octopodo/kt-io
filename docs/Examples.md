# Examples

This document provides advanced usage examples for the KT-IO library.

## Basic File Operations

### Reading and Writing Files

```typescript
import { IO } from "kt-io";

// Read a text file
const content = IO.fs.readFile("input.txt");
if (content) {
    // Modify content
    const modified = content.toUpperCase();
    IO.fs.writeFile("output.txt", modified);
}

// Check if file exists before reading
if (IO.fs.fileExists("data.txt")) {
    const data = IO.fs.readFile("data.txt");
    // Process data
}
```

### File Metadata

```typescript
// Get file information
const size = IO.fs.getFileSize("largefile.dat");
const modified = IO.fs.getFileModifiedDate("document.txt");

if (modified) {
    const now = new Date();
    const daysDiff =
        (now.getTime() - modified.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 7) {
        // File is older than a week
    }
}
```

## Working with JSON

### Configuration Management

```typescript
// Write configuration
const config = {
    theme: "dark",
    language: "en",
    autoSave: true,
    recentFiles: ["file1.txt", "file2.txt"],
};
IO.fs.writeJson("config.json", config);

// Read configuration with error handling
const loadedConfig = IO.fs.readJson("config.json");
if (loadedConfig) {
    // Apply configuration
    applyTheme(loadedConfig.theme);
} else {
    // Use default configuration
    applyDefaultConfig();
}
```

### Data Export/Import

```typescript
// Export project data
const projectData = {
    name: "My Project",
    version: "1.0.0",
    layers: getAllLayers(),
    settings: getProjectSettings(),
};
IO.fs.writeJson("project_export.json", projectData);

// Import project data
const importedData = IO.fs.readJson("project_export.json");
if (importedData) {
    createProject(importedData);
}
```

## File Operations

### Backup System

```typescript
// Create backup of important files
const importantFiles = ["config.json", "data.txt", "settings.json"];

for (let i = 0; i < importantFiles.length; i++) {
    const file = importantFiles[i];
    if (IO.fs.fileExists(file)) {
        const backupName = file.replace(".", "_backup.");
        IO.fs.copyFile(file, backupName, true);
    }
}
```

### File Organization

```typescript
// Move files to organized folders
const files = IO.fs.listFiles("downloads");
for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = IO.path.getFileExtension(file);

    // Create folder for file type
    const folder = "organized/" + ext;
    IO.fs.createDirectory(folder, true);

    // Move file to appropriate folder
    const newPath = folder + "/" + file.name;
    IO.fs.moveFile(file.fsName, newPath);
}
```

## Directory Management

### Folder Operations

```typescript
// Create project structure
const folders = [
    "project/src",
    "project/assets",
    "project/output",
    "project/backup",
];

for (let i = 0; i < folders.length; i++) {
    IO.fs.createDirectory(folders[i], true);
}
```

### File Filtering

```typescript
// List files with different filters
const allFiles = IO.fs.listFiles("data");
const txtFiles = IO.fs.listFiles("data", /\.txt$/);
const recentFiles = IO.fs.listFiles("data", function (file) {
    const modified = IO.fs.getFileModifiedDate(file);
    if (!modified) return false;
    const daysDiff =
        (new Date().getTime() - modified.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff < 7; // Files modified in last week
});
```

## Path Resolution

### Working with Relative Paths

```typescript
// Get script location
const scriptFile = IO.fs.getCurrentScriptFile();
const scriptDir = scriptFile.parent.fsName;

// Resolve paths relative to script
const dataPath = IO.path.resolvePath("data/input.txt", scriptDir);
const outputPath = IO.path.resolvePath("output/result.txt", scriptDir);

// Process files
if (IO.fs.fileExists(dataPath)) {
    const data = IO.fs.readFile(dataPath);
    const processed = processData(data);
    IO.fs.writeFile(outputPath, processed);
}
```

## User Interaction

### File Selection

```typescript
// Let user select files
const selectedFiles = IO.fs.openFileDialog(
    "Select text files to process",
    function (file) {
        return IO.path.getFileExtension(file) === "txt";
    }
);

// Process selected files
for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    const content = IO.fs.readFile(file);
    if (content) {
        const processed = processContent(content);
        const outputName = IO.path.getFileName(file) + "_processed.txt";
        IO.fs.writeFile(outputName, processed);
    }
}
```

### Folder Selection

```typescript
// Let user select output folder
const outputFolder = IO.fs.openFolderDialog("Select output folder");
if (outputFolder) {
    // Generate reports in selected folder
    const reports = generateReports();
    for (let i = 0; i < reports.length; i++) {
        const report = reports[i];
        const filePath = outputFolder.fsName + "/" + report.name + ".txt";
        IO.fs.writeFile(filePath, report.content);
    }
}
```

## Error Handling

### Robust File Operations

```typescript
function safeFileOperation() {
    try {
        // Attempt file operations
        if (!IO.fs.fileExists("input.txt")) {
            alert("Input file not found");
            return false;
        }

        const content = IO.fs.readFile("input.txt");
        if (!content) {
            alert("Could not read input file");
            return false;
        }

        const processed = processContent(content);
        if (!IO.fs.writeFile("output.txt", processed)) {
            alert("Could not write output file");
            return false;
        }

        return true;
    } catch (error) {
        alert("Error during file operation: " + error.message);
        return false;
    }
}
```

## Advanced Examples

### Log System

```typescript
function createLogger(logDir) {
    // Ensure log directory exists
    IO.fs.createDirectory(logDir, true);

    return {
        log: function (message) {
            const now = new Date();
            const dateStr =
                now.getFullYear() +
                "-" +
                (now.getMonth() + 1) +
                "-" +
                now.getDate();
            const logFile = logDir + "/log_" + dateStr + ".txt";
            const timestamp = now.toTimeString();
            const logEntry = timestamp + ": " + message + "\n";

            // Append to log file
            const existing = IO.fs.readFile(logFile) || "";
            IO.fs.writeFile(logFile, existing + logEntry);
        },
    };
}

// Usage
const logger = createLogger("logs");
logger.log("Application started");
```

### File Synchronization

```typescript
function syncFolders(sourceFolder, targetFolder) {
    const sourceFiles = IO.fs.listFiles(sourceFolder);

    for (let i = 0; i < sourceFiles.length; i++) {
        const sourceFile = sourceFiles[i];
        const targetPath = targetFolder + "/" + sourceFile.name;

        if (!IO.fs.fileExists(targetPath)) {
            // File doesn't exist in target, copy it
            IO.fs.copyFile(sourceFile.fsName, targetPath);
        } else {
            // Check if source is newer
            const sourceModified = IO.fs.getFileModifiedDate(sourceFile);
            const targetModified = IO.fs.getFileModifiedDate(targetPath);

            if (
                sourceModified &&
                targetModified &&
                sourceModified.getTime() > targetModified.getTime()
            ) {
                // Source is newer, update target
                IO.fs.copyFile(sourceFile.fsName, targetPath, true);
            }
        }
    }
}
```

## Project Structure Creation

### Creating Folder Trees

```typescript
// Define a project structure
const projectStructure = {
    src: {
        main: {
            java: {},
            resources: {},
        },
        test: {
            java: {},
            resources: {},
        },
    },
    docs: {
        api: {},
        "user-guide": {},
    },
    build: {
        classes: {},
        "test-classes": {},
    },
    config: {},
};

// Create the structure
IO.utils.createFolderTree(projectStructure, "/path/to/new-project");

// You can also use a JSON string
const structureJson = JSON.stringify({
    frontend: {
        src: {
            components: {},
            pages: {},
            utils: {},
        },
        public: {},
        dist: {},
    },
    backend: {
        src: {},
        tests: {},
        config: {},
    },
});

IO.utils.createFolderTree(structureJson, "/path/to/fullstack-app");
```

### Scanning Folder Structures

```typescript
// Scan an existing project structure
const projectPath = "/path/to/existing-project";
const structure = IO.utils.scanFolderTree(projectPath);

// The result is a JSON object representing the hierarchy
console.log(JSON.stringify(structure, null, 2));

// You can use it to recreate the structure elsewhere
IO.utils.createFolderTree(structure, "/path/to/backup");

// Or analyze the structure
function analyzeStructure(structure: any, prefix = "") {
    for (const key in structure) {
        const item = structure[key];
        if (item.type === "folder") {
            console.log(prefix + "📁 " + key);
            analyzeStructure(item.contents, prefix + "  ");
        } else if (item.type === "file") {
            console.log(prefix + "📄 " + key + " (" + item.size + " bytes)");
        }
    }
}

analyzeStructure(structure);
```
