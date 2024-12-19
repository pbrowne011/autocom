import * as assert from "assert";
import { wrapLine } from "../format/wrap";
import { getCommentStyle } from "../format/lang";
import { formatComment } from "../format";

suite("Line Wrapping", () => {
    test("empty string returns empty array", () => {
        assert.deepStrictEqual(wrapLine("", 10), []);
    });

    test("single long string", () => {
        assert.deepStrictEqual(wrapLine("thisisastring", 10), ["thisisastring"]);
    });

    test("single long string with initial spaces", () => {
        assert.deepStrictEqual(wrapLine("    thisisalongstring", 10), ["    thisisalongstring"]);
    });
    
    test("single string with tab delimiter", () => {
        assert.deepStrictEqual(wrapLine("\tthisisastring\t", 10), ["\tthisisastring"]);
    });

    test("trim lead and trailing whitespace of every line after first", () => {
        assert.deepStrictEqual(
            wrapLine(" this is a string    ", 10),
            [" this is a", "string"]
        );
    });

    test("handle spacing between words", () => {
        assert.deepStrictEqual(
            wrapLine("string1              string2", 10),
            ["string1", "string2"]
        );
    });

    test("uses default maxLength when not specified", () => {
        const longString = "a".repeat(101);
        const result = wrapLine(longString);
        assert.ok(
            result.length === 1,
            "Should not split string longer than default max length"
        );
    });
});