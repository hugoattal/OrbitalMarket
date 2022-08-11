import "module-alias/register";
import { connectDatabase } from "@/database";
import * as Fastify from "fastify";
import cors from "cors";
import fastifyMiddie from "@fastify/middie";

import * as Crons from "@/crons";

import StaticHandler from "@/static";
import APIHandler from "@/api";
import PageHandler from "@/page";
import NotFoundHandler from "@/notFound";

const environment: string = process.env.NODE_ENV || "development";
const isDevEnvironment = (environment === "development");

async function init() {
    await connectDatabase();

    Crons.register();

    const server: Fastify.FastifyInstance = Fastify.fastify({ logger: isDevEnvironment });

    await server.register(fastifyMiddie);

    server.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }));

    await server.register(APIHandler, { prefix: "/api" });
    await server.register(StaticHandler, { prefix: "/static" });
    await server.register(PageHandler);
    await server.register(NotFoundHandler);

    return server;
}

init().then((server) => {
    server.listen({ port: Number(process.env.BACKEND_PORT) }, (error: Error | null) => {
        server.ready(() => {
            if (isDevEnvironment) {
                console.log(server.printRoutes());
            }
            console.log("Server ready");
        });

        if (error) {
            server.log.error({ error });
            process.exit(1);
        }
    });
});
