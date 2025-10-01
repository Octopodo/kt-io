import { KtFs } from "./fs";
import { KtPath } from "./path";
import { KtIoUtils } from "./utils";

export class IO {
    static path = KtPath;
    static fs = KtFs;
    static utils = KtIoUtils;

    private name = "KtIo";
    private version = "1.0.0";
}

export const ktPath = KtPath;
export const ktFs = KtFs;
