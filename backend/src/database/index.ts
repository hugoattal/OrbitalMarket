import DotEnv from "dotenv";

DotEnv.config();

import mongoose from "mongoose";
export default mongoose;

mongoose.set('useCreateIndex', true);

export { connectDatabase, closeDatabase, db } from "./utils/connection";
