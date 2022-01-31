import ApiService from "@/services/api.service";

export interface IProduct {
    title: string;
    _id: string;
    category?: {
        path: Array<string>;
    };
    computed: {
        embeddedContent?: Array<string>;
        isBoosted: boolean;
        score: {
            meanRating: number;
            totalRatings: number;
            value: number;
        };
    };
    description: {
        long: string;
        short: string;
        technical: string;
    };
    discount: { value: number };
    owner: string;
    pictures: { screenshot: Array<string>; thumbnail: Array<string> };
    price: { value: number };
    releaseDate: string;
    slug: string;
}

export default {
    async getById (id: string | number): Promise<IProduct> {
        const result = await ApiService.get(`/products/product/${ id }`);
        return result.data;
    }
};
