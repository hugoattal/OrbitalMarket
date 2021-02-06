import { ESortDirection, ESortField, ISearch } from "@/modules/product/handler/schema";
import ProductModel, { IProductDocument } from "@/modules/product/model";
import { has } from "lodash";
import * as mongoUtils from "@/utils/mongo";

export async function search(params: ISearch): Promise<Array<IProductDocument>> {
    console.log(params);

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

    if (params.engineVersion) {
        aggregationStages.push({
            $match:
                mongoUtils.isRangeInRange(
                    "computed.engineVersion.min.1", "computed.engineVersion.max.1",
                    params.engineVersion.min[1], params.engineVersion.max[1]
                )
        });
    }

    console.log(aggregationStages);

    if (params.searchText) {
        aggregationStages.push({
            $match: {
                $text: {
                    $search: params.searchText
                }
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
