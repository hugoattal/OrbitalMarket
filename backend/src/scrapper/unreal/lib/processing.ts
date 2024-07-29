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
        description: {
            long: data.longDescription,
            short: data.description,
            technical: data.technicalDetails
        },
        category: {
            main: "unreal",
            path: data.categories[0].path.split("/")
        },
        discount: {
            history: [
                {
                    date: new Date(data.effectiveDate),
                    value: (100 - data.discountPercentage)
                }
            ],
            value: (100 - data.discountPercentage)
        },
        owner: ownerId,
        lastUpdate: new Date(),
        price: {
            history: [
                {
                    date: new Date(data.effectiveDate),
                    value: price
                }
            ],
            value: price
        },
        slug: data.urlSlug || ProductService.utils.makeSlug(data.title),
        meta: {
            unrealId: data.id
        },
        pictures: data.keyImages.reduce((object: Record<string, Array<string>>, element: { type: string; url: string }) => {
            element.type = element.type.toLowerCase();
            if (!object[element.type]) {
                object[element.type] = [];
            }
            object[element.type].push(element.url);
            return object;
        }, {}),
        ratings: [
            data.rating?.rating1 || 0,
            data.rating?.rating2 || 0,
            data.rating?.rating3 || 0,
            data.rating?.rating4 || 0,
            data.rating?.rating5 || 0
        ],
        releaseDate: new Date(data.effectiveDate),
        releases: data.releaseInfo.map((release: { compatibleApps: string; dateAdded: string; platform: string }) => {
            return {
                apps: release.compatibleApps,
                platforms: release.platform,
                ...(release.dateAdded && { updateDate: new Date(release.dateAdded) })
            };
        }),
        tags: [] //TODO: Tags
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
    const score = computeScore(
        product.ratings,
        product.releaseDate,
        product.price.value === 0,
        isBoosted,
        product.meta?.verificationRatio
    );
    const embeddedContent = getEmbeddedContent();

    const engine = {} as any;

    if (data.compatibleApps.length > 0) {
        engine.min = sanitizeEngineVersion(_.first(data.compatibleApps) as string);
        engine.max = sanitizeEngineVersion(_.last(data.compatibleApps) as string);
    }

    product.computed = {
        embeddedContent,
        engine,
        isBoosted,
        score
    };

    function sanitizeEngineVersion(value: string) {
        const engineVersion = value.split(".")
            .map(element => parseInt(element).toString());
        engineVersion[1] = engineVersion[1].padStart(2, "0");
        return engineVersion.join(".");
    }

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
                    const match = url.match(/v=([a-zA-Z0-9_-]+)/);
                    if (match) {
                        return `youtubeVideo:${ match[1] }`;
                    }
                }

                if (url.includes("youtu.be/")) {
                    const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
                    if (match) {
                        return `youtubeVideo:${ match[1] }`;
                    }
                }

                if (url.includes("youtube.com/playlist")) {
                    const match = url.match(/list=([a-zA-Z0-9_-]+)/);
                    if (match) {
                        return `youtubePlaylist:${ match[1] }`;
                    }
                }

                if (url.includes("sketchfab.com/models/")) {
                    const match = url.match(/models\/([a-zA-Z0-9_-]+)/);
                    if (match) {
                        return `sketchfab:${ match[1] }`;
                    }
                }

                return "";
            }
            )
            .filter((url) => !!url);
    }
}
