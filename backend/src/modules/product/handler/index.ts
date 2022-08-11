import * as Fastify from "fastify";
import * as ProductService from "../service";
import { FastifyRequest } from "fastify";
import * as Schema from "./schema";

export default async function (server: Fastify.FastifyInstance): Promise<void> {
    server.get("/product/:id", { schema: Schema.GetById }, getByIdHandler);
    server.post("/search", { schema: Schema.Search }, searchHandler);
    server.post("/list", { schema: Schema.List }, listHandler);
}

async function getByIdHandler(request: FastifyRequest) {
    const id = (request.params as Record<string, string>).id;
    return ProductService.getById(id);
}

async function searchHandler(request: FastifyRequest) {
    const params = request.body as Schema.ISearch;
    return ProductService.search(params);
}

async function listHandler(request: FastifyRequest) {
    const ids = (request.body as Schema.IList).ids;
    return ProductService.listByIds(ids);
}
