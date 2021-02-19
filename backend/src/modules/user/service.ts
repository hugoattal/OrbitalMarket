import UserModel, { IUser } from "./model";
import Mongo from "@/database";

export async function getById(id: string | Mongo.Types.ObjectId): Promise<IUser|null> {
    return UserModel.findById(id);
}
