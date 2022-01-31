import ApiService from "@/services/api.service";

export interface ISearchProduct {
    title: string;
    _id: string;
    category: {
        path: Array<string>;
    };
    computed: {
        isBoosted: boolean;
        score: {
            meanRating: number;
            totalRatings: number;
            value: number;
        };
    };
    discount: { value: number };
    owner: string;
    pictures: { thumbnail: Array<string> };
    price: { value: number };
    releaseDate: string;
    slug: string;
}

export default {
    async query (params: any): Promise<Array<ISearchProduct>> {
        const result = await ApiService.post("/products/search", params);
        return result.data;
    }
};
