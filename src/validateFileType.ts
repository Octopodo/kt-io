import { KT_Path as path } from "./path";

export function KT_IsValidExtension(
    appExtensionDict: { [key: string]: Array<string> },
    filePath: string | File,
    category?: string
): boolean {
    const file =
        typeof filePath === "string"
            ? new File(path.sanitize(filePath))
            : filePath;
    const ext = path.getFileExtension(file.name).toLowerCase();
    if (!ext) return false;

    const types = appExtensionDict[ext];
    if (!types) return false;
    if (!category) return true;
    for (var i = 0; i < types.length; i++) {
        if (types[i] === category) return true;
    }
    return false;
}
