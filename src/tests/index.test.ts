import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    runTests,
    getSuites,
} from "kt-testing-suite-core";
import { KT } from "kt-core";
import { IO } from "../index";

const basePath =
    IO.getCurrentScriptFile().parent.parent.fullName +
    "/src/tests/fixtures/test-files/";

describe("IO Tests", () => {
    it("should be able to create a new instance of IO", () => {
        const plugin = new IO();
        expect(plugin).toBeInstanceOf(IO);
    });

    describe("fileExists", () => {
        it("should return true for existing file (happy path)", () => {
            const filePath = basePath + "test-file.txt";
            expect(IO.fileExists(filePath)).toBe(true);
        });

        it("should return false for non-existing file (sad path)", () => {
            const filePath = basePath + "non-existing.txt";
            expect(IO.fileExists(filePath)).toBe(false);
        });

        it("should return false for empty path (edge case)", () => {
            const filePath = "";
            expect(IO.fileExists(filePath)).toBe(false);
        });

        it("should return false for invalid path (edge case)", () => {
            const filePath = "invalid://path";
            expect(IO.fileExists(filePath)).toBe(false);
        });
    });

    describe("getFileName", () => {
        it("should return filename without extension (happy path)", () => {
            const file = new File(basePath + "test-file.txt");
            expect(IO.getFileName(file)).toBe("test-file");
        });

        it("should return full name for file without extension (sad path)", () => {
            const file = new File(basePath + "test-file");
            expect(IO.getFileName(file)).toBe("test-file");
        });

        it("should handle files with multiple dots (edge case)", () => {
            const file = new File(basePath + "test.file.name.txt");
            expect(IO.getFileName(file)).toBe("test.file.name");
        });

        it("should handle empty filename (edge case)", () => {
            const file = new File("");
            expect(IO.getFileName(file)).toBe("tmp00000001");
        });
    });

    describe("getFileExtension", () => {
        it("should return file extension (happy path)", () => {
            const file = new File(basePath + "test-file.txt");
            expect(IO.getFileExtension(file)).toBe("txt");
        });

        it("should return empty string for files without extension (sad path)", () => {
            const file = new File(basePath + "test-file");
            expect(IO.getFileExtension(file)).toBe("");
        });

        it("should handle files with multiple dots in name (edge case)", () => {
            const file = new File(basePath + "test.file.name.txt");
            expect(IO.getFileExtension(file)).toBe("txt");
        });

        it("should return extension for files with compound extensions (edge case)", () => {
            const file = new File(basePath + "test-file.tar.gz");
            expect(IO.getFileExtension(file)).toBe("gz");
        });
    });

    describe("stripFileExtension", () => {
        it("should strip file extension (happy path)", () => {
            const file = new File(basePath + "test-file.txt");
            expect(IO.stripFileExtension(file)).toBe("test-file");
        });

        it("should return full name for file without extension (sad path)", () => {
            const file = new File(basePath + "test-file");
            expect(IO.stripFileExtension(file)).toBe("test-file");
        });

        it("should handle files with multiple dots (edge case)", () => {
            const file = new File(basePath + "test.file.name.txt");
            expect(IO.stripFileExtension(file)).toBe("test.file.name");
        });

        it("should handle empty filename (edge case)", () => {
            const file = new File("");
            expect(IO.stripFileExtension(file)).toBe("tmp00000001");
        });
    });

    describe("readFile", () => {
        it("should read content from existing file (happy path)", () => {
            const filePath = basePath + "test-file.txt";
            const content = IO.readFile(filePath);
            expect(content).toBe("This is just a text file to test IO ");
        });

        it("should read content from File object (happy path)", () => {
            const file = new File(basePath + "test-file-2.txt");
            const content = IO.readFile(file);
            expect(content).toBe(
                "This is a second text file to test folder collection"
            );
        });

        it("should return null for non-existing file (sad path)", () => {
            const filePath = basePath + "non-existing.txt";
            const content = IO.readFile(filePath);
            expect(content).toBe(null);
        });

        it("should return null for invalid path (edge case)", () => {
            const filePath = "";
            const content = IO.readFile(filePath);
            expect(content).toBe(null);
        });

        it("should handle File object that does not exist (sad path)", () => {
            const file = new File(basePath + "non-existing.txt");
            const content = IO.readFile(file);
            expect(content).toBe(null);
        });
    });

    describe("getCurrentScriptFile", () => {
        it("should return a File instance (happy path)", () => {
            const scriptFile = IO.getCurrentScriptFile();
            expect(scriptFile).toBeInstanceOf(File);
        });

        it("should return a file that exists (edge case)", () => {
            const scriptFile = IO.getCurrentScriptFile();
            expect(scriptFile.exists).toBe(true);
        });
    });

    // Note: openFileDialog and openFolderDialog involve user interaction and cannot be easily tested automatically

    describe("writeFile", () => {
        let tempFile: string;

        beforeEach(() => {
            tempFile = basePath + "temp-write.txt";
        });

        afterEach(() => {
            IO.deleteFile(tempFile);
        });

        it("should write content to a file (happy path)", () => {
            const content = "Test content";
            expect(IO.writeFile(tempFile, content)).toBe(true);
            expect(IO.readFile(tempFile)).toBe(content);
        });

        it("should return false for invalid path (sad path)", () => {
            expect(IO.writeFile("invalid://path", "content")).toBe(false);
        });
    });

    describe("copyFile", () => {
        let sourceFile: string;
        let destFile: string;

        beforeEach(() => {
            sourceFile = basePath + "test-file.txt";
            destFile = basePath + "temp-copy.txt";
        });

        afterEach(() => {
            IO.deleteFile(destFile);
        });

        it("should copy file successfully (happy path)", () => {
            expect(IO.copyFile(sourceFile, destFile)).toBe(true);
            expect(IO.fileExists(destFile)).toBe(true);
            expect(IO.readFile(destFile)).toBe(IO.readFile(sourceFile));
        });

        it("should return false if destination exists and overwrite false (edge case)", () => {
            IO.writeFile(destFile, "existing");
            expect(IO.copyFile(sourceFile, destFile, false)).toBe(false);
        });

        it("should overwrite if overwrite true (edge case)", () => {
            IO.writeFile(destFile, "existing");
            expect(IO.copyFile(sourceFile, destFile, true)).toBe(true);
            expect(IO.readFile(destFile)).toBe(IO.readFile(sourceFile));
        });
    });

    describe("moveFile", () => {
        let sourceFile: string;
        let destFile: string;

        beforeEach(() => {
            sourceFile = basePath + "temp-move.txt";
            destFile = basePath + "temp-moved.txt";
            IO.writeFile(sourceFile, "move content");
        });

        afterEach(() => {
            IO.deleteFile(sourceFile);
            IO.deleteFile(destFile);
        });

        it("should move file successfully (happy path)", () => {
            expect(IO.moveFile(sourceFile, destFile)).toBe(true);
            expect(IO.fileExists(destFile)).toBe(true);
            expect(IO.fileExists(sourceFile)).toBe(false);
        });

        it("should return false if destination exists and overwrite false (edge case)", () => {
            IO.writeFile(destFile, "existing");
            expect(IO.moveFile(sourceFile, destFile, false)).toBe(false);
        });
    });

    describe("deleteFile", () => {
        let tempFile: string;

        beforeEach(() => {
            tempFile = basePath + "temp-delete.txt";
            IO.writeFile(tempFile, "delete me");
        });

        it("should delete file successfully (happy path)", () => {
            expect(IO.deleteFile(tempFile)).toBe(true);
            expect(IO.fileExists(tempFile)).toBe(false);
        });

        it("should return false for non-existing file (sad path)", () => {
            expect(IO.deleteFile(basePath + "non-existing.txt")).toBe(false);
        });
    });

    describe("createDirectory", () => {
        let tempDir: string;

        beforeEach(() => {
            tempDir = basePath + "temp-dir";
        });

        afterEach(() => {
            try {
                new Folder(tempDir).remove();
            } catch (e) {}
        });

        it("should create directory (happy path)", () => {
            expect(IO.createDirectory(tempDir)).toBe(true);
            expect(new Folder(tempDir).exists).toBe(true);
        });

        it("should return true if directory already exists (edge case)", () => {
            IO.createDirectory(tempDir);
            expect(IO.createDirectory(tempDir)).toBe(true);
        });
    });

    describe("listFiles", () => {
        it("should list files in directory (happy path)", () => {
            const files = IO.listFiles(basePath);
            expect(files.length).toBeGreaterThan(0);
            expect(files[0]).toBeInstanceOf(File);
        });

        it("should filter files with regex (edge case)", () => {
            const files = IO.listFiles(basePath, /\.txt$/);
            let allTxt = true;
            for (let i = 0; i < files.length; i++) {
                if (!files[i].name.match(/\.txt$/)) {
                    allTxt = false;
                    break;
                }
            }
            expect(allTxt).toBe(true);
        });

        it("should filter files with function (edge case)", () => {
            const files = IO.listFiles(
                basePath,
                (f: File) => f.name.indexOf("test") !== -1
            );
            let allTest = true;
            for (let i = 0; i < files.length; i++) {
                if (files[i].name.indexOf("test") === -1) {
                    allTest = false;
                    break;
                }
            }
            expect(allTest).toBe(true);
        });
    });

    describe("getFileSize", () => {
        it("should return file size (happy path)", () => {
            const size = IO.getFileSize(basePath + "test-file.txt");
            expect(size).toBeGreaterThan(0);
        });

        it("should return null for non-existing file (sad path)", () => {
            expect(IO.getFileSize(basePath + "non-existing.txt")).toBe(null);
        });
    });

    describe("getFileModifiedDate", () => {
        it("should return modification date (happy path)", () => {
            const date = IO.getFileModifiedDate(basePath + "test-file.txt");
            expect(date).toBeInstanceOf(Date);
        });

        it("should return null for non-existing file (sad path)", () => {
            expect(IO.getFileModifiedDate(basePath + "non-existing.txt")).toBe(
                null
            );
        });
    });

    describe("resolvePath", () => {
        it("should resolve relative path (happy path)", () => {
            const resolved = IO.resolvePath("test-file.txt", basePath);
            expect(IO.fileExists(resolved)).toBe(true);
        });

        it("should resolve relative path with default base (edge case)", () => {
            const resolved = IO.resolvePath("test-file.txt");
            // Assuming Folder.current is set appropriately, check if it's a valid path
            expect(typeof resolved).toBe("string");

            expect(resolved.length > 0).toBe(true);
        });
    });

    describe("writeJson and readJson", () => {
        let tempJsonFile: string;

        beforeEach(() => {
            tempJsonFile = basePath + "temp.json";
        });

        afterEach(() => {
            IO.deleteFile(tempJsonFile);
        });

        it("should write and read JSON (happy path)", () => {
            const testData = { key: "value", number: 42 };
            expect(IO.writeJson(tempJsonFile, testData)).toBe(true);
            const readData = IO.readJson(tempJsonFile);
            expect(readData.key).toBe("value");
            expect(readData.number).toBe(42);
        });

        it("should return null for invalid JSON (sad path)", () => {
            IO.writeFile(tempJsonFile, "invalid json");
            expect(IO.readJson(tempJsonFile)).toBe(null);
        });
    });
});

runTests();
