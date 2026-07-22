import Navbar from "../components/Navbar";
import UrlCard from "../components/UrlCard";
import { useState } from "react";
import UrlForm from "../components/UrlForm";
import type { UrlData } from "../types/url";
const Home = () => {
    const [urlData, setUrlData] = useState<UrlData | null>(null);    return(
        <>
            <Navbar />
            <main>
                <h1>Shorten your URLs</h1>
                <UrlForm onSuccess={setUrlData}/>
                <UrlCard urlData={urlData}/>
            </main>
        </>
    );
};
export default Home;