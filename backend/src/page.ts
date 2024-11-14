import * as Fastify from "fastify";
import * as path from "path";
import * as fs from "fs";
import * as ProductService from "@/modules/product/service";
import * as UserService from "@/modules/user/service";
import { InternalServerError, NotFound } from "http-errors";
import _ from "lodash";
import escapeHTML from "escape-html";
import { IUser } from "@/modules/user/model";
import { TProductModel } from "@/modules/product/model";

const pageTemplate = fs.readFileSync(path.join(__dirname, "../../frontend/dist/index.html")).toString();

export default async function (server: Fastify.FastifyInstance): Promise<void> {
    server.get("*", async (request, reply) => {
        try {
            const generatedPage = await generateSSRPage(pageTemplate, request.url);
            reply.type("text/html").send(generatedPage);
        }
        catch (error) {
            if (error instanceof NotFound) {
                reply.callNotFound();
            }
            else {
                throw error;
            }
        }
    });
}

async function generateSSRPage(template: string, url: string): Promise<string> {
    const path = url.split("/");
    const allowPath = ["product", "search"];

    if (path[1] && !allowPath.includes(path[1])) {
        throw new NotFound();
    }

    const isProduct = (path[1] === "product");

    if (isProduct) {
        await generateProductHead();
    }
    else {
        await generateMainHead();
    }

    return template;

    async function generateProductHead(): Promise<void> {
        const slug = path[2];
        const product = await ProductService.getById(slug);
        if (!product) {
            throw new NotFound();
        }
        const owner = await UserService.getById(product.owner);
        if (!owner) {
            throw new InternalServerError();
        }

        template = template
            .replace("{ssr-og}", "og: https://ogp.me/ns/article#")
            .replace("{ssr-title}", escapeHTML(product.title));

        let SSRHead = `
    <meta name="description" content="${ escapeHTML(product.description.short) }">
    <meta property="og:title" content="${ escapeHTML(product.title) }"/>
    <meta property="og:site_name" content="Orbital Market"/>
    <meta property="og:url" content="https://orbital-market.com/"/>
    <meta property="og:description" content="${ escapeHTML(product.description.short) }"/>
    <meta property="og:type" content="article"/>
    <meta property="article:published_time" content="${ product.releaseDate.toISOString() }"/>
    <meta property="article:author" content="${ escapeHTML(owner?.name || "unknown") }"/>
    <meta property="og:image" content="${ escapeHTML(product.media.thumbnail) }"/>
    <meta property="og:image:width" content="894"/>
    <meta property="og:image:height" content="488"/>
    <meta name="twitter:card" content="summary_large_image">`;

        if (owner?.networks?.twitter) {
            const twitterUserName = `@${ _.last(owner.networks.twitter.split("/")) }`;
            SSRHead += `
    <meta name="twitter:creator" content="${ escapeHTML(twitterUserName) }">`;
        }

        SSRHead += `
    <script type="application/ld+json">${ generateJSONLD(product, owner) }</script>`;

        template = template.replace("<!--{ssr-head}-->", SSRHead);


    }

    function generateJSONLD(product: TProductModel, owner: IUser): string {
        const schemaData = {
            "name": escapeHTML(product.title),
            "@context": "https://schema.org/",
            "@type": "Product",
            "brand": {
                "name": owner.name,
                "@type": "Brand"
            },
            "category": "Unreal Engine Asset",
            "description": escapeHTML(product.description.short),
            "image": escapeHTML(product.media.thumbnail),
            "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "price": product.price.value / 100,
                "priceCurrency": "USD",
                "seller": {
                    "name": owner.name,
                    "@type": "Person"
                },
                "url": `https://orbital-market.com/product/${ escapeHTML(product.slug) }`
            },
            "releaseDate": product.releaseDate.toISOString(),
            "sku": product._id,
            "url": `https://orbital-market.com/product/${ escapeHTML(product.slug) }`
        } as Record<string, any>;

        if (product.review.count || 0 > 0) {
            schemaData.aggregateRating = {
                "@type": "AggregateRating",
                "bestRating": 5,
                "ratingCount": product.review.count,
                "ratingValue": (product.review.rating || 0),
                "worstRating": 1
            };
        }

        return JSON.stringify(schemaData);
    }

    function generateMainHead(): void {
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
}
