import { IO } from "../IO";
import {
    expect,
    describe,
    it,
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
} from "kt-testing-suite-core";

describe("IO Utils Tests", () => {
    let tempDir: string;
    let baseTempDir: string;
    let basePath =
        IO.fs.getCurrentScriptFile().parent.parent.fullName +
        "/src/tests/fixtures/test-files/";

    beforeAll(() => {
        baseTempDir = IO.path.join(basePath, "src");
        IO.fs.createDirectory(baseTempDir);
    });
    beforeEach(() => {
        tempDir = IO.path.join(baseTempDir, "temp_structure_" + Date.now());
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

    describe("scanFolder", () => {
        it("should return null for non-existent folder", () => {
            const nonExistentPath = IO.path.join(tempDir, "nonexistent");
            const result = IO.utils.scanFolder(nonExistentPath);
            expect(result).toBe(null);
        });

        it("should scan an empty folder", () => {
            const result = IO.utils.scanFolder(tempDir);
            expect(result).toEqual({});
        });

        it("should scan a folder with files (shallow)", () => {
            // Create some files
            const file1 = IO.path.join(tempDir, "file1.txt");
            const file2 = IO.path.join(tempDir, "file2.js");
            IO.fs.writeFile(file1, "content1");
            IO.fs.writeFile(file2, "content2");

            const result = IO.utils.scanFolder(tempDir, false);

            expect(result).toBeDefined();
            expect(result["file1.txt"]).toBeDefined();
            expect(result["file1.txt"].type).toBe("file");
            expect(result["file1.txt"].path).toBe(file1);
            expect(result["file1.txt"].extension).toBe("txt");
            expect(result["file2.js"]).toBeDefined();
            expect(result["file2.js"].type).toBe("file");
            expect(result["file2.js"].extension).toBe("js");
        });

        it("should scan a folder with subfolders (shallow)", () => {
            // Create subfolders
            const subDir1 = IO.path.join(tempDir, "subdir1");
            const subDir2 = IO.path.join(tempDir, "subdir2");
            IO.fs.createDirectory(subDir1);
            IO.fs.createDirectory(subDir2);

            const result = IO.utils.scanFolder(tempDir, false);

            expect(result).toBeDefined();
            expect(result["subdir1"]).toBeDefined();
            expect(result["subdir1"].type).toBe("folder");
            expect(result["subdir1"].path).toBe(subDir1);
            expect(result["subdir1"].contents).toBe(null);
            expect(result["subdir2"]).toBeDefined();
            expect(result["subdir2"].type).toBe("folder");
            expect(result["subdir2"].contents).toBe(null);
        });

        it("should scan a folder with files and subfolders (deep)", () => {
            // Create structure: tempDir/file1.txt, tempDir/subdir/file2.js
            const file1 = IO.path.join(tempDir, "file1.txt");
            IO.fs.writeFile(file1, "content1");

            const subDir = IO.path.join(tempDir, "subdir");
            IO.fs.createDirectory(subDir);
            const file2 = IO.path.join(subDir, "file2.js");
            IO.fs.writeFile(file2, "content2");

            const result = IO.utils.scanFolder(tempDir, true);

            expect(result).toBeDefined();
            // Check root file
            expect(result["file1.txt"]).toBeDefined();
            expect(result["file1.txt"].type).toBe("file");
            // Check subfolder
            expect(result["subdir"]).toBeDefined();
            expect(result["subdir"].type).toBe("folder");
            expect(result["subdir"].contents).toBeDefined();
            expect(result["subdir"].contents["file2.js"]).toBeDefined();
            expect(result["subdir"].contents["file2.js"].type).toBe("file");
            expect(result["subdir"].contents["file2.js"].extension).toBe("js");
        });

        it("should handle mixed content (files and folders) with deep scan", () => {
            // Create: tempDir/file1.txt, tempDir/subdir/, tempDir/subdir/file2.js, tempDir/subdir/subsubdir/
            const file1 = IO.path.join(tempDir, "file1.txt");
            IO.fs.writeFile(file1, "content1");

            const subDir = IO.path.join(tempDir, "subdir");
            IO.fs.createDirectory(subDir);
            const file2 = IO.path.join(subDir, "file2.js");
            IO.fs.writeFile(file2, "content2");
            const subSubDir = IO.path.join(subDir, "subsubdir");
            IO.fs.createDirectory(subSubDir);

            const result = IO.utils.scanFolder(tempDir, true);

            expect(result).toBeDefined();
            expect(result["file1.txt"].type).toBe("file");
            expect(result["subdir"].type).toBe("folder");
            expect(result["subdir"].contents["file2.js"].type).toBe("file");
            expect(result["subdir"].contents["subsubdir"].type).toBe("folder");
            expect(result["subdir"].contents["subsubdir"].contents).toEqual({});
        });
    });
});
