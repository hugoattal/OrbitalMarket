import QuestionModel from "./model";
import { NotFound } from "http-errors";
import { isValidObjectId } from "mongoose";
import { ProductModel } from "@/modules/product/model";

export async function getByProductId(id: string) {
    const owningProduct = isValidObjectId(id) ? await ProductModel.findById(id).exec() : await ProductModel.findOne({ slug: id }).exec();

    if (!owningProduct) {
        throw new NotFound("Unable to find owning product");
    }

    const unrealId = owningProduct.meta?.unrealId;
    return QuestionModel.find({ "meta.target": unrealId }).sort({ date: -1 }).exec();
}
