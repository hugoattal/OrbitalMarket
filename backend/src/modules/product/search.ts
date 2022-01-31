import { ESortDirection, ESortField, ISearch } from "@/modules/product/handler/schema";
import ProductModel, { IProductDocument } from "@/modules/product/model";
import { has } from "lodash";
import * as mongoUtils from "@/utils/mongo";
import { PipelineStage } from "mongoose";

export async function search(params: ISearch): Promise<Array<IProductDocument>> {
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

    const sortArgument = {} as Record<string, 1 | -1 | { $meta: "textScore" }>;
    const sortDirection = (params.sortDirection === ESortDirection.asc) ? 1 : -1;

    switch (params.sortField) {
    case ESortField.name:
        sortArgument["title"] = sortDirection;
        break;
    case ESortField.popularity:
        if (params.searchText) {
            sortArgument["score"] = sortDirection;
        }
        else {
            sortArgument["computed.score.value"] = sortDirection;
        }
        break;
    case ESortField.releaseDate:
        sortArgument["releaseDate"] = sortDirection;
        break;
    case ESortField.reviews:
        sortArgument["computed.score.totalRatings"] = sortDirection;
        sortArgument["releaseDate"] = sortDirection;
        break;
    }

    if (!has(sortArgument, "$meta")) {
        sortArgument["_id"] = sortDirection;
    }

    const aggregationStages: Array<PipelineStage> = [];

    const matchStage = [];

    if (params.engine) {
        matchStage.push(
            mongoUtils.isRangeInRange(
                "computed.engine.min.1", "computed.engine.max.1",
                params.engine.min[1], params.engine.max[1]
            )
        );
    }

    if (params.price) {
        matchStage.push(
            mongoUtils.isInRange("price.value", params.price.min, params.price.max)
        );
    }

    if (params.categories && params.categories.length > 0) {
        matchStage.push({
            "category.path.1": { $in: params.categories }
        });
    }

    if (params.searchText) {
        matchStage.push({
            $text: {
                $search: params.searchText
            }
        });
    }

    if (params.discounted) {
        matchStage.push({
            $and: [
                { "discount.value": { $gt: 0 } },
                { "price.value": { $gt: 0 } }
            ]
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
        slug: 1,
        owner: 1,
        price: 1,
        releaseDate: 1,
        discount: 1,
        "category.path": 1,
        "pictures.thumbnail": 1,
        computed: 1
    } as Record<string, any>;

    if (params.searchText) {
        projectStage.score = {
            $multiply: [{ $meta: "textScore" }, {
                $add: [
                    { $sqrt: "$computed.score.value" },
                    10,
                    { $cond: { if: "$computed.isBoosted", then: 5, else: 0 } }
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

    return ProductModel.aggregate(aggregationStages).exec();
}
