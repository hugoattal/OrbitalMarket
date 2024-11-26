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
        score: number;
    };
    description: {
        long: string;
        short: string;
        technical: string;
    },
    discount: number;
    media: { images: Array<string>; thumbnail: string };
    meta: {
        fabId: string;
    };
    owner: {
        name: string;
        meta: {
            fabId: string;
        };
    };
    price: { value: number };
    releaseDate: string;
    review: {
        count: number;
        rating: number;
    };
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
    async getById(id: string | number): Promise<IProduct> {
        const result = await ApiService.get(`/products/product/${ id }`);
        return result.data;
    },
    async getQuestionsById(id: string): Promise<Array<IReview>> {
        const result = await ApiService.get(`/products/product/${ id }/questions`);
        return result.data;
    },
    async getReviewsById(id: string): Promise<Array<IReview>> {
        const result = await ApiService.get(`/products/product/${ id }/reviews`);
        return result.data;
    }
};
