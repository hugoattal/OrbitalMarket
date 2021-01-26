import ProductModel from "./model";
import { ESortDirection, ESortField, ISearch } from "./handler/schema";

export * as utils from "./utils";


export async function getById(id: string) {
    return ProductModel.findById(id);
}

export async function search(params: ISearch) {
    const sortArgument = {} as Record<string, number | Record<string, any>>;
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
    case ESortField.relevance:
        sortArgument["score"] = { $meta: "textScore" };
        break;
    }

    const findCondition = {} as Record<string, any>;

    if (params.searchText) {
        findCondition["$text"] = { $search: params.searchText };
    }

    const projection = {
        title: 1,
        slug: 1,
        owner: 1,
        price: 1,
        releaseDate: 1,
        discount: 1,
        "description.short": 1,
        "pictures.thumbnail": 1,
        computed: 1
    };

    return ProductModel
        .find(findCondition, projection)
        .sort(sortArgument)
        .skip(params.skip)
        .limit(params.limit)
        .exec();
}
