export class KtFs {
    static fileExists(filePath: string): boolean {
        return new File(filePath).exists;
    }

    static readFile(fileOrPath: string | File): string | null {
        const file =
            fileOrPath instanceof File ? fileOrPath : new File(fileOrPath);
        if (!file.exists) {
            return null;
        }
        const fileOk = file.open("r");
        if (fileOk) {
            const content = file.read();
            file.close();
            return content;
        }
        return null;
    }

    static openFileDialog(
        prompt: string,
        fileChecker: Function = (file: any) => true
    ): Array<File> {
        const selectedFiles = File.openDialog(prompt);
        const files =
            selectedFiles instanceof Array ? selectedFiles : [selectedFiles];
        const checkedFiles: Array<File> = [];
        if (files instanceof Array) {
            for (const file of files) {
                if (fileChecker(file)) {
                    checkedFiles.push(file);
                }
            }
        }
        return checkedFiles;
    }

    static openFolderDialog(prompt: string): Folder | null {
        const path = File.saveDialog(prompt);
        if (!path) {
            return null;
        }
        const splitPath = path.toString().split("/");
        splitPath.pop();
        const folderPath = splitPath.join("/");
        const folder = new Folder(folderPath);
        return folder.exists ? folder : null;
    }

    static getCurrentScriptFile(): File {
        return new File($.fileName);
    }

    static writeFile(
        fileOrPath: string | File,
        content: string,
        encoding?: string
    ): boolean {
        const file =
            fileOrPath instanceof File ? fileOrPath : new File(fileOrPath);
        try {
            const fileOk = file.open("w", encoding || "UTF-8");
            if (fileOk) {
                file.write(content);
                file.close();
                return true;
            }
        } catch (e) {
            // Handle error
        }
        return false;
    }

    static copyFile(
        sourcePath: string | File,
        destPath: string | File,
        overwrite?: boolean
    ): boolean {
        const source =
            sourcePath instanceof File ? sourcePath : new File(sourcePath);
        const dest = destPath instanceof File ? destPath : new File(destPath);
        if (!source.exists) return false;
        if (dest.exists && !overwrite) return false;
        try {
            return source.copy(dest.fsName);
        } catch (e) {
            return false;
        }
    }

    static moveFile(
        sourcePath: string | File,
        destPath: string | File,
        overwrite?: boolean
    ): boolean {
        const source =
            sourcePath instanceof File ? sourcePath : new File(sourcePath);
        const dest = destPath instanceof File ? destPath : new File(destPath);
        if (!source.exists) return false;
        if (dest.exists && !overwrite) return false;
        try {
            if (source.copy(dest.fsName)) {
                source.remove();
                return true;
            }
        } catch (e) {
            return false;
        }
        return false;
    }

    static deleteFile(fileOrPath: string | File): boolean {
        const file =
            fileOrPath instanceof File ? fileOrPath : new File(fileOrPath);
        if (!file.exists) return false;
        try {
            return file.remove();
        } catch (e) {
            return false;
        }
    }

    static createDirectory(path: string, recursive?: boolean): boolean {
        const folder = new Folder(path);
        if (folder.exists) return true;
        try {
            if (recursive) {
                // For recursive, create parent if needed
                const parent = folder.parent;
                if (parent && !parent.exists) {
                    KtFs.createDirectory(parent.fsName, true);
                }
            }
            return folder.create();
        } catch (e) {
            return false;
        }
    }

    static removeDirectory(path: string, recursive?: boolean): boolean {
        const folder = new Folder(path);
        if (!folder.exists) return false;
        try {
            if (recursive) {
                const files = folder.getFiles();
                for (const file of files) {
                    if (file instanceof File) {
                        KtFs.deleteFile(file);
                    } else if (file instanceof Folder) {
                        KtFs.removeDirectory(file.fsName, recursive);
                    }
                }
            }
            return folder.remove();
        } catch (e) {
            return false;
        }
    }

    static listFiles(
        folderPath: string | Folder,
        filter?: RegExp | Function
    ): Array<File> {
        const folder =
            folderPath instanceof Folder ? folderPath : new Folder(folderPath);
        if (!folder.exists) return [];
        const files = folder.getFiles();
        const filtered: File[] = [];
        for (let i = 0; i < files.length; i++) {
            const f = files[i];
            if (f instanceof File) {
                let include = true;
                if (filter) {
                    if (filter instanceof RegExp) {
                        include = filter.test(f.name);
                    } else if (typeof filter === "function") {
                        include = (filter as (f: File) => boolean)(f);
                    }
                }
                if (include) {
                    filtered.push(f);
                }
            }
        }
        return filtered;
    }

    static getFileSize(fileOrPath: string | File): number | null {
        const file =
            fileOrPath instanceof File ? fileOrPath : new File(fileOrPath);
        if (!file.exists) return null;
        return file.length;
    }

    static getFileModifiedDate(fileOrPath: string | File): Date | null {
        const file =
            fileOrPath instanceof File ? fileOrPath : new File(fileOrPath);
        if (!file.exists) return null;
        return file.modified;
    }

    static writeJson(fileOrPath: string | File, data: any): boolean {
        try {
            const json = JSON.stringify(data);
            return KtFs.writeFile(fileOrPath, json);
        } catch (e) {
            return false;
        }
    }

    static readJson(fileOrPath: string | File): any | null {
        const content = KtFs.readFile(fileOrPath);
        if (!content) return null;
        try {
            return JSON.parse(content);
        } catch (e) {
            return null;
        }
    }
}
