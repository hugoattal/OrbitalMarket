import Mongo from "@/database";

export interface IUser {
    name: string;
    publicMail?: string;
    networks: Record<string, string>;
    meta: Record<string, any>;
}

interface IUserDocument extends IUser, Mongo.Document {
}

const userSchema: Mongo.Schema = new Mongo.Schema({
    name: {
        type: String,
        required: true
    },
    publicMail: {
        type: String
    },
    networks: {
        website: String,
        facebook: String,
        twitter: String
    },
    meta: Object
});

export default Mongo.model<IUserDocument>("user", userSchema);
