import "module-alias/register";
import Mongo, { connectDatabase, closeDatabase } from "@/database";
import * as UnrealAPI from "./api";
import * as ProductService from "@/modules/product/service";
import UserModel from "@/modules/user/model";
import ProductModel, { IProduct } from "@/modules/product/model";

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

    const ownerId = await upsertOwner(data.seller);

    data.discountPercentage = data.discountPercentage || 0;

    const product: IProduct = {
        title: data.title,
        slug: data.urlSlug || ProductService.utils.makeSlug(data.title),
        owner: ownerId,
        price: {
            value: data.priceValue,
            history: [
                {
                    value: data.priceValue,
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
        pictures: data.keyImages.map((picture: any) => {
            return {
                style: picture.type,
                url: picture.url
            };
        }),
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

    await upsertProduct(product);
}

async function upsertOwner(data: any): Promise<Mongo.Types.ObjectId> {
    let owner = await UserModel.findOne({
        meta: { unrealId: data.owner }
    }).exec();

    if (!owner) {
        owner = await UserModel.create({
            name: data.name,
            publicMail: data.supportEmail,
            networks: {
                website: data.website,
                facebook: data.facebook,
                twitter: data.twitter
            },
            meta: { unrealId: data.owner }
        });
    }

    return owner._id;
}

async function upsertProduct(data: IProduct) {
    let product: IProduct = await ProductModel.findOne({
        meta: { unrealId: data.meta.unrealId }
    }).exec();

    if (!product) {
        await ProductModel.create(data);
    }
    else {
        data.price.history = product.price.history || [];
        data.discount.history = product.price.history || [];

        if (data.price.value !== product.price.value) {
            data.price.history.push({
                value: data.price.value,
                date: new Date()
            });
        }

        if (data.discount.value !== product.discount.value) {
            data.discount.history.push({
                value: data.discount.value,
                date: new Date()
            });
        }

        await ProductModel.updateOne(
            { meta: { unrealId: data.meta.unrealId } }, data
        ).exec();
    }
}
