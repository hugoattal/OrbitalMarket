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
    publishedReply?:{
        content: string;
    }
}

export async function processReviewData(data: TReviewData) {
    const review = await ReviewModel.findOne({
        meta: { unrealId: data.id }
    }).exec();

    if (!review) {
        await ReviewModel.create({
            title: data.title,
            name: data.identityName || "unknown",
            rating: data.rating,
            content: data.content,
            helpfulNum: data.helpfulNum,
            date: new Date(data.createdAt),
            publishedReply: data.publishedReply?.content,
            meta: {
                unrealId: data.id,
                target: data.targetId
            }
        });
    }
}
