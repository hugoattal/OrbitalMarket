import Mongo from "@/database";
import UserModel from "@/modules/user/model";
import ProductModel, { IProduct } from "@/modules/product/old-model";
import { computeScore } from "@/modules/product/lib/score";

export async function owner(data: any): Promise<Mongo.Types.ObjectId> {
    let owner = await UserModel.findOne({
        meta: { unrealId: data.owner }
    }).exec();

    if (!owner) {
        owner = await UserModel.create({
            name: data.name,
            meta: { unrealId: data.owner },
            networks: {
                facebook: data.facebook,
                twitter: data.twitter,
                website: data.website
            },
            publicMail: data.supportEmail
        });
    }

    return owner._id;
}

export async function product(data: IProduct): Promise<void> {
    if (!data.meta?.unrealId) {
        return;
    }

    const product = await ProductModel.findOne({ "meta.unrealId": data.meta.unrealId }).exec();

    if (!product) {
        await ProductModel.create(data);
    }
    else {
        data.computed.score = computeScore(
            data.ratings,
            data.releaseDate,
            data.price.value === 0,
            !!data.computed?.isBoosted,
            product.meta?.verificationRatio
        );

        data.meta = { ...product.meta, ...data.meta };
        data.price.history = product.price.history || [];
        data.discount.history = product.discount.history || [];

        if (data.price.value !== product.price.value) {
            data.price.history.push({
                date: new Date(),
                value: data.price.value
            });
        }

        if (data.discount.value !== product.discount.value) {
            data.discount.history.push({
                date: new Date(),
                value: data.discount.value
            });
        }

        await ProductModel.updateOne({ "meta.unrealId": data.meta.unrealId }, data).exec();
    }
}
