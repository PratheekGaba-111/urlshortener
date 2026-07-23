import { useEffect, useState } from "react";
import { Calendar, Check, Copy, ExternalLink, MousePointerClick } from "lucide-react";
import type { UrlData } from "../types/url";
import "./UrlCard.css";
interface UrlCardProps {
  urlData: UrlData | null;
  featured?: boolean;
}

const UrlCard = ({ urlData, featured = false }: UrlCardProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), 1800);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  if (!urlData) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(urlData.shortUrl);
      setCopied(true);
    } catch (error) {
      console.error(error);
      alert("Failed to copy!");
    }
  };

  return (
    <article className={featured ? "url-card url-card--featured" : "url-card"}>
      <div className="url-card__topline">
        <span className="url-card__code">/{urlData.shortCode}</span>
        <span className="url-card__badge">
          <MousePointerClick size={15} aria-hidden="true" />
          {urlData.clicks} clicks
        </span>
      </div>

      <div className="url-card__main">
        <a
          className="url-card__short"
          href={urlData.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {urlData.shortUrl}
          <ExternalLink size={16} aria-hidden="true" />
        </a>

        <a
          className="url-card__original"
          href={urlData.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {urlData.originalUrl}
        </a>
      </div>

      <div className="url-card__footer">
        <span className="url-card__date">
          <Calendar size={15} aria-hidden="true" />
          {new Date(urlData.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>

        <button
          type="button"
          className={copied ? "copy-button is-copied" : "copy-button"}
          onClick={handleCopy}
          aria-live="polite"
        >
          {copied ? (
            <>
              <Check size={16} aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy size={16} aria-hidden="true" />
              Copy
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export default UrlCard;
