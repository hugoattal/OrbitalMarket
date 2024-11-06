import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import ProductModel from "../modules/product/old-model";
import mongoose from "mongoose";

async function init() {
    await connectDatabase();

    const products = await mongoose.connection.db.collection("products").find({ "computed.engine.min.0": { $exists: true } }).toArray();

    for (const product of products) {
        await ProductModel.updateOne({ _id: product._id }, {
            "computed.engine.max": `${ product.computed.engine.max[0] }.${ product.computed.engine.max[1].toString().padStart(2, "0") }`,
            "computed.engine.min": `${ product.computed.engine.min[0] }.${ product.computed.engine.min[1].toString().padStart(2, "0") }`
        });
    }

    await closeDatabase();
}

init().then();
