import mongo from "@/database";

export interface IConfig extends mongo.Document {
    name: string;
    data: object;
}

const configSchema: mongo.Schema = new mongo.Schema({
    name: { type: String, required: true },
    data: { type: Object }
});

export default mongo.model<IConfig>("config", configSchema);
