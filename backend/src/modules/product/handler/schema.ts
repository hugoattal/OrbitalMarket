import { merge } from "lodash";

export const PartialProduct = {
    additionalProperties: false,
    properties: {
        _id: { type: "string" },
        title: { type: "string" },
        category: {
            properties: {
                path: {
                    items: {
                        type: "string"
                    },
                    type: "array"
                }
            },
            type: "object"
        },
        computed: {
            additionalProperties: false,
            properties: {
                embeddedContent: { items: { type: "string" }, type: "array" },
                engine: {
                    max: { items: { type: "number" }, type: "array" },
                    min: { items: { type: "number" }, type: "array" }
                },
                isBoosted: { type: "boolean" },
                score: {}
            },
            type: "object"
        },
        discount: {
            additionalProperties: false,
            properties: {
                value: { type: "number" }
            },
            type: "object"
        },
        meta: {
            additionalProperties: false,
            properties: {
                unrealId: { type: "string" }
            }
        },
        owner: {
            additionalProperties: false,
            properties: {
                _id: { type: "string" },
                name: { type: "string" },
                meta: {
                    additionalProperties: false,
                    properties: {
                        unrealId: { type: "string" }
                    },
                    type: "object"
                }
            },
            type: "object"
        },
        pictures: {
            additionalProperties: false,
            properties: {
                thumbnail: {
                    items: {
                        type: "string"
                    },
                    type: "array"
                }
            },
            type: "object"
        },
        price: {
            additionalProperties: false,
            properties: {
                history: {
                    items: {
                        properties: {
                            date: { format: "date-time", type: "string" },
                            value: { type: "number" }
                        },
                        type: "object"
                    },
                    type: "array"
                },
                value: { type: "number" }
            },
            type: "object"
        },
        releaseDate: { format: "date-time", type: "string" },
        slug: { type: "string" }
    },
    type: "object"
};

export const FullProduct = merge(PartialProduct, {
    properties: {
        description: {
            properties: {
                long: { type: "string" },
                short: { type: "string" },
                technical: { type: "string" }
            }
        },
        pictures: {
            properties: {
                screenshot: {
                    items: {
                        type: "string"
                    },
                    type: "array"
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
    reviews = "reviews",
    name = "name",
    price = "price"
}

export interface ISearch {
    banlist?: Array<string>;
    categories?: Array<string>;
    discount?: {
        max: number;
        min: number;
    };
    engine?: {
        max: string;
        min: string;
    };
    favlist?: Array<string>;
    limit?: number;
    price?: {
        max: number;
        min: number;
    };
    searchText?: string;
    skip?: number;
    sortDirection?: ESortDirection;
    sortField?: ESortField;
    time?: {
        max: number;
        min: number;
    };
}

export const Search = {
    body: {
        additionalProperties: false,
        properties: {
            banlist: {
                items: { type: "string" },
                type: "array"
            },
            categories: {
                items: { type: "string" },
                type: "array" },
            discount: {
                properties: {
                    max: { type: "number" },
                    min: { type: "number" }
                },
                type: "object"
            },
            engine: {
                properties: {
                    max: { type: "string" },
                    min: { type: "string" }
                },
                type: "object"
            },
            favlist: {
                items: { type: "string" },
                type: "array"
            },
            limit: {
                default: 40,
                maximum: 40,
                minimum: 1,
                type: "integer"
            },
            price: {
                properties: {
                    max: { type: "number" },
                    min: { type: "number" }
                },
                type: "object"
            },
            searchText: { type: "string" },
            skip: {
                default: 0,
                minimum: 0,
                type: "integer"
            },
            sortDirection: {
                default: "desc",
                enum: ["asc", "desc"],
                type: "string"
            },
            sortField: {
                default: "popularity",
                enum: ["popularity", "releaseDate", "reviews", "name", "price"],
                type: "string"
            },
            time: {
                properties: {
                    max: { type: "number" },
                    min: { type: "number" }
                },
                type: "object"
            }
        },
        type: "object"
    },
    response: {
        200: {
            items: PartialProduct,
            type: "array"
        }
    }
};


export const GetById = {
    params: {
        additionalProperties: false,
        properties: {
            id: {
                type: "string"
            }
        },
        required: ["id"],
        type: "object"
    },
    response: {
        200: FullProduct
    }
};

export interface IList {
    ids: Array<string>;
}

export const List = {
    body: {
        additionalProperties: false,
        properties: {
            ids: {
                items: {
                    type: "string"
                },
                type: "array"
            }
        },
        required: ["ids"],
        type: "object"
    },
    response: {
        200: {
            items: PartialProduct,
            type: "array"
        }
    }
};
