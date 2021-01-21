import { connectDatabase, closeDatabase } from "../utils/connection";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import * as Migrate from "@/database/migration/utils/migrate";

const environment: string = process.env.NODE_ENV || "development";
export const isTestEnvironment = (environment === "test");

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    if (!isTestEnvironment) {
        throw new Error("You must be in test environment to execute the tests");
    }

    mongoServer = new MongoMemoryServer();
    process.env.DB_URI = await mongoServer.getUri();
    await connectDatabase();
});

beforeEach(async () => {
    await mongoose.connection.dropDatabase();
    await Migrate.migrateToLatest();
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await closeDatabase();
    await mongoServer.stop();
});
