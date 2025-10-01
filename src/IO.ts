import { KtFs } from "./fs";
import { KtPath } from "./path";

export class IO {
    static path = KtPath;
    static fs = KtFs;

    private name = "KtIo";
    private version = "1.0.0";
}

export const ktPath = KtPath;
export const ktFs = KtFs;
