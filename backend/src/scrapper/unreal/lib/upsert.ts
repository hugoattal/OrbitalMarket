import Mongo from "@/database";
import UserModel from "@/modules/user/model";
import ProductModel, { IProduct } from "@/modules/product/model";
import { computeScore } from "@/modules/product/lib/score";

export async function owner(data: any): Promise<Mongo.Types.ObjectId> {
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

export async function product(data: IProduct): Promise<void> {
    if (!data.meta?.unrealId) {
        return;
    }

    const product = await ProductModel.findOne({
        meta: { unrealId: data.meta.unrealId }
    }).exec();

    if (!product) {
        await ProductModel.create(data);
    }
    else {
        data.computed.score = computeScore(data.ratings, data.releaseDate, data.price.value === 0, !!data.computed?.isBoosted, product.meta.verificationReviews);

        data.meta = { product.meta, ...data.meta };
        data.price.history = product.price.history || [];
        data.discount.history = product.discount.history || [];

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
