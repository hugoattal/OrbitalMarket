import DotEnv from "dotenv";

DotEnv.config();

import mongoose from "mongoose";
export default mongoose;

export { connectDatabase, closeDatabase, db } from "./utils/connection";
