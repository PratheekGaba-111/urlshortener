import { useEffect, useState } from "react";

import type { UrlData } from "../types/url";
import { getMyUrls } from "../services/url.service";
import UrlCard from "./UrlCard";
import "./MyUrls.css";

const MyUrls = () => {

    const [urls, setUrls] = useState<UrlData[]>([]);


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

        <section className="my-urls">

            <h2>
                Your URLs
            </h2>


            {
                urls.length === 0 ? (

                    <p className="empty-message">
                        No URLs created yet
                    </p>

                ) : (

                    <div className="url-list">

                        {
                            urls.map((url) => (

                                <UrlCard 
                                    key={url.id}
                                    urlData={url}
                                />

                            ))
                        }

                    </div>

                )
            }


        </section>

    )
};

export default MyUrls;