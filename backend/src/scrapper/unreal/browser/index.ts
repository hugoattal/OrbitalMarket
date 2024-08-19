import puppeteer, { Page } from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

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

    json = await response.text();
    json = JSON.parse(json);

    return json;
}
