import * as Fastify from "fastify";
import * as path from "path";
import * as fs from "fs";
import * as ProductService from "@/modules/product/service";
import * as UserService from "@/modules/user/service";
import { NotFound } from "http-errors";
import _ from "lodash";

const pageTemplate = fs.readFileSync(path.join(__dirname, "../../frontend/dist/index.html"));

export default async function (server: Fastify.FastifyInstance): Promise<void> {
    server.get("*", async (request, reply) => {
        const generatedPage = await generateSSRPage(pageTemplate.toString(), request.url);

        reply.type("text/html").send(generatedPage);
    });
}

async function generateSSRPage(template: string, url: string): Promise<string> {
    const path = url.split("/");
    const isProduct = (path[1] === "product");

    if (isProduct) {
        const slug = path[2];
        const product = await ProductService.getById(slug);
        if (!product) {
            throw new NotFound();
        }
        const owner = await UserService.getById(product.owner);

        template = template
            .replace("{ssr-og}", "og: https://ogp.me/ns/article#")
            .replace("{ssr-title}", product.title);

        let SSRHead = `
    <meta name="description" content="${product.description.short}">
    <meta property="og:title" content="${product.title}"/>
    <meta property="og:site_name" content="Orbital Market"/>
    <meta property="og:url" content="https://orbital-market.com/"/>
    <meta property="og:description" content="${product.description.short}"/>
    <meta property="og:type" content="article"/>
    <meta property="article:published_time" content="${product.releaseDate}"/>
    <meta property="article:author" content="${owner?.name}"/>
    <meta property="og:image" content="${product.pictures.thumbnail[0]}"/>
    <meta property="og:image:width" content="284"/>
    <meta property="og:image:height" content="284"/>
    <meta name="twitter:card" content="summary">`;

        if (owner?.networks?.twitter) {
            const twitterUserName = "@" + _.last(owner.networks.twitter.split("/"));
            SSRHead += `
    <meta name="twitter:creator" content="${twitterUserName}">`;
        }

        template = template.replace("<!--{ssr-head}-->", SSRHead);
    }
    else {
        template = template
            .replace("{ssr-og}", "og: https://ogp.me/ns/website#")
            .replace("{ssr-title}", "Orbital Market");

        const SSRHead = `
    <meta name="description" content="Enhanced marketplace platform for the Unreal Engine marketplace.">
    <meta property="og:title" content="Orbital Market"/>
    <meta property="og:site_name" content="Orbital Market"/>
    <meta property="og:url" content="https://orbital-market.com/"/>
    <meta property="og:description" content="Enhanced marketplace platform for the Unreal Engine marketplace."/>
    <meta property="og:type" content="website"/>
    <meta property="og:image" content="https://orbital-market.com/static/opengraph.png"/>
    <meta property="og:image:width" content="64"/>
    <meta property="og:image:height" content="64"/>
    <meta name="twitter:card" content="summary">
    <meta name="twitter:creator" content="@hugoattal">`;
        template = template.replace("<!--{ssr-head}-->", SSRHead);
    }

    return template;
}
