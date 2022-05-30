import "@/database/test";
import { getAuthor } from "@/modules/product/utils/index";

describe("product/util", () => {
    test("it should get the author", async () => {
        const search = "test author:abc test";

        const author = getAuthor(search);

        expect(author).toBe("author:abc");
    });
    test("it should get the author with quotes", async () => {
        const search = "test author:\"abc 123\" test";

        const author = getAuthor(search);

        expect(author).toBe("author:\"abc 123\"");
    });
});
