import * as Fastify from "fastify";
import * as ProductService from "./service";
import { FastifyRequest } from "fastify";
import * as Schema from "./schema";

export default async function (server: Fastify.FastifyInstance) {
    server.get("/search", { schema: Schema.Search }, searchHandler);
}

async function searchHandler(request: FastifyRequest) {
    const params = request.query as Schema.ISearch;
    return ProductService.search(params);
}
