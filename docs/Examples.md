# Examples

This document provides advanced usage examples for the KT-IO library.

## Basic File Operations

### Reading and Writing Files

```typescript
import { IO } from "kt-io";

// Read a text file
const content = IO.readFile("input.txt");
if (content) {
    // Modify content
    const modified = content.toUpperCase();
    IO.writeFile("output.txt", modified);
}

// Check if file exists before reading
if (IO.fileExists("data.txt")) {
    const data = IO.readFile("data.txt");
    // Process data
}
```

### File Metadata

```typescript
// Get file information
const size = IO.getFileSize("largefile.dat");
const modified = IO.getFileModifiedDate("document.txt");

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
IO.writeJson("config.json", config);

// Read configuration with error handling
const loadedConfig = IO.readJson("config.json");
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
IO.writeJson("project_export.json", projectData);

// Import project data
const importedData = IO.readJson("project_export.json");
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
    if (IO.fileExists(file)) {
        const backupName = file.replace(".", "_backup.");
        IO.copyFile(file, backupName, true);
    }
}
```

### File Organization

```typescript
// Move files to organized folders
const files = IO.listFiles("downloads");
for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = IO.getFileExtension(file);

    // Create folder for file type
    const folder = "organized/" + ext;
    IO.createDirectory(folder, true);

    // Move file to appropriate folder
    const newPath = folder + "/" + file.name;
    IO.moveFile(file.fsName, newPath);
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
    IO.createDirectory(folders[i], true);
}
```

### File Filtering

```typescript
// List files with different filters
const allFiles = IO.listFiles("data");
const txtFiles = IO.listFiles("data", /\.txt$/);
const recentFiles = IO.listFiles("data", function (file) {
    const modified = IO.getFileModifiedDate(file);
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
const scriptFile = IO.getCurrentScriptFile();
const scriptDir = scriptFile.parent.fsName;

// Resolve paths relative to script
const dataPath = IO.resolvePath("data/input.txt", scriptDir);
const outputPath = IO.resolvePath("output/result.txt", scriptDir);

// Process files
if (IO.fileExists(dataPath)) {
    const data = IO.readFile(dataPath);
    const processed = processData(data);
    IO.writeFile(outputPath, processed);
}
```

## User Interaction

### File Selection

```typescript
// Let user select files
const selectedFiles = IO.openFileDialog(
    "Select text files to process",
    function (file) {
        return IO.getFileExtension(file) === "txt";
    }
);

// Process selected files
for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    const content = IO.readFile(file);
    if (content) {
        const processed = processContent(content);
        const outputName = IO.getFileName(file) + "_processed.txt";
        IO.writeFile(outputName, processed);
    }
}
```

### Folder Selection

```typescript
// Let user select output folder
const outputFolder = IO.openFolderDialog("Select output folder");
if (outputFolder) {
    // Generate reports in selected folder
    const reports = generateReports();
    for (let i = 0; i < reports.length; i++) {
        const report = reports[i];
        const filePath = outputFolder.fsName + "/" + report.name + ".txt";
        IO.writeFile(filePath, report.content);
    }
}
```

## Error Handling

### Robust File Operations

```typescript
function safeFileOperation() {
    try {
        // Attempt file operations
        if (!IO.fileExists("input.txt")) {
            alert("Input file not found");
            return false;
        }

        const content = IO.readFile("input.txt");
        if (!content) {
            alert("Could not read input file");
            return false;
        }

        const processed = processContent(content);
        if (!IO.writeFile("output.txt", processed)) {
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
    IO.createDirectory(logDir, true);

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
            const existing = IO.readFile(logFile) || "";
            IO.writeFile(logFile, existing + logEntry);
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
    const sourceFiles = IO.listFiles(sourceFolder);

    for (let i = 0; i < sourceFiles.length; i++) {
        const sourceFile = sourceFiles[i];
        const targetPath = targetFolder + "/" + sourceFile.name;

        if (!IO.fileExists(targetPath)) {
            // File doesn't exist in target, copy it
            IO.copyFile(sourceFile.fsName, targetPath);
        } else {
            // Check if source is newer
            const sourceModified = IO.getFileModifiedDate(sourceFile);
            const targetModified = IO.getFileModifiedDate(targetPath);

            if (
                sourceModified &&
                targetModified &&
                sourceModified.getTime() > targetModified.getTime()
            ) {
                // Source is newer, update target
                IO.copyFile(sourceFile.fsName, targetPath, true);
            }
        }
    }
}
```
