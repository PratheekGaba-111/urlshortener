import {useState, type FormEvent} from "react";

import { shortenUrl } from "../services/url.service";
import type { UrlData } from "../types/url";
import "./UrlForm.css";
interface UrlFormProps{
    onSuccess : (data : UrlData) => void;
}

const UrlForm = ({onSuccess} : UrlFormProps) => {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e : FormEvent) => {
        e.preventDefault();

        if(!url.trim()) return;

        try{
            setLoading(true);
            const response = await shortenUrl({
                originalUrl : url
            });
            onSuccess(response.data);

            setUrl("");
        }catch(error){
            console.error(error);
            alert("Failed to Shorten URL");
        }finally{
            setLoading(false);
        }
    };

    return(
        <form 
            className="url-form"
            onSubmit={handleSubmit}
        >

            <input
                type="url"
                placeholder="Enter a long URL......"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />

            <button 
                type="submit" 
                disabled={loading}
            >
                {loading ? "Shortening...." : "Shorten URL"}
            </button>

        </form>
    );
};
export default UrlForm;