import puppeteer, { Page } from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { timeout } from "@/utils/lib";

let page: Page;

async function initBrowser() {
    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({});

    page = await browser.newPage();
}

export async function makeRequest(url: string) {
    if (!page) {
        await initBrowser();
    }

    const response = await page.goto(url);
    let json = "";

    let tryFetch = 5;

    while (tryFetch--) {
        try {
            json = await response.text();
            json = JSON.parse(json);
            tryFetch = 0;
            break;
        }
        catch (error) {
            console.log(error);
            console.log(json);
            await Promise.race([
                timeout(10 * 1000),
                page.waitForNavigation({ waitUntil: "networkidle0" })
            ]);
        }
    }

    return json;
}
