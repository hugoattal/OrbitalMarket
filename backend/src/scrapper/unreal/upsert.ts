import Mongo from "@/database";
import UserModel from "@/modules/user/model";
import ProductModel, { IProduct } from "@/modules/product/model";

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

export async function product(data: IProduct) {
    const product: IProduct = await ProductModel.findOne({
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
