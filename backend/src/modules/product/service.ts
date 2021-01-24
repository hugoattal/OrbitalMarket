import ProductModel from "./model";
import { ISearch, ESortDirection, ESortField } from "./handler/schema";

export * as utils from "./utils";

export async function search(params: ISearch) {
    const sortArgument = {} as Record<string, number>;
    const sortDirection = (params.sortDirection === ESortDirection.asc) ? 1 : -1;

    switch (params.sortField) {
        case ESortField.lastUpdate:
            sortArgument["computed.lastUpdate"] = sortDirection;
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
            break;
    }

    const findCondition = {} as Record<string, any>;

    if (params.searchText && params.searchText !== "") {
        findCondition["$text"] = { $search: params.searchText };
    }

    return ProductModel
        .find(findCondition)
        .sort(sortArgument)
        .skip(params.skip)
        .limit(params.limit)
        .exec();
}
