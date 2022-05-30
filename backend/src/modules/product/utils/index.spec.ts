import "@/database/test";
import { getAuthor } from "@/modules/product/utils/index";

describe("product/util", () => {
    test("it should get the author", async () => {
        const search = "test author:abc good";

        const { author, text } = getAuthor(search);

        expect(author).toBe("abc");
        expect(text).toBe("test good");
    });
    test("it should get the author with quotes", async () => {
        const search = "test author:\"abc 123\" good";

        const { author, text } = getAuthor(search);

        expect(author).toBe("abc 123");
        expect(text).toBe("test good");
    });
});
