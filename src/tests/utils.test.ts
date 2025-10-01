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
