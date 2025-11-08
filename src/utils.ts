import { KT_Path } from "./path";
import { KT_Fs } from "./fs";

// type KTFileDescriptor = {
//     type: "file";
//     name: string;
//     path: string;
//     size: number;
//     modified: string | null;
//     extension: string | null;
// };

// type KTFolderDescriptor = {
//     type: "folder";
//     name: string;
//     path: string;
//     exists: boolean;
//     contents: (KTFileDescriptor | KTFolderDescriptor)[];
// };

// type KTScanResult =  KTFileDescriptor | KTFolderDescriptor;

export abstract class KT_Descriptor {
    public path: string;
    public name: string;
    public type: "file" | "folder";
    constructor(path: string, name: string, type: "file" | "folder") {
        this.path = path;
        this.name = name;
        this.type = type;
    }
}

export class KT_FileDescriptor extends KT_Descriptor {
    extension: string | null;
    size: number;
    modified: string | null;

    constructor(path: string) {
        const isFile = KT_Fs.fileExists(path);
        if (!isFile) {
            throw new Error("Path does not point to a valid file: " + path);
        }
        const fileName = KT_Path.getFileName(path);
        super(path, fileName, "file");
        this.extension = KT_Path.getFileExtension(path);
        const fileObj = new File(path);
        this.size = fileObj.length;
        this.modified = fileObj.modified ? fileObj.modified.toString() : null;
    }
}

export class KT_FolderDescriptor extends KT_Descriptor {
    exists: boolean;
    contents: KT_Descriptor[];

    constructor(path: string) {
        const isFolder = KT_Fs.folderExists(path);

        const folderName = KT_Path.getFileName(path);
        super(path, folderName, "folder");
        this.exists = isFolder;
        this.contents = [];
    }

    getFiles(deep: boolean = false): KT_FileDescriptor[] {
        const files: KT_FileDescriptor[] = [];
        for (let i = 0; i < this.contents.length; i++) {
            const item = this.contents[i];
            if (item.type === "file") {
                files.push(item as KT_FileDescriptor);
            } else if (item.type === "folder") {
                if (deep) {
                    const subFiles = (item as KT_FolderDescriptor).getFiles(
                        deep
                    );
                    files.push(...subFiles);
                }
                // For shallow scan, don't include files from subfolders
            }
        }
        return files;
    }

    getContents(deep: boolean = false): KT_Descriptor[] {
        const contents: KT_Descriptor[] = [];
        for (let i = 0; i < this.contents.length; i++) {
            const item = this.contents[i];
            contents.push(item);
            if (item.type === "folder") {
                const subContents = (item as KT_FolderDescriptor).getContents(
                    deep
                );
                contents.push(...subContents);
            }
        }
        return contents;
    }

    getFolders(deep: boolean = false): KT_FolderDescriptor[] {
        const folders: KT_FolderDescriptor[] = [];
        for (let i = 0; i < this.contents.length; i++) {
            const item = this.contents[i];
            if (item.type === "folder") {
                folders.push(item as KT_FolderDescriptor);
                if (deep) {
                    const subFolders = (item as KT_FolderDescriptor).getFolders(
                        true
                    );
                    folders.push(...subFolders);
                }
            }
        }
        return folders;
    }

    getPaths(deep: boolean = false): string[] {
        const paths: string[] = [];
        for (let i = 0; i < this.contents.length; i++) {
            const item = this.contents[i];
            paths.push(item.path);
            if (item.type === "folder") {
                const subPaths = (item as KT_FolderDescriptor).getPaths(deep);
                paths.push(...subPaths);
            }
        }
        return paths;
    }
}

export class KT_IoUtils {
    static scanFolder(
        folderPath: string,
        deep: boolean = false
    ): KT_FolderDescriptor {
        const folder = new Folder(folderPath);

        if (!folder.exists) {
            const result = new KT_FolderDescriptor(folderPath);
            return result;
        }

        const result = new KT_FolderDescriptor(folderPath);
        const items = folder.getFiles();

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item instanceof Folder) {
                // It's a subfolder
                if (deep === true) {
                    const subFolder = this.scanFolder(item.fullName, true);
                    result.contents.push(subFolder);
                } else {
                    const subFolder = new KT_FolderDescriptor(item.fullName);
                    subFolder.contents = []; // Empty for shallow scan
                    result.contents.push(subFolder);
                }
            } else if (item instanceof File) {
                // It's a file
                const fileDescriptor = new KT_FileDescriptor(item.fullName);
                result.contents.push(fileDescriptor);
            }
        }

        return result;
    }

    static createFolderTree(tree: object | string, rootPath: string): any {
        if (typeof tree === "string") {
            tree = JSON.parse(tree);
        }

        return this._createFoldersRecursive(tree as any, rootPath);
    }

    private static _createFoldersRecursive(
        tree: any,
        currentPath: string,
        outTree: any = {}
    ): any {
        for (const key in tree) {
            if (tree.hasOwnProperty(key)) {
                const fullPath = KT_Path.join(currentPath, key);
                const value = tree[key];

                // Create the directory
                KT_Fs.createDirectory(fullPath, true);
                outTree[key] = { path: fullPath };
                // If the value is an object with properties, recurse
                if (typeof value === "object" && value !== null) {
                    let hasKeys = false;
                    for (const k in value) {
                        if (value.hasOwnProperty(k)) {
                            hasKeys = true;
                            break;
                        }
                    }
                    if (hasKeys) {
                        this._createFoldersRecursive(
                            value,
                            fullPath,
                            outTree[key]
                        );
                    }
                }
            }
        }
        return outTree;
    }
}
