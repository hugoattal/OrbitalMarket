import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import UserModel from "@/modules/user/model";
import { ProductModel } from "@/modules/product/model";

async function init() {
    await connectDatabase();


    const oldUsers = await UserModel.find({ "meta.fabId": { $exists: false } }).lean();

    for (const user of oldUsers) {
        const foundUser = await UserModel.findOne({ name: user.name, "meta.unrealId": { $exists: false } });
        if (foundUser) {
            console.log(`Merging user ${ user.name }`);

            await UserModel.updateOne({ _id: user._id }, { "meta.fabId": foundUser.meta.fabId }).exec();
            await ProductModel.updateMany({ owner: foundUser._id }, { owner: user._id }).exec();
            await UserModel.deleteOne({ _id: foundUser._id }).exec();
        }
    }

    await closeDatabase();
}


init().then(() => console.log("Done")).catch(console.error);
