import Mongo from "@/database";

export interface IConfig {
    name: string;
    data: any;
}

interface IConfigDocument extends IConfig, Mongo.Document {
}

const configSchema: Mongo.Schema = new Mongo.Schema({
    name: { type: String, required: true },
    data: { type: Object }
});

export default Mongo.model<IConfigDocument>("config", configSchema);
