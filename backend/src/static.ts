import * as Fastify from "fastify";
import FastifyStatic from "fastify-static";
import * as path from "path";

export default async function (server: Fastify.FastifyInstance): Promise<void> {
    await server.register(FastifyStatic, { root: path.join(__dirname, "../../frontend/dist") });
}
