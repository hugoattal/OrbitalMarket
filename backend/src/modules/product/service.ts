import ProductModel from "./model";
import { ESortDirection, ESortField, ISearch } from "./handler/schema";
import { isValidObjectId } from "mongoose";

export * as utils from "./utils";


export async function getById(id: string) {
    if (isValidObjectId(id)) {
        const product = await ProductModel.findById(id);

        if (product) {
            return product;
        }
    }


    return ProductModel.findOne({ slug: id }).exec();

}

export async function search(params: ISearch) {
    const sortArgument = [] as Array<Record<string, any>>;
    const sortDirection = (params.sortDirection === ESortDirection.asc) ? 1 : -1;

    switch (params.sortField) {
    case ESortField.lastUpdate:
        sortArgument.push(["computed.lastUpdate", sortDirection]);
        sortArgument.push(["releaseDate", sortDirection]);
        break;
    case ESortField.name:
        sortArgument.push(["title", sortDirection]);
        break;
    case ESortField.popularity:
        sortArgument.push(["computed.score.value", sortDirection]);
        break;
    case ESortField.releaseDate:
        sortArgument.push(["releaseDate", sortDirection]);
        break;
    case ESortField.reviews:
        sortArgument.push(["computed.score.totalRatings", sortDirection]);
        sortArgument.push(["releaseDate", sortDirection]);
        break;
    case ESortField.relevance:
        sortArgument.push(["score", sortDirection]);
        break;
    }

    sortArgument.push(["title", "asc"]);

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
