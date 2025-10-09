import { describe, it, expect } from "kt-testing-suite-core";
import { IO } from "../index";

describe("IO.path Tests", () => {
    let basePath =
        IO.fs.getCurrentScriptFile().parent.parent.fullName +
        "/src/tests/fixtures/test-files/";

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

    describe("join", () => {
        it("should join multiple path segments (happy path)", () => {
            const joined = IO.path.join(basePath, "subdir", "file.txt");
            expect(joined).toBe(basePath + "subdir/file.txt");
        });
        it("should handle single path segment (edge case)", () => {
            const joined = IO.path.join(basePath);
            expect(joined).toBe(basePath);
        });
        it("should return empty string for no segments (edge case)", () => {
            const joined = IO.path.join();
            expect(joined).toBe("");
        });
        it("should handle segments with leading/trailing slashes (edge case)", () => {
            const joined = IO.path.join(
                basePath + "/",
                "/subdir/",
                "/file.txt"
            );
            expect(joined).toBe(basePath + "subdir/file.txt");
        });
    });

    describe("sanitize", () => {
        it("should convert backslashes to forward slashes", () => {
            const result = IO.path.sanitize("folder\\subfolder\\file.txt");
            expect(result).toBe("folder/subfolder/file.txt");
        });

        it("should remove duplicate forward slashes", () => {
            const result = IO.path.sanitize("folder//subfolder///file.txt");
            expect(result).toBe("folder/subfolder/file.txt");
        });

        it("should handle mixed backslashes and forward slashes", () => {
            const result = IO.path.sanitize(
                "my/path/with\\mixed\\slashes\\/file.txt"
            );
            expect(result).toBe("my/path/with/mixed/slashes/file.txt");
        });

        it("should handle complex mixed slashes patterns", () => {
            const result = IO.path.sanitize(
                "path\\to//folder\\\\with\\/mixed///separators\\file"
            );
            expect(result).toBe("path/to/folder/with/mixed/separators/file");
        });

        it("should handle multiple consecutive slashes of mixed types", () => {
            const result = IO.path.sanitize(
                "folder\\\\//subfolder///\\file.txt"
            );
            expect(result).toBe("folder/subfolder/file.txt");
        });

        it("should preserve single slashes", () => {
            const result = IO.path.sanitize("folder/subfolder/file.txt");
            expect(result).toBe("folder/subfolder/file.txt");
        });

        it("should handle empty string", () => {
            const result = IO.path.sanitize("");
            expect(result).toBe("");
        });

        it("should handle string with only slashes", () => {
            const result = IO.path.sanitize("///\\\\//");
            expect(result).toBe("/");
        });
    });
});
