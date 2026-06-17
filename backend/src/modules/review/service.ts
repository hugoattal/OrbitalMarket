import { httpError } from "@luna-park/http-errors";

import { getById } from "@/modules/product/service";

import ReviewModel from "./model";

export async function getByProductId(id: string) {
    const owningProduct = await getById(id);

    if (!owningProduct) {
        throw httpError.NotFound("Unable to find owning product");
    }

    const unrealId = owningProduct.meta?.unrealId;
    return ReviewModel.find({ "meta.target": unrealId }).sort({ date: -1 }).exec();
}
