import { isValidObjectId } from "mongoose";
import { ProductModel } from "@/modules/product/model";
export { search } from "./search";
export * as utils from "./utils";

export async function getById(id: string) {
    if (isValidObjectId(id)) {
        const product = await ProductModel.findById(id).populate("owner");
        if (product) {
            return product;
        }
    }

    if (isFabId(id)) {
        return ProductModel.findOne({ "meta.fabId": id }).populate("owner").exec();
    }

    return ProductModel.findOne({ slug: id }).populate("owner").exec();
}

export async function listByIds(ids: Array<string>) {
    const validIds = ids.filter(id => isValidObjectId(id));

    return ProductModel.find({
        $or: [
            { "_id": { $in: validIds } },
            { "meta.unrealId": { $in: ids } },
            { "meta.fabId": { $in: ids } },
            { "title": { $in: ids } }
        ]
    }).populate("owner").exec();
}

function isFabId(id: string) {
    return id.length === 36 && id[8] === "-";
}
