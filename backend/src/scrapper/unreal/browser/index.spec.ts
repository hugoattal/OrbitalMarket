import "@/database/test";
import { makeRequest } from "@/scrapper/unreal/browser/index";

describe("scrapper/unreal/browser", () => {
    test("it should get the json", async () => {
        const result = await makeRequest("https://marketplace-website-node-launcher-prod.ol.epicgames.com/ue/marketplace/api/assets");
        console.log(result);
        expect(result).toBeDefined();
    });
});
