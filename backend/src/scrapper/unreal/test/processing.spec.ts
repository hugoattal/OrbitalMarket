import "@/database/test";
import ProductModel from "@/modules/product/model";
import { processProductData } from "../lib/processing";
import { rawProduct } from "@/scrapper/unreal/test/product";

describe("scrapper/unreal", () => {
    test("it should compute the right engine versions", async () => {
        await processProductData(rawProduct);

        const product = await ProductModel.findOne();

        expect(product?.computed?.engine).toStrictEqual({ min: [4, 20], max: [4, 26] });
    });
    test("it should compute that it's a boosted product", async () => {
        await processProductData(rawProduct);

        const product = await ProductModel.findOne();

        expect(product?.computed?.isBoosted).toBeTruthy();
    });
});
