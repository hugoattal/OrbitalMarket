import Mongo from "@/database";

export interface IReview {
    title: string;
    name: string;
    rating: number;
    content: string;
    helpfulNum: number;
    date: Date;
    publisherReply?: string;
    meta?: Record<string, any>;
}

export interface IReviewDocument extends IReview, Mongo.Document {
}

const userSchema: Mongo.Schema = new Mongo.Schema({
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    helpfulNum: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    publisherReply: {
        type: String
    },
    meta: Object
});

export default Mongo.model<IReviewDocument>("review", userSchema);
