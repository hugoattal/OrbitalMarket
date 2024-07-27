import Mongo from "@/database";

export interface IProduct {
    title: string;
    category: {
        main: string;
        path: Array<string>;
    };
    computed?: {
        embeddedContent?: Array<string>;
        engine: Record<string, any>;
        isBoosted?: boolean;
        score?: {
            meanRating: number;
            totalRatings: number;
            value: number;
        };
    };
    description: {
        long: string;
        short: string;
        technical: string;
    };
    discount: {
        history?: Array<{
            date: Date;
            value: number;
        }>;
        value: number;
    };
    lastUpdate: Date;
    meta: Record<string, any>;
    owner: Mongo.Types.ObjectId;
    pictures: Record<string, Array<string>>;
    price: {
        history?: Array<{
            date: Date;
            value: number;
        }>;
        value: number;
    };
    ratings: Array<number>;
    releaseDate: Date;
    releases: Array<{
        apps: Array<string>;
        platforms: Array<string>;
        updateDate: Date;
    }>;
    slug: string;
    tags: Array<Mongo.Types.ObjectId>;
}

export interface IProductDocument extends IProduct, Mongo.Document {
}

const productSchema: Mongo.Schema = new Mongo.Schema({
    title: {
        faker: "commerce.productName",
        required: true,
        type: String
    },
    category: {
        main: {
            default: "default",
            enum: ["default", "unreal"],
            required: true,
            type: String
        },
        path: [String]
    },
    computed: {
        embeddedContent: [String],
        engine: {
            max: {
                faker: "5.00",
                type: String
            },
            min: {
                faker: "4.20",
                type: String
            }
        },
        isBoosted: Boolean,
        score: {
            meanRating: {
                faker: { "datatype.number": [{ max: 5, min: 0 }] },
                type: Number
            },
            totalRatings: {
                faker: { "datatype.number": [{ max: 200, min: 0 }] },
                type: Number
            },
            value: {
                faker: { "datatype.number": [{ max: 1000, min: 0 }] },
                type: Number
            }
        }
    },
    description: {
        long: {
            faker: "commerce.productDescription",
            required: true,
            type: String
        },
        short: String,
        technical: String
    },
    discount: {
        history: [
            {
                date: Date,
                value: Number
            }
        ],
        value: {
            faker: { "datatype.number": [{ max: 50, min: 0 }] },
            required: true,
            type: Number
        }
    },
    meta: Object,
    owner: {
        ref: "user",
        required: true,
        type: Mongo.Schema.Types.ObjectId
    },
    pictures: Object,
    price: {
        history: [
            {
                date: Date,
                value: Number
            }
        ],
        value: {
            faker: "commerce.price",
            required: true,
            type: Number
        }
    },
    ratings: [Number],
    releaseDate: {
        default: Date.now,
        faker: { "date.recent": 500 },
        required: true,
        type: Date
    },
    releases: [{
        apps: [String],
        platforms: [String],
        updateDate: Date
    }],
    slug: {
        faker: "internet.domainWord",
        required: true,
        type: String
    },
    tags: [{
        ref: "tag",
        type: Mongo.Schema.Types.ObjectId
    }]
});

productSchema.index(
    {
        title: "text",
        "description.long": "text",
        "description.short": "text",
        "description.technical": "text"
    },
    {
        "weights": {
            title: 4,
            "description.long": 1,
            "description.short": 2,
            "description.technical": 1
        }
    }
);

export default Mongo.model<IProductDocument>("product", productSchema);
