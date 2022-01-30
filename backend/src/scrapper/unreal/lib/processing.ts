import * as Upsert from "@/scrapper/unreal/lib/upsert";
import { IProduct } from "@/modules/product/model";
import * as ProductService from "@/modules/product/service";
import { computeScore } from "@/modules/product/lib/score";
import _ from "lodash";
import { getConversionRate } from "@/scrapper/unreal/api";

export let conversionRate = 1.0;

export async function updateConversionRate(): Promise<void> {
    conversionRate = await getConversionRate();
}

export async function processProductData(data: any): Promise<void> {
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
        releases: data.releaseInfo.map((release: { platform: string, compatibleApps: string, dateAdded: string }) => {
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

    addComputed(product, data);

    await Upsert.product(product);
}

function convertEURtoUSD(priceInEuro: number): number {
    if (priceInEuro === 0) {
        return 0;
    }
    return Math.round(priceInEuro * conversionRate / 100) * 100 - 1;
}

function addComputed(product: IProduct, data: any) {
    const isBoosted = getIsBoosted();
    const score = computeScore(product.ratings, product.releaseDate, product.price.value === 0);
    const embeddedContent = getEmbeddedContent();

    if (isBoosted) {
        score.value *= 1.2;
    }

    const engine = {} as any;

    if (data.compatibleApps.length > 0) {
        engine.min = (_.first(data.compatibleApps) as string).split(".").map(element => parseInt(element));
        engine.max = (_.last(data.compatibleApps) as string).split(".").map(element => parseInt(element));
    }

    product.computed = {
        isBoosted,
        score,
        engine,
        embeddedContent
    };

    function getIsBoosted(): boolean {
        const orbitalString = "<a href=\"https://orbital-market.com/";
        return product.description.long.indexOf(orbitalString) >= 0;
    }

    function getEmbeddedContent(): Array<string> {
        const matches = product.description.long.matchAll(/href="(.+?)"/g);
        return [...matches]
            .map((match) => {
                const url = match[1].replace("&#61;", "=");

                if (url.includes("youtube.com/watch")) {
                    const match = url.match(/v=([a-zA-Z0-9]+)/);
                    if (match) {
                        return "youtubeVideo:" + match[1];
                    }
                }

                if (url.includes("youtube.com/playlist")) {
                    const match = url.match(/list=([a-zA-Z0-9]+)/);
                    if (match) {
                        return "youtubePlaylist:" + match[1];
                    }
                }

                if (url.includes("sketchfab.com/models/")) {
                    const match = url.match(/models\/([a-zA-Z0-9]+)/);
                    if (match) {
                        return "sketchfab:" + match[1];
                    }
                }

                return "";
            }
            )
            .filter((url) => !!url);
    }
}
