import mongoose from "mongoose";

export let db: mongoose.Connection;

export async function connectDatabase() {
    const options = { };
    await mongoose.connect(process.env.DB_URI as string, options);
    db = mongoose.connection;
}

export async function closeDatabase() {
    await mongoose.connection.close();
}
