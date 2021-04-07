import "@/database/test";
import { getConversionRate } from "@/scrapper/unreal/api/index";


describe("scrapper/unreal/api", () => {
    test("it should get the conversion rate of USD to EUR", async () => {
        const conversionRate = await getConversionRate();

        expect(conversionRate).toBeGreaterThan(0.5);
        expect(conversionRate).toBeLessThan(1.5);
    });
});
