import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    runTests,
    getSuites,
    beforeAll,
    afterAll,
} from "kt-testing-suite-core";
import { KT } from "kt-core";
import { IO } from "../index";
import { ktPath } from "../IO";

const basePath =
    IO.fs.getCurrentScriptFile().parent.parent.fullName +
    "/src/tests/fixtures/test-files/";

describe("IO Tests", () => {
    it("should be able to create a new instance of IO", () => {
        const plugin = new IO();
        expect(plugin).toBeInstanceOf(IO);
    });

    describe("fileExists", () => {
        it("should return true for existing file (happy path)", () => {
            const filePath = basePath + "test-file.txt";
            expect(IO.fs.fileExists(filePath)).toBe(true);
        });

        it("should return false for non-existing file (sad path)", () => {
            const filePath = basePath + "non-existing.txt";
            expect(IO.fs.fileExists(filePath)).toBe(false);
        });

        it("should return false for empty path (edge case)", () => {
            const filePath = "";
            expect(IO.fs.fileExists(filePath)).toBe(false);
        });

        it("should return false for invalid path (edge case)", () => {
            const filePath = "invalid://path";
            expect(IO.fs.fileExists(filePath)).toBe(false);
        });
    });

    describe("getFileName", () => {
        it("should return filename without extension (happy path)", () => {
            const file = new File(basePath + "test-file.txt");
            expect(IO.path.getFileName(file)).toBe("test-file");
        });

        it("should return full name for file without extension (sad path)", () => {
            const file = new File(basePath + "test-file");
            expect(IO.path.getFileName(file)).toBe("test-file");
        });

        it("should handle files with multiple dots (edge case)", () => {
            const file = new File(basePath + "test.file.name.txt");
            expect(IO.path.getFileName(file)).toBe("test.file.name");
        });

        it("should handle empty filename (edge case)", () => {
            const file = new File("");
            expect(IO.path.getFileName(file)).toBe("tmp00000001");
        });
    });

    describe("getFileExtension", () => {
        it("should return file extension (happy path)", () => {
            const file = new File(basePath + "test-file.txt");
            expect(IO.path.getFileExtension(file)).toBe("txt");
        });

        it("should return empty string for files without extension (sad path)", () => {
            const file = new File(basePath + "test-file");
            expect(IO.path.getFileExtension(file)).toBe("");
        });

        it("should handle files with multiple dots in name (edge case)", () => {
            const file = new File(basePath + "test.file.name.txt");
            expect(IO.path.getFileExtension(file)).toBe("txt");
        });

        it("should return extension for files with compound extensions (edge case)", () => {
            const file = new File(basePath + "test-file.tar.gz");
            expect(IO.path.getFileExtension(file)).toBe("gz");
        });
    });

    describe("stripFileExtension", () => {
        it("should strip file extension (happy path)", () => {
            const file = new File(basePath + "test-file.txt");
            expect(IO.path.stripFileExtension(file)).toBe("test-file");
        });

        it("should return full name for file without extension (sad path)", () => {
            const file = new File(basePath + "test-file");
            expect(IO.path.stripFileExtension(file)).toBe("test-file");
        });

        it("should handle files with multiple dots (edge case)", () => {
            const file = new File(basePath + "test.file.name.txt");
            expect(IO.path.stripFileExtension(file)).toBe("test.file.name");
        });

        it("should handle empty filename (edge case)", () => {
            const file = new File("");
            expect(IO.path.stripFileExtension(file)).toBe("tmp00000001");
        });
    });

    describe("readFile", () => {
        it("should read content from existing file (happy path)", () => {
            const filePath = basePath + "test-file.txt";
            const content = IO.fs.readFile(filePath);
            expect(content).toBe("This is just a text file to test IO ");
        });

        it("should read content from File object (happy path)", () => {
            const file = new File(basePath + "test-file-2.txt");
            const content = IO.fs.readFile(file);
            expect(content).toBe(
                "This is a second text file to test folder collection"
            );
        });

        it("should return null for non-existing file (sad path)", () => {
            const filePath = basePath + "non-existing.txt";
            const content = IO.fs.readFile(filePath);
            expect(content).toBe(null);
        });

        it("should return null for invalid path (edge case)", () => {
            const filePath = "";
            const content = IO.fs.readFile(filePath);
            expect(content).toBe(null);
        });

        it("should handle File object that does not exist (sad path)", () => {
            const file = new File(basePath + "non-existing.txt");
            const content = IO.fs.readFile(file);
            expect(content).toBe(null);
        });
    });

    describe("getCurrentScriptFile", () => {
        it("should return a File instance (happy path)", () => {
            const scriptFile = IO.fs.getCurrentScriptFile();
            expect(scriptFile).toBeInstanceOf(File);
        });

        it("should return a file that exists (edge case)", () => {
            const scriptFile = IO.fs.getCurrentScriptFile();
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
            IO.fs.deleteFile(tempFile);
        });

        it("should write content to a file (happy path)", () => {
            const content = "Test content";
            expect(IO.fs.writeFile(tempFile, content)).toBe(true);
            expect(IO.fs.readFile(tempFile)).toBe(content);
        });

        it("should return false for invalid path (sad path)", () => {
            expect(IO.fs.writeFile("invalid://path", "content")).toBe(false);
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
            IO.fs.deleteFile(destFile);
        });

        it("should copy file successfully (happy path)", () => {
            expect(IO.fs.copyFile(sourceFile, destFile)).toBe(true);
            expect(IO.fs.fileExists(destFile)).toBe(true);
            expect(IO.fs.readFile(destFile)).toBe(IO.fs.readFile(sourceFile));
        });

        it("should return false if destination exists and overwrite false (edge case)", () => {
            IO.fs.writeFile(destFile, "existing");
            expect(IO.fs.copyFile(sourceFile, destFile, false)).toBe(false);
        });

        it("should overwrite if overwrite true (edge case)", () => {
            IO.fs.writeFile(destFile, "existing");
            expect(IO.fs.copyFile(sourceFile, destFile, true)).toBe(true);
            expect(IO.fs.readFile(destFile)).toBe(IO.fs.readFile(sourceFile));
        });
    });

    describe("moveFile", () => {
        let sourceFile: string;
        let destFile: string;

        beforeEach(() => {
            sourceFile = basePath + "temp-move.txt";
            destFile = basePath + "temp-moved.txt";
            IO.fs.writeFile(sourceFile, "move content");
        });

        afterEach(() => {
            IO.fs.deleteFile(sourceFile);
            IO.fs.deleteFile(destFile);
        });

        it("should move file successfully (happy path)", () => {
            expect(IO.fs.moveFile(sourceFile, destFile)).toBe(true);
            expect(IO.fs.fileExists(destFile)).toBe(true);
            expect(IO.fs.fileExists(sourceFile)).toBe(false);
        });

        it("should return false if destination exists and overwrite false (edge case)", () => {
            IO.fs.writeFile(destFile, "existing");
            expect(IO.fs.moveFile(sourceFile, destFile, false)).toBe(false);
        });
    });

    describe("deleteFile", () => {
        let tempFile: string;

        beforeEach(() => {
            tempFile = basePath + "temp-delete.txt";
            IO.fs.writeFile(tempFile, "delete me");
        });
        afterEach(() => {
            IO.fs.deleteFile(tempFile);
        });

        it("should delete file successfully (happy path)", () => {
            expect(IO.fs.deleteFile(tempFile)).toBe(true);
            expect(IO.fs.fileExists(tempFile)).toBe(false);
        });

        it("should return false for non-existing file (sad path)", () => {
            expect(IO.fs.deleteFile(basePath + "non-existing.txt")).toBe(false);
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
            expect(IO.fs.createDirectory(tempDir)).toBe(true);
            expect(new Folder(tempDir).exists).toBe(true);
        });

        it("should return true if directory already exists (edge case)", () => {
            IO.fs.createDirectory(tempDir);
            expect(IO.fs.createDirectory(tempDir)).toBe(true);
        });
    });

    describe("listFiles", () => {
        it("should list files in directory (happy path)", () => {
            const files = IO.fs.listFiles(basePath);
            expect(files.length).toBeGreaterThan(0);
            expect(files[0]).toBeInstanceOf(File);
        });

        it("should filter files with regex (edge case)", () => {
            const files = IO.fs.listFiles(basePath, /\.txt$/);
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
            const files = IO.fs.listFiles(
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
            const size = IO.fs.getFileSize(basePath + "test-file.txt");
            expect(size).toBeGreaterThan(0);
        });

        it("should return null for non-existing file (sad path)", () => {
            expect(IO.fs.getFileSize(basePath + "non-existing.txt")).toBe(null);
        });
    });

    describe("getFileModifiedDate", () => {
        it("should return modification date (happy path)", () => {
            const date = IO.fs.getFileModifiedDate(basePath + "test-file.txt");
            expect(date).toBeInstanceOf(Date);
        });

        it("should return null for non-existing file (sad path)", () => {
            expect(
                IO.fs.getFileModifiedDate(basePath + "non-existing.txt")
            ).toBe(null);
        });
    });

    describe("resolvePath", () => {
        it("should resolve relative path (happy path)", () => {
            const resolved = IO.path.resolve("test-file.txt", basePath);
            expect(IO.fs.fileExists(resolved)).toBe(true);
        });

        it("should resolve relative path with default base (edge case)", () => {
            const resolved = IO.path.resolve("test-file.txt");
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
            IO.fs.deleteFile(tempJsonFile);
        });

        it("should write and read JSON (happy path)", () => {
            const testData = { key: "value", number: 42 };
            expect(IO.fs.writeJson(tempJsonFile, testData)).toBe(true);
            const readData = IO.fs.readJson(tempJsonFile);
            expect(readData.key).toBe("value");
            expect(readData.number).toBe(42);
        });

        it("should return null for invalid JSON (sad path)", () => {
            IO.fs.writeFile(tempJsonFile, "invalid json");
            expect(IO.fs.readJson(tempJsonFile)).toBe(null);
        });
    });
});

describe("KtIoUtils Tests", () => {
    let tempDir: string;
    let baseTempDir: string;
    beforeAll(() => {
        baseTempDir = ktPath.join(basePath, "src");
        IO.fs.createDirectory(baseTempDir);
    });
    beforeEach(() => {
        tempDir = ktPath.join(baseTempDir, "temp_structure_" + Date.now());
        IO.fs.createDirectory(tempDir);
    });

    afterEach(() => {
        // Clean up - remove the temp directory if it exists
        if (IO.fs.fileExists(tempDir)) {
            IO.fs.removeDirectory(tempDir, true);
        }
    });
    afterAll(() => {
        // Clean up - remove the base temp directory if it exists
        if (IO.fs.fileExists(baseTempDir)) {
            IO.fs.removeDirectory(baseTempDir, true);
        }
    });

    describe("createFolderTree", () => {
        it("should create a simple folder structure from object", () => {
            const structure = {
                folder1: {},
                folder2: {},
            };

            IO.utils.createFolderTree(structure, tempDir);

            expect(IO.fs.fileExists(tempDir + "/folder1")).toBe(true);
            expect(IO.fs.fileExists(tempDir + "/folder2")).toBe(true);
        });

        it("should create nested folder structure", () => {
            const structure = {
                src: {
                    main: {},
                    test: {},
                },
                docs: {},
            };

            IO.utils.createFolderTree(structure, tempDir);

            expect(IO.fs.fileExists(tempDir + "/src")).toBe(true);
            expect(IO.fs.fileExists(tempDir + "/src/main")).toBe(true);
            expect(IO.fs.fileExists(tempDir + "/src/test")).toBe(true);
            expect(IO.fs.fileExists(tempDir + "/docs")).toBe(true);
        });

        it("should handle JSON string input", () => {
            const structureJson = '{"app":{},"config":{}}';

            IO.utils.createFolderTree(structureJson, tempDir);

            expect(IO.fs.fileExists(tempDir + "/app")).toBe(true);
            expect(IO.fs.fileExists(tempDir + "/config")).toBe(true);
        });

        it("should handle empty objects", () => {
            const structure = {
                empty: {},
            };

            IO.utils.createFolderTree(structure, tempDir);

            expect(IO.fs.fileExists(tempDir + "/empty")).toBe(true);
        });
    });
});

runTests();
