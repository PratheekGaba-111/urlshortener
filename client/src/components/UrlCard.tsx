import type { UrlData } from "../types/url";
import "./UrlCard.css";
interface UrlCardProps {
  urlData: UrlData | null;
}

const UrlCard = ({ urlData }: UrlCardProps) => {
  if (!urlData) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(urlData.shortUrl);
      alert("Copied!");
    } catch (error) {
      console.error(error);
      alert("Failed to copy!");
    }
  };

  return (
    <div className="url-card">
      <h2>Shortened URL</h2>

      <p>
        <strong>Original URL:</strong>
      </p>
      <a
        href={urlData.originalUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {urlData.originalUrl}
      </a>

      <br />
      <br />

      <p>
        <strong>Short URL:</strong>
      </p>
      <a
        href={urlData.shortUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {urlData.shortUrl}
      </a>

      <br />
      <br />

      <p>
        <strong>Short Code:</strong> {urlData.shortCode}
      </p>

      <p>
        <strong>Clicks:</strong> {urlData.clicks}
      </p>

      <p>
        <strong>Created At:</strong>{" "}
        {new Date(urlData.createdAt).toLocaleString()}
      </p>

      <br />

      <button onClick={handleCopy}>
        📋 Copy URL
      </button>
    </div>
  );
};

export default UrlCard;