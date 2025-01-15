import { HydratedDocumentFromSchema } from "mongoose";
import Mongo from "@/database";

const schema = new Mongo.Schema({
    title: {
        required: true,
        type: String
    },
    category: {
        type: String
    },
    computed: {
        type: {
            embeddedContent: [String],
            isBoosted: Boolean,
            score: Number
        }
    },
    dates: {
        type: {
            lastPrecise: Date,
            lastTouched: Date
        }
    },
    description: {
        long: {
            type: String
        },
        short: {
            type: String
        },
        technical: {
            type: String
        }
    },
    discount: {
        type: Number
    },
    engine: {
        type: {
            max: {
                type: String
            },
            min: {
                type: String
            }
        }
    },
    isAI: {
        type: Boolean
    },
    isMature: {
        type: Boolean
    },
    media: {
        type: {
            images: [String],
            thumbnail: String
        }
    },
    meta: {
        type: {
            fabId: {
                type: String
            },
            unrealId: {
                type: String
            }
        }
    },
    owner: {
        ref: "user",
        required: true,
        type: Mongo.Schema.Types.ObjectId
    },
    price: {
        history: [
            {
                type: {
                    date: Date,
                    value: Number
                }
            }
        ],
        value: Number
    },
    releaseDate: {
        default: Date.now,
        required: true,
        type: Date
    },
    review: {
        type: {
            count: Number,
            rating: Number
        }
    },
    skip: {
        type: Boolean
    },
    slug: {
        required: true,
        type: String
    },
    tags: [{
        type: String
    }]
}, {
    minimize: false,
    timestamps: true
});

schema.index(
    {
        title: "text",
        "description.short": "text",
        "description.technical": "text"
    },
    {
        "weights": {
            title: 12,
            "description.short": 4,
            "description.technical": 1
        }
    }
);


export type TProductModel = HydratedDocumentFromSchema<typeof schema>;
export const ProductModel = Mongo.model("product", schema);
