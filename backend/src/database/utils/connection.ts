import mongoose from "mongoose";

mongoose.set("useUnifiedTopology", true);

export let db: mongoose.Connection;

export async function connectDatabase() {
    const options = { useNewUrlParser: true };
    await mongoose.connect(process.env.DB_URI as string, options);
    db = mongoose.connection;
}

export async function closeDatabase() {
    await mongoose.connection.close();
}
