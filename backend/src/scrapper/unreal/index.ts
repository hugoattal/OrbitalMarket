import "module-alias/register";
import { connectDatabase, closeDatabase } from "@/database";
import * as UnrealAPI from "./api";
import * as ProductService from "@/modules/product/service";
import { IProduct } from "@/modules/product/model";
import { computeScore } from "@/modules/product/lib/score";
import * as Upsert from "./upsert";

async function init() {
    await connectDatabase();
    await loadProducts();
    await closeDatabase();
}

init().then();

async function loadProducts() {
    const productsCount = await UnrealAPI.getProductsCount();
    const step = 100;

    for (let startProduct = 0; startProduct < productsCount; startProduct += step) {
        console.log(startProduct + " / " + productsCount);
        const productPage = await UnrealAPI.getProductPage(startProduct, 100);

        for (const element of productPage.elements) {
            await processProductData(element);
        }
    }
}

async function processProductData(data: any) {

    const ownerId = await Upsert.owner(data.seller);

    data.discountPercentage = data.discountPercentage || 0;
    if (!data.categories || data.categories.length === 0) {
        data.categories = [{ path: "unknown" }];
    }

    const price = convertEURtoUSD(data.priceValue);

    const product: IProduct = {
        title: data.title,
        slug: data.urlSlug || ProductService.utils.makeSlug(data.title),
        owner: ownerId,
        price: {
            value: price,
            history: [
                {
                    value: price,
                    date: new Date(data.effectiveDate)
                }
            ]
        },
        discount: {
            value: (100 - data.discountPercentage),
            history: [
                {
                    value: (100 - data.discountPercentage),
                    date: new Date(data.effectiveDate)
                }
            ]
        },
        ratings: [
            data.rating?.rating1 || 0,
            data.rating?.rating2 || 0,
            data.rating?.rating3 || 0,
            data.rating?.rating4 || 0,
            data.rating?.rating5 || 0
        ],
        releaseDate: new Date(data.effectiveDate),
        description: {
            short: data.description,
            long: data.longDescription,
            technical: data.technicalDetails
        },
        pictures: data.keyImages.reduce((object: Record<string, Array<string>>, element: { type: string, url: string }) => {
            element.type = element.type.toLowerCase();
            if (!object[element.type]) {
                object[element.type] = [];
            }
            object[element.type].push(element.url);
            return object;
        }, {}),
        category: {
            main: "unreal",
            path: data.categories[0].path.split("/")
        },
        releases: data.releaseInfo.map((release: any) => {
            return {
                platforms: release.platform,
                apps: release.compatibleApps,
                updateDate: new Date(release.dateAdded)
            };
        }),
        tags: [], //TODO: Tags
        meta: {
            unrealId: data.id
        }
    };

    addComputed(product);

    await Upsert.product(product);
}

function convertEURtoUSD(priceInEuro: number): number {
    return Math.ceil(priceInEuro * 1.008) - 1;
}

function addComputed(product: IProduct) {
    const isBoosted = getIsBoosted();
    const score = computeScore(product.ratings, product.releaseDate, product.price.value === 0);

    if (isBoosted) {
        score.value *= 1.1;
    }

    product.computed = {
        isBoosted,
        score,
        lastUpdate: getLastUpdate(product.releases)
    };

    function getLastUpdate(releases: Array<{ updateDate: Date }>): Date {
        return new Date(Math.max(...releases.map((release) => release.updateDate.getTime())));
    }

    function getIsBoosted(): boolean {
        const orbitalString = "<a href=\"https://orbital-market.com/";
        return product.description.long.indexOf(orbitalString) >= 0;
    }
}
