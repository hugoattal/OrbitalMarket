import { merge } from "lodash";

export const PartialProduct = {
    type: "object",
    properties: {
        _id: { type: "string" },
        title: { type: "string" },
        slug: { type: "string" },
        owner: { type: "string" },
        releaseDate: { type: "string", format: "date-time" },
        price: {
            type: "object",
            properties: {
                value: { type: "number" }
            },
            additionalProperties: false
        },
        discount: {
            type: "object",
            properties: {
                value: { type: "number" }
            },
            additionalProperties: false
        },
        pictures: {
            type: "object",
            properties: {
                thumbnail: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },
            additionalProperties: false
        },
        computed: {
            type: "object",
            properties: {
                score: {},
                lastUpdate: { type: "string", format: "date-time" },
                isBoosted: { type: "boolean" }
            },
            additionalProperties: false
        }
    },
    additionalProperties: false
};

export const FullProduct = merge(PartialProduct, {
    properties: {

        description: {
            properties: {
                short: { type: "string" },
                long: { type: "string" },
                technical: { type: "string" }
            }
        },
        pictures: {
            properties: {
                screenshot: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            }
        }

    }
});


export enum ESortDirection {
    asc = "asc",
    desc = "desc"
}

export enum ESortField {
    popularity = "popularity",
    releaseDate = "releaseDate",
    lastUpdate = "lastUpdate",
    reviews = "reviews",
    name = "name",
    relevance = "relevance",
}

export interface ISearch {
    skip?: number;
    limit?: number;
    searchText?: string;
    sortDirection?: ESortDirection;
    sortField?: ESortField;
}

export const Search = {
    querystring: {
        type: "object",
        properties: {
            skip: {
                type: "integer",
                minimum: 0,
                default: 0
            },
            limit: {
                type: "integer",
                minimum: 1,
                maximum: 40,
                default: 40
            },
            searchText: { type: "string" },
            sortDirection: {
                type: "string",
                enum: ["asc", "desc"],
                default: "desc"
            },
            sortField: {
                type: "string",
                enum: ["popularity", "releaseDate", "lastUpdate", "reviews", "name", "relevance"],
                default: "popularity"
            }
        },
        additionalProperties: false
    },
    response: {
        200: {
            type: "array",
            items: PartialProduct
        }
    }
};


export const GetById = {
    params: {
        type: "object",
        properties: {
            id: {
                type: "string"
            }
        },
        required: ["id"],
        additionalProperties: false
    },
    response: {
        200: FullProduct
    }
};
