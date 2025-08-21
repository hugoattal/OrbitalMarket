import Mongo from "@/database";

export interface IReview {
    name: string;
    title: string;
    content: string;
    date: Date;
    helpfulNum: number;
    meta?: Record<string, any>;
    publisherReply?: string;
    rating: number;
}

export interface IReviewDocument extends IReview, Mongo.Document {
}

const schema: Mongo.Schema = new Mongo.Schema({
    name: {
        required: true,
        type: String
    },
    title: {
        required: true,
        type: String
    },
    content: {
        type: String
    },
    date: {
        required: true,
        type: Date
    },
    helpfulNum: {
        required: true,
        type: Number
    },
    meta: Object,
    publisherReply: {
        type: String
    },
    rating: {
        required: true,
        type: Number
    }
});

schema.index({ date: -1, "meta.target": 1 });

export default Mongo.model<IReviewDocument>("review", schema);
