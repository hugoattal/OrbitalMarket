import { ESortDirection, ESortField, ISearch } from "@/modules/product/handler/schema";
import UserModel from "@/modules/user/model";
import { has } from "lodash";
import * as mongoUtils from "@/utils/mongo";
import { PipelineStage } from "mongoose";
import { getAuthor } from "@/modules/product/utils";
import { ProductModel } from "@/modules/product/model";

export async function search(params: ISearch) {
    if (!has(params, "skip")) {
        params.skip = 0;
    }

    if (!has(params, "limit")) {
        params.limit = 40;
    }

    if (!has(params, "sortDirection")) {
        params.sortDirection = ESortDirection.desc;
    }

    if (!has(params, "sortField")) {
        params.sortField = ESortField.popularity;
    }

    const authors: Array<string> = [];

    if (params.searchText) {
        const { author, text } = getAuthor(params.searchText);
        params.searchText = text;

        if (author) {
            authors.push(author);
        }
    }

    const sortArgument = {} as Record<string, 1 | -1 | { $meta: "textScore" }>;
    const sortDirection = (params.sortDirection === ESortDirection.asc) ? 1 : -1;

    switch (params.sortField) {
    case ESortField.name:
        sortArgument["title"] = sortDirection;
        break;
    case ESortField.price:
        sortArgument["price.value"] = sortDirection;
        break;
    case ESortField.popularity:
        if (params.searchText) {
            sortArgument["score"] = sortDirection;
        }
        else {
            sortArgument["computed.score"] = sortDirection;
        }
        break;
    case ESortField.releaseDate:
        sortArgument["releaseDate"] = sortDirection;
        break;
    case ESortField.reviews:
        sortArgument["review.count"] = sortDirection;
        sortArgument["releaseDate"] = sortDirection;
        break;
    }

    if (!has(sortArgument, "$meta")) {
        sortArgument["_id"] = sortDirection;
    }

    const aggregationStages: Array<PipelineStage> = [];

    const matchStage = [
        {
            "computed": { $exists: true },
            "dates.lastTouched": { $gte: new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000) },
            "description.short": { $exists: true },
            "isAI": { $ne: true }
        }
    ];

    if (params.favlist) {
        matchStage.push({
            "meta.unrealId": {
                $in: params.favlist
            }
        });
    }

    if (authors.length) {
        const authorsIds = await UserModel.find({
            name: authors[0]
        });

        matchStage.push({
            owner: {
                $in: authorsIds.map((author) => author._id)
            }
        });
    }

    if (params.banlist) {
        const authorIds = await UserModel.find({
            "meta.fabId": {
                $in: params.banlist
            }
        });

        matchStage.push({
            "owner": {
                $nin: authorIds.map((author) => author._id)
            }
        });
    }

    if (params.engine) {
        matchStage.push(
            mongoUtils.isRangeInRange(
                "engine.min", "engine.max",
                params.engine.min, params.engine.max
            )
        );
    }

    if (params.price) {
        matchStage.push(
            mongoUtils.isInRange("price.value", params.price.min * 100, params.price.max * 100)
        );
    }

    if (params.time) {
        const now = new Date();
        now.setMonth(now.getMonth() - params.time.max);
        matchStage.push(
            { "releaseDate": { $gte: now } }
        );
    }

    if (params.discount) {
        matchStage.push(
            mongoUtils.isInRange("discount", params.discount.min, params.discount.max)
        );

        matchStage.push(
            { "price.value": { $gt: 0 } }
        );
    }

    if (params.categories && params.categories.length > 0) {
        matchStage.push({
            "category": { $in: params.categories }
        });
    }

    if (params.searchText) {
        matchStage.push({
            $text: {
                $search: params.searchText
            }
        });
    }

    if (matchStage.length > 0) {
        aggregationStages.push({
            $match: {
                $and: matchStage
            }
        });
    }

    const projectStage = {
        title: 1,
        category: 1,
        computed: 1,
        discount: 1,
        engine: 1,
        "media.thumbnail": 1,
        meta: 1,
        owner: 1,
        price: 1,
        releaseDate: 1,
        review: 1,
        slug: 1
    } as Record<string, any>;

    if (params.searchText) {
        projectStage.score = {
            $multiply: [{ $meta: "textScore" }, {
                $add: [
                    { $sqrt: "$computed.score" },
                    10,
                    { $cond: { else: 0, if: "$computed.isBoosted", then: 5 } }
                ]
            }]
        };
    }

    aggregationStages.push({
        $project: projectStage
    });

    aggregationStages.push({
        $sort: sortArgument
    });

    aggregationStages.push({
        $skip: params.skip || 0
    });

    aggregationStages.push({
        $limit: params.limit || 0
    });

    aggregationStages.push({
        $lookup: {
            as: "owner",
            foreignField: "_id",
            from: "users",
            localField: "owner"
        }
    });

    aggregationStages.push({
        $addFields: {
            owner: { $first: "$owner" }
        }
    });

    return ProductModel.aggregate(aggregationStages).exec();
}
