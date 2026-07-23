import type{ UrlRequest, UrlResponse } from "../types/url";
import api from "./api";

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

export const getMyUrls = async() => {
    try{
        const response = await api.get("/url/my-urls");

        return response.data;
    }
    catch{
        return null;
    }
};
