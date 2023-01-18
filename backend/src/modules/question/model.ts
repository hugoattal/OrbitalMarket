import Mongo from "@/database";

export interface IQuestion {
    title: string;
    name: string;
    content: string;
    helpfulNum: number;
    date: Date;
    publisherReply?: string;
    meta?: Record<string, any>;
}

export interface IQuestionDocument extends IQuestion, Mongo.Document {
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

export default Mongo.model<IQuestionDocument>("question", userSchema);
