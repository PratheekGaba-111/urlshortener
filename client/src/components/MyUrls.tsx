import { useEffect, useState } from "react";

import type { UrlData } from "../types/url";
import { getMyUrls } from "../services/url.service";
import UrlCard from "./UrlCard";
const MyUrls = () => {
    const[urls, setUrls] = useState<UrlData[]>([]);

    useEffect(() => {
        const fetchUrls = async () => {
            const response = await getMyUrls();
            if(response){
                setUrls(response.data);
            }
        };
        fetchUrls();
    }, []);

    return (
        <section>
            <h2>Your URLs</h2>
            {
                urls.length === 0 ? (<p>No URLs created yet</p>) : (
                    urls.map((url) => (
                        <UrlCard key = {url.id} urlData={url}/>
                    ))
                )
            }
        </section>
    )   
};
export default MyUrls;