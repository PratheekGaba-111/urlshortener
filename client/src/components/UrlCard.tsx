import type { UrlData } from "../types/url";
interface UrlCardProps{
    urlData : UrlData | null;
}

const UrlCard = ({urlData} : UrlCardProps) => {
    const handlecopy = async() => {
        if (!urlData) return;
        try {

            await navigator.clipboard.writeText(urlData.shortUrl);
            alert("Copied!");
        }catch(error){
            console.error(error);
            alert("Failed to Copy!");
        }
    };

    if(!urlData) return null;

    return (
        <div className="url-card">
            <h3>Short URL</h3>
            <a href={urlData.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
            >{urlData.shortUrl}</a>

            <button onClick={handlecopy}>
                Copy the URL
            </button>
        </div>
    );
};
export default UrlCard;