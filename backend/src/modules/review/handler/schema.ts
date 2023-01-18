export const Review = {
    type: "object",
    properties: {
        _id: { type: "string" },
        title: { type: "string" },
        name: { type: "string" },
        rating: { type: "string" },
        content: { type: "string" },
        helpfulNum: { type: "string" },
        date: { type: "string" },
        publisherReply: { type: "string" }
    },
    additionalProperties: false
};


export interface IList {
    ids: Array<string>
}

export const List = {
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
        200: {
            type: "array",
            items: Review
        }
    }
};
