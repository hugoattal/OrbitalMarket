import "@/database/test";
import * as Fake from "@/database/test/fake";
import ProductModel from "@/modules/product/model";

import { search } from "./search";
import { ESortDirection, ESortField } from "@/modules/product/handler/schema";

describe("product/search", () => {
    beforeEach(async () => {
        await ProductModel.ensureIndexes();
    });

    test("it should search the product title", async () => {
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
        const productA = await Fake.generate(ProductModel, { title: "A" });
        const productB = await Fake.generate(ProductModel, { title: "B" });

        const results = await search({ sortField: ESortField.name, sortDirection: ESortDirection.asc });

        expect(results).toHaveLength(2);
        expect(results[0]._id).toStrictEqual(productA._id);
        expect(results[1]._id).toStrictEqual(productB._id);
    });
    test("it should skip one and limit one", async () => {
        const productA = await Fake.generate(ProductModel, { title: "A" });
        const productB = await Fake.generate(ProductModel, { title: "B" });
        const productC = await Fake.generate(ProductModel, { title: "C" });

        const results = await search({ skip: 1, limit: 1 });

        expect(results).toHaveLength(1);
        expect(results[0]._id).not.toStrictEqual(productA._id);
        expect(results[0]._id).toStrictEqual(productB._id);
        expect(results[0]._id).not.toStrictEqual(productC._id);
    });
    test("it should find the products with the right engine version", async () => {
        const productA = await Fake.generate(ProductModel, {
            title: "A",
            computed: { engine: { min: [4, 10], max: [4, 20] } }
        });
        const productB = await Fake.generate(ProductModel, {
            title: "B",
            computed: { engine: { min: [4, 10], max: [4, 15] } }
        });
        await Fake.generate(ProductModel, {
            title: "C",
            computed: { engine: { min: [4, 10], max: [4, 14] } }
        });
        const productD = await Fake.generate(ProductModel, {
            title: "D",
            computed: { engine: { min: [4, 10], max: [4, 25] } }
        });
        const productE = await Fake.generate(ProductModel, {
            title: "E",
            computed: { engine: { min: [4, 17], max: [4, 19] } }
        });

        const results = await search({
            sortField: ESortField.name,
            sortDirection: ESortDirection.asc,
            engine: { min: [4, 15], max: [4, 20] }
        });

        expect(results).toHaveLength(4);
        expect(results[0]._id).toStrictEqual(productA._id);
        expect(results[1]._id).toStrictEqual(productB._id);
        expect(results[2]._id).toStrictEqual(productD._id);
        expect(results[3]._id).toStrictEqual(productE._id);
    });
    test("it should find the products with the exact engine version", async () => {
        const productA = await Fake.generate(ProductModel, {
            title: "A",
            computed: { engine: { min: [4, 20], max: [4, 25] } }
        });
        const productB = await Fake.generate(ProductModel, {
            title: "B",
            computed: { engine: { min: [4, 25], max: [4, 30] } }
        });
        const productC = await Fake.generate(ProductModel, {
            title: "C",
            computed: { engine: { min: [4, 25], max: [4, 25] } }
        });

        const results = await search({
            sortField: ESortField.name,
            sortDirection: ESortDirection.asc,
            engine: { min: [4, 25], max: [4, 25] }
        });

        expect(results).toHaveLength(3);
        expect(results[0]._id).toStrictEqual(productA._id);
        expect(results[1]._id).toStrictEqual(productB._id);
        expect(results[2]._id).toStrictEqual(productC._id);
    });
    test("it should find the product with the right price", async () => {
        const productA = await Fake.generate(ProductModel, { title: "A", price: { value: 0 } });
        const productB = await Fake.generate(ProductModel, { title: "B", price: { value: 1000 } });
        const productC = await Fake.generate(ProductModel, { title: "C", price: { value: 2000 } });

        const results = await search({
            sortField: ESortField.name,
            sortDirection: ESortDirection.asc,
            price: { min: 500, max: 1000 }
        });

        expect(results).toHaveLength(1);
        expect(results[0]._id).not.toStrictEqual(productA._id);
        expect(results[0]._id).toStrictEqual(productB._id);
        expect(results[0]._id).not.toStrictEqual(productC._id);
    });
    test("it should find sort the product according to relevancy", async () => {
        const productA = await Fake.generate(ProductModel, {
            title: "Darker Nodes",
            description: { short: "A theme editor plugin" }
        });
        const productB = await Fake.generate(ProductModel, {
            title: "Electronic Nodes",
            description: { short: "Improve Blueprints readability" }
        });
        await Fake.generate(ProductModel, {
            title: "Voxel Plugin",
            description: { short: "Voxel plugin with powerful tools" }
        });

        const results = await search({ sortField: ESortField.popularity, searchText: "Electronic Nodes" });

        expect(results).toHaveLength(2);
        expect(results[0]._id).toStrictEqual(productB._id);
        expect(results[1]._id).toStrictEqual(productA._id);
    });
    test("it should select only discounted product", async () => {
        await Fake.generate(ProductModel, {
            price: { value: 1000 },
            discount: { value: 0 }
        });
        const discountedProduct = await Fake.generate(ProductModel, {
            price: { value: 2000 },
            discount: { value: 50 }
        });
        await Fake.generate(ProductModel, {
            price: { value: 0 },
            discount: { value: 0 }
        });

        const results = await search({ discounted: true });

        expect(results).toHaveLength(1);
        expect(results[0]._id).toStrictEqual(discountedProduct._id);
    });
    /*
    test("it should take discount into account when filtering by price", async () => {
        const productA = await Fake.generate(ProductModel, {
            title: "A",
            price: { value: 1000 },
            discount: { value: 0 }
        });
        await Fake.generate(ProductModel, {
            title: "B",
            price: { value: 2000 },
            discount: { value: 0 }
        });
        const productC = await Fake.generate(ProductModel, {
            title: "C",
            price: { value: 2000 },
            discount: { value: 50 }
        });

        const results = await search({ sortField: ESortField.name, price: { min: 0, max: 1000 } });

        expect(results).toHaveLength(2);
        expect(results[0]._id).toStrictEqual(productA._id);
        expect(results[1]._id).toStrictEqual(productC._id);
    });
     */
});
