import Axios, { AxiosRequestConfig } from "axios";

export default {
    baseUrl: "",
    init (baseUrl: string): void {
        this.baseUrl = baseUrl;
    },
    async get (route: string, config?: AxiosRequestConfig): Promise<any> {
        const url = this.baseUrl + route;
        return await Axios.get(url, config);
    },
    async put (route: string, config?: AxiosRequestConfig): Promise<any> {
        const url = this.baseUrl + route;
        return await Axios.put(url, config);
    },
    async post (route: string, config?: AxiosRequestConfig): Promise<any> {
        const url = this.baseUrl + route;
        return await Axios.post(url, config);
    },
    async delete (route: string, config?: AxiosRequestConfig): Promise<any> {
        const url = this.baseUrl + route;
        return await Axios.delete(url, config);
    }
};
