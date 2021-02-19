import * as Fastify from "fastify";
import ProductHandler from "@/modules/product/handler";

export default async function (server: Fastify.FastifyInstance): Promise<void> {
    await server.register(ProductHandler, { prefix: "/products" });
}
