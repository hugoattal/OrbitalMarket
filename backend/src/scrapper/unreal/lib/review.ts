import ReviewModel from "@/modules/review/model";

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

export async function processReviewData(data: TReviewData) {
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
