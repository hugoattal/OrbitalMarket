import "module-alias/register";
import { connectDatabase } from "@/database";
import * as Fastify from "fastify";
import FastifyStatic from "fastify-static";
import cors from "cors";
import Middie from "middie";

import ProductHandler from "@/modules/product/handler";
import * as path from "path";

async function init() {
    const isDevelopment = (process.env.NODE_ENV === "development");

    const server: Fastify.FastifyInstance = Fastify.fastify({ logger: isDevelopment });

    await server.register(Middie);
    server.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }));

    await connectDatabase();

    server.register(FastifyStatic, {
        root: path.join(__dirname, "../../frontend/dist")
    });

    server.setNotFoundHandler((_req, res) => {
        res.sendFile("index.html");
    });

    server.register(ProductHandler, { prefix: "/api/products" });

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
