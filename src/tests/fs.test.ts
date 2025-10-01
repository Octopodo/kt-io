import { IO } from "../index";
import {
    describe,
    it,
    expect,
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
} from "kt-testing-suite-core";

describe("IO fs Tests", () => {
    let basePath =
        IO.fs.getCurrentScriptFile().parent.parent.fullName +
        "/src/tests/fixtures/test-files/";

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
