import { useState, type FormEvent } from "react";

import { shortenUrl } from "../services/url.service";
import type { UrlData } from "../types/url";
import "./UrlForm.css";
import { Link2, Sparkles } from "lucide-react";
interface UrlFormProps {
  onSuccess: (data: UrlData) => void;
}

const UrlForm = ({ onSuccess }: UrlFormProps) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!url.trim()) return;

    try {
      setLoading(true);
      const response = await shortenUrl({
        originalUrl: url,
      });
      onSuccess(response.data);

      setUrl("");
    } catch (error) {
      console.error(error);
      alert("Failed to Shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="url-form glass-panel" onSubmit={handleSubmit}>
      <label className="url-form__label" htmlFor="long-url">
        Paste destination URL
      </label>
      <div className="url-form__row">
        <div className="url-form__input">
          <Link2 size={20} aria-hidden="true" />
          <input
            id="long-url"
            type="url"
            placeholder="https://example.com/your-long-product-launch-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} className="url-form__button">
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Shortening
            </>
          ) : (
            <>
              <Sparkles size={18} aria-hidden="true" />
              Shorten URL
            </>
          )}
        </button>
      </div>
    </form>
  );
};
export default UrlForm;
