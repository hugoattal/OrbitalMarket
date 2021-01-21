import DotEnv from "dotenv";

DotEnv.config();

import mongoose from "mongoose";

export { connectDatabase, closeDatabase, db } from "./utils/connection";

export default mongoose;
