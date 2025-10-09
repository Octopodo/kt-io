import { ktPath } from "./IO";

export class KtPath {
    static getFileName(file: File | string): string {
        if (typeof file === "string") {
            file = new File(file);
        }
        const fileName = file.name;
        return fileName.replace(new RegExp("\\.[^/.]+$"), "");
    }

    static getFolderName(folder: Folder | string): string {
        if (typeof folder === "string") {
            folder = new Folder(folder);
        }
        return folder.name;
    }

    static getFileExtension(file: File | string): string {
        if (typeof file === "string") {
            file = new File(file);
        }
        const fileName = file.name;
        const match = fileName.match(new RegExp("\\.([^.]+)$"));
        return match ? match[1] : "";
    }

    static stripFileExtension(file: File | string): string {
        if (typeof file === "string") {
            file = new File(file);
        }
        const fileName = file.name;
        return fileName.replace(new RegExp("\\.[^/.]+$"), "");
    }

    static resolve(relativePath: string, basePath?: string): string {
        const base = basePath
            ? new Folder(basePath)
            : new File($.fileName).parent; //Same as KtFs.getCurrentScriptFile()
        const resolved = new File(base.fsName + "/" + relativePath);
        return resolved.fsName.replace(/\\/g, "/");
    }

    static join(...paths: string[]): string {
        if (paths.length === 0) return "";
        let fullPath = paths[0];

        for (let i = 1; i < paths.length; i++) {
            const p = paths[i];
            if (p) {
                fullPath = ktPath.sanitize(fullPath) + "/" + ktPath.sanitize(p);
            }
        }
        return ktPath.sanitize(fullPath);
    }

    static sanitize(path: string): string {
        return path.replace(/\\/g, "/").replace(/\/+/g, "/");
    }
}
