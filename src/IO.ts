import { KT_Fs } from "./fs";
import { KT_Path } from "./path";
import { KT_IoUtils } from "./utils";

class IO {
    static path = KT_Path;
    static fs = KT_Fs;
    static utils = KT_IoUtils;

    private name = "KtIo";
    private version = "1.0.0";
}

export { IO, KT_Fs, KT_Path, KT_IoUtils };
