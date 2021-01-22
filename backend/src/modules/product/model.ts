import Mongo from "@/database";

export interface IProduct {
    title: string;
    slug: string;
    owner: Mongo.Types.ObjectId;
    price: {
        value: number;
        history: Array<{
            value: number;
            date: Date;
        }>;
    };
    discount: {
        value: number;
        history: Array<{
            value: number;
            date: Date;
        }>;
    };
    ratings: Array<Number>;
    releaseDate: Date;
    description: {
        short: string;
        long: string;
        technical: string;
    };
    pictures: Array<{
        type: string;
        url: string;
    }>;
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
    meta?: any;
}

interface IProductDocument extends IProduct, Mongo.Document {
}

const productSchema: Mongo.Schema = new Mongo.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    owner: {
        type: Mongo.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    price: {
        value: {
            type: Number,
            required: true
        },
        history: [
            {
                value: Number,
                date: Date,
            }
        ]
    },
    discount: {
        value: {
            type: Number,
            required: true
        },
        history: [
            {
                value: Number,
                date: Date,
            }
        ]
    },
    ratings: [Number],
    releaseDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        short: String,
        long: String,
        technical: String
    },
    pictures: [
        {
            style: String,
            url: String
        }
    ],
    category: {
        main: {
            type: String,
            enum: ["default", "unreal"],
            default: "default"
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
    meta: Object
});

export default Mongo.model<IProductDocument>("product", productSchema);
