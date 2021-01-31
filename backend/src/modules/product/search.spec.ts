import "@/database/test";
import * as Fake from "@/database/test/fake";
import ProductModel from "@/modules/product/model";

import { search } from "./search";
import { ESortField } from "@/modules/product/handler/schema";

describe("product/search", () => {
    test("it should search the product title", async () => {
        await ProductModel.ensureIndexes();
        const productA = await Fake.generate(ProductModel, {
            title: "productA",
            description: { short: "example" }
        });
        const productB = await Fake.generate(ProductModel, {
            title: "productB",
            description: { short: "example" }
        });

        const results = await search({ searchText: "productA" });

        expect(results).toHaveLength(1);
        expect(results[0]._id).toStrictEqual(productA._id);
        expect(results[0]._id).not.toStrictEqual(productB._id);
    });
    test("it should return everything sorted by name", async () => {
        await ProductModel.ensureIndexes();
        const productA = await Fake.generate(ProductModel, { title: "A" });
        const productB = await Fake.generate(ProductModel, { title: "B" });

        const results = await search({ sortField: ESortField.name });

        expect(results).toHaveLength(2);
        expect(results[0]._id).toStrictEqual(productA._id);
        expect(results[1]._id).toStrictEqual(productB._id);
    });
    test("it should skip one and limit one", async () => {
        await ProductModel.ensureIndexes();
        const productA = await Fake.generate(ProductModel, { title: "A" });
        const productB = await Fake.generate(ProductModel, { title: "B" });
        const productC = await Fake.generate(ProductModel, { title: "C" });

        const results = await search({ sortField: ESortField.name, skip: 1, limit: 1 });

        expect(results).toHaveLength(1);
        expect(results[0]._id).not.toStrictEqual(productA._id);
        expect(results[0]._id).toStrictEqual(productB._id);
        expect(results[0]._id).not.toStrictEqual(productC._id);
    });
});
