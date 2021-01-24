import "@/database/test";
import * as Fake from "@/database/test/fake";
import ProductModel from "@/modules/product/model";
import * as Score from "./score";
import { addDays } from "date-fns";

describe("product/lib/score", () => {
    test("it should generate a better score when there's more stars", async () => {
        let goodProduct = await Fake.generate(ProductModel, {
            ratings: [0, 0, 2, 5, 12],
            releaseDate: new Date()
        });
        let badProduct = await Fake.generate(ProductModel, {
            ratings: [5, 9, 1, 0, 0],
            releaseDate: new Date()
        });

        await Score.updateScores();

        goodProduct = await ProductModel.findById(goodProduct._id);
        badProduct = await ProductModel.findById(badProduct._id);

        expect(goodProduct.computed.score.value).toBeGreaterThan(badProduct.computed.score.value);
    });
    test("it should generate a better score when the product is more recent", async () => {
        let recentProduct = await Fake.generate(ProductModel, {
            ratings: [0, 0, 2, 5, 12],
            price: { value: 10 },
            releaseDate: new Date()
        });
        let oldProduct = await Fake.generate(ProductModel, {
            ratings: [0, 0, 2, 5, 12],
            price: { value: 10 },
            releaseDate: addDays(new Date(), -20)
        });

        await Score.updateScores();

        recentProduct = await ProductModel.findById(recentProduct._id);
        oldProduct = await ProductModel.findById(oldProduct._id);

        expect(recentProduct.computed.score.value).toBeGreaterThan(oldProduct.computed.score.value);
    });
});
