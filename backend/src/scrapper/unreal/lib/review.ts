import ReviewModel from "@/modules/review/model";
import QuestionModel from "@/modules/question/model";

type TReviewData = {
    id: string;
    targetId: string;
    title: string;
    identityName: string;
    rating: number;
    content: string;
    helpfulNum: number;
    createdAt: string;
    publisherReply?: {
        content: string;
    }
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
            title: data.title,
            name: data.identityName || "unknown",
            rating: data.rating,
            content: data.content,
            helpfulNum: data.helpfulNum,
            date: new Date(data.createdAt),
            publisherReply: data.publisherReply?.content,
            meta: {
                unrealId: data.id,
                target: data.targetId
            }
        });
    }
    else {
        await QuestionModel.deleteMany({
            "meta.unrealId": data.id
        }).exec();

        await QuestionModel.create({
            title: data.title,
            name: data.identityName || "unknown",
            content: data.content,
            helpfulNum: data.helpfulNum,
            date: new Date(data.createdAt),
            publisherReply: data.publisherReply?.content,
            meta: {
                unrealId: data.id,
                target: data.targetId
            }
        });
    }
}
