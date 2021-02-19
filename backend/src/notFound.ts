import * as Fastify from "fastify";
import fs from "fs";
import path from "path";

const pageTemplate = fs.readFileSync(path.join(__dirname, "../../frontend/dist/index.html")).toString();

export default async function (server: Fastify.FastifyInstance): Promise<void> {
    server.setNotFoundHandler(( _request, reply) => {
        reply.code(404).type("text/html").send(generateSSRPage(pageTemplate));
    });
}

function generateSSRPage(template: string): string {
    template = template
        .replace("{ssr-og}", "og: https://ogp.me/ns/website#")
        .replace("{ssr-title}", "Orbital Market - Lost in space");

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

    return template;
}
