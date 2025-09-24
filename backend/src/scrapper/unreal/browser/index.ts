import { Browser, chromium, Page } from "playwright";
import { Mutex } from "async-mutex";

let page: Page;
let browser: Browser;
export const navigationMutex = new Mutex();

async function initBrowser() {
    browser = await chromium.launch({
        headless: true
    });
    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    });
    page = await context.newPage();
}

export async function makeRequest(url: string): Promise<unknown> {
    const mutexRelease = await navigationMutex.acquire();

    try {
        if (!page) {
            await initBrowser();
        }

        const response = await page.goto(url);
        if (!response) {
            throw new Error(`Failed to get response from ${ url }`);
        }

        const text = await response.text();
        const json = JSON.parse(text);

        return json;
    }
    catch (error) {
        console.error(`Error making request to ${ url }:`, error);
        await page?.close();
        await browser?.close();
        page = null;
        browser = null;
        throw error;
    }
    finally {
        mutexRelease();
    }
}

export async function getRedirect(url: string): Promise<string> {
    const mutexRelease = await navigationMutex.acquire();

    try {
        if (!page) {
            await initBrowser();
        }

        await page.goto(url);

        return page.url();
    }
    catch (error) {
        console.error(`Error getting redirect from ${ url }:`, error);
        if (page) {
            await page.close();
        }
        if (browser) {
            await browser.close();
        }
        page = null;
        browser = null;
        throw error;
    }
    finally {
        mutexRelease();
    }
}

export async function resetBrowser() {
    if (page) {
        await page.close();
    }
    if (browser) {
        await browser.close();
    }
}
