import "module-alias/register";
import { makeRequest } from "@/scrapper/unreal/browser";
import * as ProductService from "@/modules/product/service";
import { ProductModel, TProductModel } from "@/modules/product/model";
import { computeScore, getIsBoosted } from "@/scrapper/fab/lib/score";
import { getEmbeddedContent } from "@/scrapper/fab/lib/embed";
import UserModel from "@/modules/user/model";
import { updateFabPreciseProduct } from "@/scrapper/fab/lib/precise";
import { getSavedState, setSavedState } from "@/scrapper/unreal/lib/state";

export async function updateFabProducts() {
    let maxBatches = 8;

    const startingDate = await getSavedState("product-date", new Date(0));
    const filterString = new Date(startingDate).toISOString().split("T")[0];

    let apiUrl = `https://www.fab.com/i/listings/search?channels=unreal-engine&currency=USD&sort_by=firstPublishedAt&published_since=${ filterString }`;
    let data = await makeRequest(apiUrl);

    let count = 0;
    let previousCount = 0;

    while (data.results?.length) {
        count += data.results.length;

        if (Math.floor(count / 250) > Math.floor(previousCount / 250)) {
            previousCount = count;
            console.log(`Count: ${ count } (url: ${ apiUrl })`);
        }

        await Promise.all(data.results.map(async (product) => {
            try {
                const existingProduct = await ProductModel.findOne({
                    "meta.fabId": product.uid
                }).lean();

                if (existingProduct) {
                    const newProduct = getProduct(product);
                    const mergedProduct = mergeProduct(existingProduct, newProduct);

                    await ProductModel.updateOne({ "meta.fabId": product.uid }, addComputed(mergedProduct)).exec();

                    await UserModel.updateOne({ id: existingProduct.owner }, {
                        name: product.user.sellerName,
                        "meta.fabId": product.user.uid
                    }).exec();
                    return;
                }

                let owner = await UserModel.findOne({
                    "meta.fabId": product.user.uid
                });

                if (!owner) {
                    owner = await UserModel.create({
                        name: product.user.sellerName,
                        meta: {
                            fabId: product.user.uid
                        }
                    });
                }

                const newProduct = getProduct(product);
                newProduct.owner = owner._id;

                let outProduct = await ProductModel.create(newProduct);
                outProduct = addComputed(outProduct);
                await updateFabPreciseProduct(outProduct);

                console.log(`_Created ${ outProduct.title }`);
            }
            catch (e) {
                console.log(`Product error: ${ product.title } (${ product.uid })`);
                console.log(`_Error: ${ e.message }`);
            }

        }));

        if (!data.next) {
            const lastPublishing = data.results.at(-1).publishedAt.split("T")[0];

            if (new Date().getTime() - new Date(lastPublishing).getTime() < 7 * 24 * 60 * 60 * 1000) {
                await setSavedState("product-date", new Date(0));
                console.log("End of updates");
                break;
            }

            const previousDay = new Date(lastPublishing).setDate(new Date(lastPublishing).getDate() - 1); //remove 1 day
            const filterString = new Date(previousDay).toISOString().split("T")[0];

            apiUrl = `https://www.fab.com/i/listings/search?channels=unreal-engine&currency=USD&sort_by=firstPublishedAt&published_since=${ filterString }`;

            data = await makeRequest(apiUrl);

            if (!data.next) {
                console.log(data);
                console.log("No next", apiUrl);
                await setSavedState("product-date", new Date(0));
                break;
            }

            await setSavedState("product-date", new Date(previousDay));

            if (!maxBatches--) {
                console.log("Stop batches");
                break;
            }

            continue;
        }

        apiUrl = data.next;
        data = await makeRequest(apiUrl);
    }

    console.log("Finished");
}

function getProduct(product: Record<string, unknown>): TProductModel {
    const price = Math.round(product.startingPrice.price / (1 + (product.startingPrice.vatPercentage || 0) / 100) * 100);

    return {
        title: product.title,
        category: product.listingType,
        dates: {
            lastPrecise: new Date(0),
            lastTouched: new Date()
        },
        description: {
            technical: product.assetFormats[0]?.technicalSpecs.technicalDetails
        },
        discount: product.startingPrice.discountSettings?.discountPercentage || 0,
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
    const format = product.assetFormats.find((format) => ["unreal-engine", "metahuman"].includes(format.assetFormatType.code));

    const versions = format.technicalSpecs.unrealEngineEngineVersions || format.technicalSpecs.metahumanEngineVersions;

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

    product.computed = {
        embeddedContent: getEmbeddedContent(product.description.long),
        isBoosted,
        score
    };

    return product;
}

function mergeProduct(oldProduct: TProductModel, newProduct: TProductModel) {
    const price = oldProduct.price;

    if (newProduct.price.value !== price.value) {
        price.history.push({
            date: new Date(),
            value: newProduct.price.value
        });
        price.value = newProduct.price.value;
    }

    const mergedProduct = {
        ...oldProduct,
        title: newProduct.title,
        category: newProduct.category,
        dates: {
            ...oldProduct.dates,
            lastTouched: newProduct.dates.lastTouched
        },
        description: {
            ...oldProduct.description,
            technical: newProduct.description.technical
        },
        discount: newProduct.discount ?? 0,
        engine: newProduct.engine,
        media: {
            ...oldProduct.media,
            thumbnail: newProduct.media.thumbnail
        },
        price,
        review: newProduct.review,
        tags: newProduct.tags
    };

    return mergedProduct;
}
