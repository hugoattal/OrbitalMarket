import puppeteer, { Page } from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { timeout } from "@/utils/lib";

let page: Page;

async function initBrowser() {
    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({});

    page = await browser.newPage();
}

async function isJsonResponse(response) {
    const contentType = response.headers()["content-type"];
    return contentType && contentType.includes("application/json");
}

export async function makeRequest(url: string) {
    if (!page) {
        await initBrowser();
    }

    let response = await page.goto(url);

    while (!isJsonResponse(response)) {
        await Promise.race([
            (async () => {
                await page.waitForNavigation({ waitUntil: "networkidle0" });
                response = await page.waitForResponse(isJsonResponse);
            })(),
            timeout(30 * 1000)
        ]);
    }

    try {
        return response.json();
    }
    catch {
        console.log(await response.text());
        throw new Error("Error parsing the response");
    }
}
