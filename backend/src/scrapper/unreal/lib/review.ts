import ReviewModel from "@/modules/review/model";
import QuestionModel from "@/modules/question/model";

type TReviewData = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    helpfulNum: number;
    identityName: string;
    publisherReply?: {
        content: string;
    };
    rating: number;
    targetId: string;
}

export async function processCommentData(data: TReviewData, type: "reviews" | "questions") {
    if (type === "reviews") {
        if (!data.publisherReply?.content) {
            return;
        }

        await ReviewModel.deleteMany({
            "meta.unrealId": data.id
        }).exec();

        await ReviewModel.create({
            name: data.identityName || "unknown",
            title: data.title,
            content: data.content,
            date: new Date(data.createdAt),
            helpfulNum: data.helpfulNum,
            meta: {
                target: data.targetId,
                unrealId: data.id
            },
            publisherReply: data.publisherReply?.content,
            rating: data.rating
        });
    }
    else {
        await QuestionModel.deleteMany({
            "meta.unrealId": data.id
        }).exec();

        await QuestionModel.create({
            name: data.identityName || "unknown",
            title: data.title,
            content: data.content,
            date: new Date(data.createdAt),
            helpfulNum: data.helpfulNum,
            meta: {
                target: data.targetId,
                unrealId: data.id
            },
            publisherReply: data.publisherReply?.content
        });
    }
}
