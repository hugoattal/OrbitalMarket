import "@/database/test";
import * as Fake from "@/database/test/fake";
import ProductModel from "@/modules/product/old-model";

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

        const results = await search({ sortDirection: ESortDirection.asc, sortField: ESortField.name });

        expect(results).toHaveLength(2);
        expect(results[0]._id).toStrictEqual(productA._id);
        expect(results[1]._id).toStrictEqual(productB._id);
    });
    test("it should skip one and limit one", async () => {
        const productA = await Fake.generate(ProductModel, { title: "A", computed: { score: { value: 10 } } });
        const productB = await Fake.generate(ProductModel, { title: "B", computed: { score: { value: 10 } } });
        const productC = await Fake.generate(ProductModel, { title: "C", computed: { score: { value: 10 } } });

        const results = await search({ limit: 1, skip: 1 });

        expect(results).toHaveLength(1);
        expect(results[0]._id).not.toStrictEqual(productA._id);
        expect(results[0]._id).toStrictEqual(productB._id);
        expect(results[0]._id).not.toStrictEqual(productC._id);
    });
    test("it should find the products with the right engine version", async () => {
        const productA = await Fake.generate(ProductModel, {
            title: "A",
            computed: { engine: { max: "4.20", min: "4.10" } }
        });
        const productB = await Fake.generate(ProductModel, {
            title: "B",
            computed: { engine: { max: "4.15", min: "4.10" } }
        });
        await Fake.generate(ProductModel, {
            title: "C",
            computed: { engine: { max: "4.14", min: "4.10" } }
        });
        const productD = await Fake.generate(ProductModel, {
            title: "D",
            computed: { engine: { max: "4.25", min: "4.10" } }
        });
        const productE = await Fake.generate(ProductModel, {
            title: "E",
            computed: { engine: { max: "4.19", min: "4.17" } }
        });

        const results = await search({
            engine: { max: "4.20", min: "4.15" },
            sortDirection: ESortDirection.asc,
            sortField: ESortField.name
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
            computed: { engine: { max: "4.25", min: "4.20" } }
        });
        const productB = await Fake.generate(ProductModel, {
            title: "B",
            computed: { engine: { max: "4.30", min: "4.25" } }
        });
        const productC = await Fake.generate(ProductModel, {
            title: "C",
            computed: { engine: { max: "4.25", min: "4.25" } }
        });

        const results = await search({
            engine: { max: "4.25", min: "4.25" },
            sortDirection: ESortDirection.asc,
            sortField: ESortField.name
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
            price: { max: 1000, min: 500 },
            sortDirection: ESortDirection.asc,
            sortField: ESortField.name
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

        const results = await search({ searchText: "Electronic Nodes", sortField: ESortField.popularity });

        expect(results).toHaveLength(2);
        expect(results[0]._id).toStrictEqual(productB._id);
        expect(results[1]._id).toStrictEqual(productA._id);
    });
    test("it should select only discounted product", async () => {
        await Fake.generate(ProductModel, {
            discount: { value: 0 },
            price: { value: 1000 }
        });
        const discountedProduct = await Fake.generate(ProductModel, {
            discount: { value: 50 },
            price: { value: 2000 }
        });
        await Fake.generate(ProductModel, {
            discount: { value: 0 },
            price: { value: 0 }
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
