import ApiService from "@/services/api.service";

export interface ISearchProduct {
    _id: string;
    title: string;
    slug: string;
    owner: string;
    releaseDate: string;
    price: { value: number };
    discount: { value: number };
    pictures: { thumbnail: Array<string> };
    computed: {
        score: {
            value: number;
            totalRatings: number;
            meanRating: number;
        },
        isBoosted: boolean
    }
}

export default {
    async query (params: any): Promise<Array<ISearchProduct>> {
        const result = await ApiService.post("/products/search", params);
        return result.data;
    }
};
