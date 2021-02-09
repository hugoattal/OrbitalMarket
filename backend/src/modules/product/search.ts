import { ESortDirection, ESortField, ISearch } from "@/modules/product/handler/schema";
import ProductModel, { IProductDocument } from "@/modules/product/model";
import { has } from "lodash";
import * as mongoUtils from "@/utils/mongo";

export async function search(params: ISearch): Promise<Array<IProductDocument>> {
    if (!has(params, "skip")) {
        params.skip = 0;
    }

    if (!has(params, "limit")) {
        params.limit = 40;
    }

    if (!has(params, "sortDirection")) {
        params.sortDirection = ESortDirection.asc;
    }

    if (!has(params, "sortField")) {
        params.sortField = ESortField.popularity;
    }

    const sortArgument = {} as Record<string, number>;
    const sortDirection = (params.sortDirection === ESortDirection.asc) ? 1 : -1;

    switch (params.sortField) {
    case ESortField.lastUpdate:
        sortArgument["computed.lastUpdate"] = sortDirection;
        sortArgument["releaseDate"] = sortDirection;
        break;
    case ESortField.name:
        sortArgument["title"] = sortDirection;
        break;
    case ESortField.popularity:
        sortArgument["computed.score.value"] = sortDirection;
        break;
    case ESortField.releaseDate:
        sortArgument["releaseDate"] = sortDirection;
        break;
    case ESortField.reviews:
        sortArgument["computed.score.totalRatings"] = sortDirection;
        sortArgument["releaseDate"] = sortDirection;
        break;
    case ESortField.relevance:
        if (params.searchText) {
            sortArgument["score"] = sortDirection;
        }
        break;
    }

    sortArgument["_id"] = sortDirection;

    const aggregationStages = [];

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

    if (params.searchText) {
        matchStage.push( {
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

    aggregationStages.push({
        $sort: sortArgument
    });

    aggregationStages.push({
        $skip: params.skip
    });

    aggregationStages.push({
        $limit: params.limit
    });

    aggregationStages.push({
        $project: {
            title: 1,
            slug: 1,
            owner: 1,
            price: 1,
            releaseDate: 1,
            discount: 1,
            "pictures.thumbnail": 1,
            computed: 1
        }
    });

    return ProductModel.aggregate(aggregationStages).exec();
}
