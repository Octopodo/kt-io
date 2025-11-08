import { IO } from "../IO";
import { KT_FolderDescriptor, KT_FileDescriptor } from "../utils";
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
        it("should return folder descriptor for non-existent folder", () => {
            const nonExistentPath = IO.path.join(tempDir, "nonexistent");
            const result = IO.utils.scanFolder(nonExistentPath);
            expect(result).toBeDefined();
            expect(result.type).toBe("folder");
            expect(result.exists).toBe(false);
            expect(result.contents).toEqual([]);
        });

        it("should scan an empty folder", () => {
            const result = IO.utils.scanFolder(tempDir);
            expect(result).toBeDefined();
            expect(result.type).toBe("folder");
            expect(result.path).toBe(tempDir);
            expect(result.exists).toBe(true);
            expect(result.contents).toEqual([]);
        });

        it("should scan a folder with files (shallow)", () => {
            // Create some files
            const file1 = IO.path.join(tempDir, "file1.txt");
            const file2 = IO.path.join(tempDir, "file2.js");
            IO.fs.writeFile(file1, "content1");
            IO.fs.writeFile(file2, "content2");

            const result = IO.utils.scanFolder(tempDir, false);

            expect(result).toBeDefined();
            expect(result.type).toBe("folder");
            expect(result.path).toBe(tempDir);
            let file1Item: any = null;
            for (let i = 0; i < result.contents.length; i++) {
                if (result.contents[i].name === "file1") {
                    file1Item = result.contents[i];
                    break;
                }
            }
            expect(file1Item).toBeDefined();
            expect(file1Item.type).toBe("file");
            expect(file1Item.path).toBe(file1);
            expect(file1Item.extension).toBe("txt");
            let file2Item: any = null;
            for (let i = 0; i < result.contents.length; i++) {
                if (result.contents[i].name === "file2") {
                    file2Item = result.contents[i];
                    break;
                }
            }
            expect(file2Item).toBeDefined();
            expect(file2Item.type).toBe("file");
            expect(file2Item.extension).toBe("js");
        });

        it("should scan a folder with subfolders (shallow)", () => {
            // Create subfolders
            const subDir1 = IO.path.join(tempDir, "subdir1");
            const subDir2 = IO.path.join(tempDir, "subdir2");
            IO.fs.createDirectory(subDir1);
            IO.fs.createDirectory(subDir2);

            const result = IO.utils.scanFolder(tempDir, false);

            expect(result).toBeDefined();
            expect(result.type).toBe("folder");
            expect(result.path).toBe(tempDir);
            let subDir1Item: any = null;
            for (let i = 0; i < result.contents.length; i++) {
                if (result.contents[i].name === "subdir1") {
                    subDir1Item = result.contents[i];
                    break;
                }
            }
            expect(subDir1Item).toBeDefined();
            expect(subDir1Item.type).toBe("folder");
            expect(subDir1Item.path).toBe(subDir1);
            expect((subDir1Item as KT_FolderDescriptor).contents).toEqual([]);

            let subDir2Item: any = null;
            for (let i = 0; i < result.contents.length; i++) {
                if (result.contents[i].name === "subdir2") {
                    subDir2Item = result.contents[i];
                    break;
                }
            }
            expect(subDir2Item).toBeDefined();
            expect(subDir2Item.type).toBe("folder");
            expect((subDir2Item as KT_FolderDescriptor).contents).toEqual([]);
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
            expect(result!.type).toBe("folder");
            expect(result!.path).toBe(tempDir);
            // Check root file
            let file1Item: any = null;
            for (let i = 0; i < result.contents.length; i++) {
                if (result.contents[i].name === "file1") {
                    file1Item = result.contents[i];
                    break;
                }
            }
            expect(file1Item).toBeDefined();
            expect(file1Item.type).toBe("file");
            // Check subfolder
            let subDirItem: any = null;
            for (let i = 0; i < result.contents.length; i++) {
                if (result.contents[i].name === "subdir") {
                    subDirItem = result.contents[i];
                    break;
                }
            }
            expect(subDirItem).toBeDefined();
            expect(subDirItem.type).toBe("folder");
            expect((subDirItem as KT_FolderDescriptor).contents).toBeDefined();
            let file2Item: any = null;
            for (
                let i = 0;
                i < (subDirItem as KT_FolderDescriptor).contents.length;
                i++
            ) {
                if (
                    (subDirItem as KT_FolderDescriptor).contents[i].name ===
                    "file2"
                ) {
                    file2Item = (subDirItem as KT_FolderDescriptor).contents[i];
                    break;
                }
            }
            expect(file2Item).toBeDefined();
            expect(file2Item.type).toBe("file");
            expect(file2Item.extension).toBe("js");
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
            expect(result!.type).toBe("folder");
            expect(result!.path).toBe(tempDir);
            let file1Item: any = null;
            for (let i = 0; i < result.contents.length; i++) {
                if (result.contents[i].name === "file1") {
                    file1Item = result.contents[i];
                    break;
                }
            }
            expect(file1Item.type).toBe("file");

            let subDirItem: any = null;
            for (let i = 0; i < result.contents.length; i++) {
                if (result.contents[i].name === "subdir") {
                    subDirItem = result.contents[i];
                    break;
                }
            }
            expect(subDirItem.type).toBe("folder");

            let file2Item: any = null;
            for (let i = 0; i < (subDirItem as any).contents.length; i++) {
                if ((subDirItem as any).contents[i].name === "file2") {
                    file2Item = (subDirItem as any).contents[i];
                    break;
                }
            }
            expect(file2Item.type).toBe("file");

            let subSubDirItem: any = null;
            for (let i = 0; i < (subDirItem as any).contents.length; i++) {
                if ((subDirItem as any).contents[i].name === "subsubdir") {
                    subSubDirItem = (subDirItem as any).contents[i];
                    break;
                }
            }
            expect(subSubDirItem.type).toBe("folder");
            expect(subSubDirItem.contents).toEqual([]);
        });
    });

    describe("KT_FolderDescriptor", () => {
        let folderDescriptor: any;

        beforeEach(() => {
            // Create a test folder structure
            const subDir = IO.path.join(tempDir, "testfolder");
            IO.fs.createDirectory(subDir);
            const file1 = IO.path.join(subDir, "file1.txt");
            const file2 = IO.path.join(subDir, "file2.js");
            IO.fs.writeFile(file1, "content1");
            IO.fs.writeFile(file2, "content2");

            folderDescriptor = IO.utils.scanFolder(subDir);
        });

        describe("getFiles", () => {
            it("should return files from current level (shallow)", () => {
                const files = folderDescriptor.getFiles(false);
                expect(files.length).toBe(2);
                const filePaths = [];
                for (let i = 0; i < files.length; i++) {
                    filePaths.push(files[i].path);
                }
                expect(filePaths).toInclude(
                    IO.path.join(tempDir, "testfolder/file1.txt")
                );
                expect(filePaths).toInclude(
                    IO.path.join(tempDir, "testfolder/file2.js")
                );
            });

            it("should return files from current level only (shallow)", () => {
                // Create nested structure
                const nestedDir = IO.path.join(tempDir, "testfolder/nested");
                IO.fs.createDirectory(nestedDir);
                const nestedFile = IO.path.join(nestedDir, "nested.txt");
                IO.fs.writeFile(nestedFile, "nested");

                // Re-scan the folder to include the new nested structure
                const updatedDescriptor = IO.utils.scanFolder(
                    IO.path.join(tempDir, "testfolder"),
                    true
                );

                const files = updatedDescriptor.getFiles(false);
                expect(files.length).toBe(2);
                const filePaths = [];
                for (let i = 0; i < files.length; i++) {
                    filePaths.push(files[i].path);
                }
                expect(filePaths).toInclude(
                    IO.path.join(tempDir, "testfolder/file1.txt")
                );
                expect(filePaths).toInclude(
                    IO.path.join(tempDir, "testfolder/file2.js")
                );
                let containsNestedFile = false;
                for (let i = 0; i < filePaths.length; i++) {
                    if (filePaths[i] === nestedFile) {
                        containsNestedFile = true;
                        break;
                    }
                }
                expect(containsNestedFile).toBe(false);
            });

            it("should return all files recursively (deep)", () => {
                // Create nested structure
                const nestedDir = IO.path.join(tempDir, "testfolder/nested");
                IO.fs.createDirectory(nestedDir);
                const nestedFile = IO.path.join(nestedDir, "nested.txt");
                IO.fs.writeFile(nestedFile, "nested");

                // Re-scan the folder to include the new nested structure
                const updatedDescriptor = IO.utils.scanFolder(
                    IO.path.join(tempDir, "testfolder"),
                    true
                );

                const files = updatedDescriptor.getFiles(true);
                expect(files.length).toBe(3);
                const filePaths = [];
                for (let i = 0; i < files.length; i++) {
                    filePaths.push(files[i].path);
                }
                expect(filePaths).toInclude(
                    IO.path.join(tempDir, "testfolder/file1.txt")
                );
                expect(filePaths).toInclude(
                    IO.path.join(tempDir, "testfolder/file2.js")
                );
                expect(filePaths).toInclude(nestedFile);
            });
        });

        describe("getContents", () => {
            it("should return contents from current level (shallow)", () => {
                const contents = folderDescriptor.getContents(false);
                expect(contents.length).toBe(2);
                const contentPaths = [];
                for (let i = 0; i < contents.length; i++) {
                    contentPaths.push(contents[i].path);
                }
                expect(contentPaths).toInclude(
                    IO.path.join(tempDir, "testfolder/file1.txt")
                );
                expect(contentPaths).toInclude(
                    IO.path.join(tempDir, "testfolder/file2.js")
                );
            });

            it("should return all contents recursively (deep)", () => {
                // Create nested structure
                const nestedDir = IO.path.join(tempDir, "testfolder/nested");
                IO.fs.createDirectory(nestedDir);
                const nestedFile = IO.path.join(nestedDir, "nested.txt");
                IO.fs.writeFile(nestedFile, "nested");

                // Re-scan the folder to include the new nested structure
                const updatedDescriptor = IO.utils.scanFolder(
                    IO.path.join(tempDir, "testfolder"),
                    true
                );

                const contents = updatedDescriptor.getContents(true);
                expect(contents.length).toBe(4); // 2 files + 1 folder + 1 nested file
                const contentPaths = [];
                for (let i = 0; i < contents.length; i++) {
                    contentPaths.push(contents[i].path);
                }
                expect(contentPaths).toInclude(
                    IO.path.join(tempDir, "testfolder/file1.txt")
                );
                expect(contentPaths).toInclude(
                    IO.path.join(tempDir, "testfolder/file2.js")
                );
                expect(contentPaths).toInclude(nestedDir);
                expect(contentPaths).toInclude(nestedFile);
            });
        });

        describe("getFolders", () => {
            it("should return folders from current level (shallow)", () => {
                const folders = folderDescriptor.getFolders(false);
                expect(folders.length).toBe(0); // No folders in the initial structure
            });

            it("should return all folders recursively (deep)", () => {
                // Create nested structure
                const nestedDir = IO.path.join(tempDir, "testfolder/nested");
                IO.fs.createDirectory(nestedDir);
                const deepNestedDir = IO.path.join(nestedDir, "deep");
                IO.fs.createDirectory(deepNestedDir);

                // Re-scan the folder to include the new nested structure
                const updatedDescriptor = IO.utils.scanFolder(
                    IO.path.join(tempDir, "testfolder"),
                    true
                );

                const folders = updatedDescriptor.getFolders(true);
                expect(folders.length).toBe(2);
                const folderPaths = [];
                for (let i = 0; i < folders.length; i++) {
                    folderPaths.push(folders[i].path);
                }
                expect(folderPaths).toInclude(nestedDir);
                expect(folderPaths).toInclude(deepNestedDir);
            });
        });
        describe("getPaths", () => {
            it("should return paths from current level (shallow)", () => {
                const paths = folderDescriptor.getPaths(false);
                expect(paths.length).toBe(2);
                expect(paths).toInclude(
                    IO.path.join(tempDir, "testfolder/file1.txt")
                );
                expect(paths).toInclude(
                    IO.path.join(tempDir, "testfolder/file2.js")
                );
            });
            it("should return all paths recursively (deep)", () => {
                // Create nested structure
                const nestedDir = IO.path.join(tempDir, "testfolder/nested");
                IO.fs.createDirectory(nestedDir);
                const nestedFile = IO.path.join(nestedDir, "nested.txt");
                IO.fs.writeFile(nestedFile, "nested");
                // Re-scan the folder to include the new nested structure
                const updatedDescriptor = IO.utils.scanFolder(
                    IO.path.join(tempDir, "testfolder"),
                    true
                );
                const paths = updatedDescriptor.getPaths(true);
                expect(paths.length).toBe(4);
                expect(paths).toInclude(
                    IO.path.join(tempDir, "testfolder/file1.txt")
                );
                expect(paths).toInclude(
                    IO.path.join(tempDir, "testfolder/file2.js")
                );
                expect(paths).toInclude(nestedDir);
                expect(paths).toInclude(nestedFile);
            });
        });
    });

    describe("KT_FileDescriptor", () => {
        let fileDescriptor: any;

        beforeEach(() => {
            const testFile = IO.path.join(tempDir, "testfile.txt");
            IO.fs.writeFile(testFile, "test content");
            fileDescriptor = new KT_FileDescriptor(testFile);
        });

        it("should have correct properties", () => {
            expect(fileDescriptor.type).toBe("file");
            expect(fileDescriptor.name).toBe("testfile");
            expect(fileDescriptor.path).toBe(
                IO.path.join(tempDir, "testfile.txt")
            );
            expect(fileDescriptor.extension).toBe("txt");
            expect(fileDescriptor.size).toBeDefined();
            expect(fileDescriptor.modified).toBeDefined();
        });
    });
});
