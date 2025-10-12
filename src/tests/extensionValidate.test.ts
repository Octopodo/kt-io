import { IO } from "../index";
import { KT_IsValidExtension as validateExtension } from "../validateFileType";
import { aeExtensions } from "./fixtures/aeValidators";
import {
    describe,
    it,
    expect,
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
} from "kt-testing-suite-core";

describe("IO - Extension Validation", () => {
    it("should import only ae extensions", () => {
        const valid = validateExtension(aeExtensions, "file.jpg", "image");
        expect(valid).toBe(true);
    });
    it("should validate without category", () => {
        const valid = validateExtension(aeExtensions, "file.jpg");
        expect(valid).toBe(true);
    });
});
