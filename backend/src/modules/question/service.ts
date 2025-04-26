import QuestionModel from "./model";
import { NotFound } from "http-errors";
import { getById } from "@/modules/product/service";

export async function getByProductId(id: string) {
    const owningProduct = await getById(id);

    if (!owningProduct) {
        throw new NotFound("Unable to find owning product");
    }

    const unrealId = owningProduct.meta?.unrealId;
    return QuestionModel.find({ "meta.target": unrealId }).sort({ date: -1 }).exec();
}
