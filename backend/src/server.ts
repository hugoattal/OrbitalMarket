import "module-alias/register";
import { connectDatabase } from "@/database";
import * as Fastify from "fastify";
import cors from "cors";
import Middie from "middie";

import ProductHandler from "@/modules/product/handler";

async function init() {
    const isDevelopment = (process.env.NODE_ENV === "development");

    const server: Fastify.FastifyInstance = Fastify.fastify({ logger: isDevelopment });

    await server.register(Middie);
    server.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }));

    await connectDatabase();

    server.register(ProductHandler, { prefix: "/products" });

    return server;
}

init().then((server) => {
    server.listen(Number(process.env.BACKEND_PORT), (error: Error) => {
        if (error) {
            server.log.error({ error });
            process.exit(1);
        }
    });
});
