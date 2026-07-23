import axios from "axios";
import type{ UrlRequest, UrlResponse } from "../types/url";

const api = axios.create({
    baseURL: "http://localhost:3333/api",
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const shortenUrl = async(data : UrlRequest) : Promise<UrlResponse> => {
    const response = await api.post<UrlResponse>(`/url/shorten`, data);
    /*
    response looklike
        {
            data: {
                success:true,
                shortUrl:"..."
            },

            status:201,

            headers:{},

            config:{},

            ...
        }

    */
    return response.data;
}