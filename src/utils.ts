import { KT_Path } from "./path";
import { KT_Fs } from "./fs";
export class KT_IoUtils {
    static scanFolderTree(folderPath: string): any {
        const folder = new Folder(folderPath);
        if (!folder.exists) {
            return null;
        }

        const result: any = {};

        const items = folder.getFiles();
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item instanceof Folder) {
                // It's a subfolder
                result[item.name] = {
                    type: "folder",
                    path: item.fsName,
                    contents: this.scanFolderTree(item.fsName),
                };
            } else if (item instanceof File) {
                // It's a file
                const size = item.length;
                const modified = item.modified
                    ? item.modified.toString()
                    : null;
                result[item.name] = {
                    type: "file",
                    path: item.fsName,
                    size: size,
                    modified: modified,
                };
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
