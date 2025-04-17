import puppeteer, { Page } from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Mutex } from "async-mutex";

let page: Page;
export const navigationMutex = new Mutex();

async function initBrowser() {
    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({});

    page = await browser.newPage();
}

export async function makeRequest(url: string): Promise<unknown> {
    const mutexRelease = await navigationMutex.acquire();

    try {
        if (!page) {
            await initBrowser();
        }

        const response = await page.goto(url);
        let json = "";

        json = await response.text();
        json = JSON.parse(json);

        return json;
    }
    catch (error) {
        console.error(`Error making request to ${ url }:`, error);
        throw error;
    }
    finally {
        mutexRelease();
    }
}

export async function getRedirect(url: string): Promise<string> {
    if (!page) {
        await initBrowser();
    }

    await page.goto(url);

    return page.url();
}
