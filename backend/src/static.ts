import url from "node:url";

import FastifyStatic from "@fastify/static";
import type * as Fastify from "fastify";
import * as path from "path";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (server: Fastify.FastifyInstance): Promise<void> {
    await server.register(FastifyStatic, {
        maxAge: 31536000000,
        root: path.join(__dirname, "../../frontend/dist")
    });
}
