export const PartialProduct = {
    type: "object",
    properties: {
        _id: { type: "string" },
        title: { type: "string" },
        slug: { type: "string" },
        owner: { type: "string" },
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
        description: {
            type: "object",
            properties: {
                short: { type: "string" }
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
                score: {}
            },
            additionalProperties: false
        }
    },
    additionalProperties: false
};

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
    skip: number;
    limit: number;
    searchText?: string;
    sortDirection: ESortDirection;
    sortField: ESortField;
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
        required: ["skip", "limit"],
        additionalProperties: false
    },
    response: {
        200: {
            type: "array",
            items: PartialProduct
        }
    }
};
