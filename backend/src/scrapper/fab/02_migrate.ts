import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import OldProductModel, { IProductDocument } from "@/modules/product/old-model";
import { makeRequest } from "@/scrapper/unreal/browser";
import * as ProductService from "@/modules/product/service";
import { ProductModel, TProductModel } from "@/modules/product/model";
import { computeScore, getIsBoosted } from "@/scrapper/fab/lib/score";
import { getEmbeddedContent } from "@/scrapper/fab/lib/embed";
import UserModel from "@/modules/user/model";

async function init() {
    await connectDatabase();

    let apiUrl = "https://www.fab.com/i/listings/search?channels=unreal-engine&currency=USD&cursor=cD0yMDIzLTAxLTE4VDIwJTNBMDAlM0EyNS4wNTUwMDBa&sort_by=createdAt";
    let data = await makeRequest(apiUrl);

    let count = 0;
    let previousCount = 0;

    while (data.results.length) {
        count += data.results.length;

        if (Math.floor(count / 250) > Math.floor(previousCount / 250)) {
            previousCount = count;
            console.log(`Count: ${ count } (url: ${ apiUrl })`);
        }

        await Promise.all(data.results.map(async (product) => {
            const existingOldProduct = await OldProductModel.findOne({
                "meta.fabId": product.uid
            });

            if (!existingOldProduct) {
                console.log(`Product not found: ${ product.title }`);
                //await ProductModel.create(addComputed(getProduct(product)));
                return;
            }

            const existingProduct = await ProductModel.findOne({
                "meta.fabId": product.uid
            });

            if (existingProduct) {
                console.log(`Product already exists: ${ product.title }`);
                return;
            }

            try {
                const newProduct = getProduct(product);
                const mergedProduct = mergeProduct(existingOldProduct, newProduct);

                await ProductModel.create(mergedProduct);
                await UserModel.updateOne({ _id: existingOldProduct.owner }, { $set: { "meta.fabId": product.user.uid } });

            }
            catch (error) {
                console.log(`Error with product: ${ product.title }`);
                console.error(error);
            }
        }));

        if (!data.next) {
            break;
        }

        apiUrl = data.next;
        data = await makeRequest(apiUrl);
    }

    console.log("Finished");

    await closeDatabase();
}

function getProduct(product: Record<string, unknown>): TProductModel {
    const price = Math.round(product.startingPrice.price * 100);

    return {
        title: product.title,
        category: product.listingType,
        dates: {
            lastPrecise: new Date(0),
            lastTouched: new Date(product.updatedAt)
        },
        description: {
            long: product.description,
            technical: product.assetFormats[0]?.technicalSpecs.technicalDetails
        },
        engine: getEngine(product),
        media: {
            images: [],
            thumbnail: product.thumbnails[0]?.mediaUrl
        },
        meta: {
            fabId: product.uid
        },
        price: {
            history: [
                {
                    date: new Date(product.publishedAt),
                    value: price
                }
            ],
            value: price
        },
        releaseDate: new Date(product.publishedAt),
        review: {
            count: product.reviewCount,
            rating: product.averageRating
        },
        slug: ProductService.utils.makeSlug(product.title),
        tags: product.tags.map((tag) => tag.slug)
    };
}

function getEngine(product: Record<string, unknown>) {
    const format = product.assetFormats.find((format) => format.assetFormatType.code === "unreal-engine");

    const versions = format.technicalSpecs.unrealEngineEngineVersions;

    versions.sort((a: string, b: string) => {
        const aVersion = a.split("_")[1].split(".").map(Number);
        const bVersion = b.split("_")[1].split(".").map(Number);

        if (aVersion[0] !== bVersion[0]) {
            return aVersion[0] - bVersion[0];
        }

        return aVersion[1] - bVersion[1];
    });

    return {
        max: getEngineString(versions[versions.length - 1]),
        min: getEngineString(versions[0])
    };

    function getEngineString(version: string) {
        const [major, minor] = version.split("_")[1].split(".");
        return `${ major }.${ minor.padStart(2, "0") }`;
    }
}

function addComputed(product: TProductModel) {
    const isBoosted = getIsBoosted(product.description.long);
    const score = computeScore(product.review.rating, product.review.count, new Date(product.releaseDate), product.price.value === 0, isBoosted);

    return {
        ...product,
        computed: {
            embeddedContent: getEmbeddedContent(product.description.long),
            isBoosted,
            score
        }
    };
}

function mergeProduct(oldProduct: IProductDocument, newProduct: TProductModel) {
    const price = oldProduct.price;

    if (newProduct.price.value !== price.value) {
        price.history.push({
            date: new Date(),
            value: newProduct.price.value
        });
        price.value = newProduct.price.value;
    }

    const mergedProduct = {
        ...newProduct,
        media: {
            ...newProduct.media,
            images: oldProduct.pictures.screenshot
        },
        meta: {
            ...newProduct.meta,
            unrealId: oldProduct.meta.unrealId
        },
        owner: oldProduct.owner,
        price,
        releaseDate: oldProduct.releaseDate
    };

    return addComputed(mergedProduct);
}

init().then(console.log).catch(console.error);
