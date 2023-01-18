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

export interface IReview {
    name: string;
    title: string;
    _id: string;
    content: string;
    date: Date;
    helpfulNum: number;
    publisherReply?: string;
    rating: number;
}

export default {
    async getById (id: string | number): Promise<IProduct> {
        const result = await ApiService.get(`/products/product/${ id }`);
        return result.data;
    },
    async getQuestionsById (id: string): Promise<Array<IReview>> {
        const result = await ApiService.get(`/products/product/${ id }/questions`);
        return result.data;
    },
    async getReviewsById (id: string): Promise<Array<IReview>> {
        const result = await ApiService.get(`/products/product/${ id }/reviews`);
        return result.data;
    }
};
