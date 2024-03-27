import "@/database/test";
import { makeRequest } from "@/scrapper/unreal/browser/index";

describe("scrapper/unreal/browser", () => {
    test("it should get the json", async () => {
        const result = await makeRequest("https://www.unrealengine.com/marketplace/api/assets");
        console.log(result);
        expect(result).toBeDefined();
    });
});
