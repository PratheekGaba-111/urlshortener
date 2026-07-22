import axios from "axios";
import type{ UrlRequest, UrlResponse } from "../types/url";

const API = "http://localhost:3333/api/url";

export const shortenUrl = async(data : UrlRequest) : Promise<UrlResponse> => {
    const response = await axios.post<UrlResponse>(`${API}/shorten`, data);
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