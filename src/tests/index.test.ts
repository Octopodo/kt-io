import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    runTests,
    getSuites,
    beforeAll,
    afterAll,
} from "kt-testing-suite-core";
import { IO } from "../index";
import "./path.test";
import "./fs.test";
import "./utils.test";

describe("IO Tests", () => {
    it("should be able to create a new instance of IO", () => {
        const plugin = new IO();
        expect(plugin).toBeInstanceOf(IO);
    });
});
runTests();
