import "@/database/test";
import * as Fake from "@/database/test/fake";
import ProductModel from "@/modules/product/model";

describe("database/test/fake", () => {
    test("it should generate a fake product", async () => {
        const product = await Fake.generate(ProductModel);

        const foundProduct = await ProductModel.findOne();

        expect(product._id).toStrictEqual(foundProduct?._id);
        expect(product.title).toBe(foundProduct?.title);
    });
});
