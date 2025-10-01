import { KtPath } from "./path";
import { KtFs } from "./fs";
export class KtIoUtils {
    static createFolderTree(tree: object | string, rootPath: string): void {
        if (typeof tree === "string") {
            tree = JSON.parse(tree);
        }

        this._createFoldersRecursive(tree as any, rootPath);
    }

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

    private static _createFoldersRecursive(
        tree: any,
        currentPath: string
    ): void {
        for (const key in tree) {
            if (tree.hasOwnProperty(key)) {
                const fullPath = KtPath.join(currentPath, key);
                const value = tree[key];

                // Create the directory
                KtFs.createDirectory(fullPath, true);

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
                        this._createFoldersRecursive(value, fullPath);
                    }
                }
            }
        }
    }
}
