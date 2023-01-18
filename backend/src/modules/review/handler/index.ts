import * as Fastify from "fastify";
import * as ReviewService from "../service";
import { FastifyRequest } from "fastify";
import * as Schema from "./schema";
export default async function (server: Fastify.FastifyInstance): Promise<void> {
    server.get("/reviews/:id", { schema: Schema.List }, getByProductIdHandler);
}

async function getByProductIdHandler(request: FastifyRequest) {
    const id = (request.params as Record<string, string>).id;
    return ReviewService.getByProductId(id);
}
