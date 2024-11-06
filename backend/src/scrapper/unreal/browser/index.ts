import puppeteer, { Page } from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

let page: Page;

async function initBrowser() {
    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({});

    page = await browser.newPage();
}

export async function makeRequest(url: string): Promise<unknown> {
    if (!page) {
        await initBrowser();
    }

    const response = await page.goto(url);
    let json = "";

    json = await response.text();
    json = JSON.parse(json);

    return json;
}

export async function getRedirect(url: string): Promise<string> {
    if (!page) {
        await initBrowser();
    }

    await page.goto(url);

    return page.url();
}
