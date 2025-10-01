import { KtPath } from "./path";
import { KtFs } from "./fs";
export class KtIoUtils {
    static createFolderTree(tree: object | string, rootPath: string): void {
        if (typeof tree === "string") {
            tree = JSON.parse(tree);
        }

        this._createFoldersRecursive(tree as any, rootPath);
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
