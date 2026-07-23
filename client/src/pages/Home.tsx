import Navbar from "../components/Navbar";
import UrlCard from "../components/UrlCard";
import { useState } from "react";
import UrlForm from "../components/UrlForm";
import MyUrls from "../components/MyUrls";

import type { UrlData } from "../types/url";
const Home = () => {
    const [urlData, setUrlData] = useState<UrlData | null>(null);    return(
        <>
            <Navbar />
            <main>
                <h1>Shorten your URLs</h1>
                <UrlForm onSuccess={setUrlData}/>
                {urlData && <UrlCard urlData={urlData}/>}

                <MyUrls/>
            </main>
        </>
    );
};
export default Home;