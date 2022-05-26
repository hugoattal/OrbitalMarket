import Mongo from "@/database";

export interface IProduct {
    title: string;
    slug: string;
    owner: Mongo.Types.ObjectId;
    price: {
        value: number;
        history?: Array<{
            value: number;
            date: Date;
        }>;
    };
    discount: {
        value: number;
        history?: Array<{
            value: number;
            date: Date;
        }>;
    };
    lastUpdate: Date;
    ratings: Array<number>;
    releaseDate: Date;
    description: {
        short: string;
        long: string;
        technical: string;
    };
    pictures: Record<string, Array<string>>;
    category: {
        main: string;
        path: Array<string>
    };
    releases: Array<{
        platforms: Array<string>;
        apps: Array<string>;
        updateDate: Date
    }>;
    tags: Array<Mongo.Types.ObjectId>;
    computed?: {
        isBoosted?: boolean,
        score?: {
            value: number,
            totalRatings: number,
            meanRating: number
        },
        embeddedContent?: Array<string>,
        engine: Record<string, any>
    };
    meta?: Record<string, any>;
}

export interface IProductDocument extends IProduct, Mongo.Document {
}

const productSchema: Mongo.Schema = new Mongo.Schema({
    title: {
        type: String,
        required: true,
        faker: "commerce.productName"
    },
    slug: {
        type: String,
        required: true,
        faker: "internet.domainWord"
    },
    owner: {
        type: Mongo.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    price: {
        value: {
            type: Number,
            required: true,
            faker: "commerce.price"
        },
        history: [
            {
                value: Number,
                date: Date
            }
        ]
    },
    discount: {
        value: {
            type: Number,
            required: true,
            faker: { "random.number": [{ min: 0, max: 50 }] }
        },
        history: [
            {
                value: Number,
                date: Date
            }
        ]
    },
    ratings: [Number],
    releaseDate: {
        type: Date,
        required: true,
        default: Date.now,
        faker: { "date.recent": 500 }
    },
    description: {
        short: String,
        long: {
            type: String,
            required: true,
            faker: "commerce.productDescription"
        },
        technical: String
    },
    pictures: Object,
    category: {
        main: {
            type: String,
            enum: ["default", "unreal"],
            default: "default",
            required: true
        },
        path: [String]
    },
    releases: [{
        platforms: [String],
        apps: [String],
        updateDate: Date
    }],
    tags: [{
        type: Mongo.Schema.Types.ObjectId,
        ref: "tag"
    }],
    computed: Object,
    meta: Object
});

productSchema.index(
    {
        title: "text",
        "description.short": "text",
        "description.long": "text",
        "description.technical": "text"
    },
    {
        "weights": {
            title: 4,
            "description.short": 2,
            "description.long": 1,
            "description.technical": 1
        }
    }
);

export default Mongo.model<IProductDocument>("product", productSchema);
