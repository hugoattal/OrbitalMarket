import mongo from "@/database";

export interface IProduct extends mongo.Document {
    _id: string;
    name: string;
    price: number;
    description: string;
}

const productSchema: mongo.Schema = new mongo.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String }
});

export default mongo.model<IProduct>("product", productSchema);
