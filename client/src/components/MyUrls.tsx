import { useEffect, useState } from "react";

import type { UrlClickUpdate, UrlData } from "../types/url";
import { getMyUrls } from "../services/url.service";
import UrlCard from "./UrlCard";
import "./MyUrls.css";
import { BarChart3, Link2, Plus } from "lucide-react";

interface MyUrlsProps {
  refreshKey?: number;
  clickUpdate?: UrlClickUpdate | null;
}

const MyUrls = ({ refreshKey = 0, clickUpdate = null }: MyUrlsProps) => {

  const [urls, setUrls] = useState<UrlData[]>([]);


  useEffect(() => {

    const fetchUrls = async () => {

      const response = await getMyUrls();

      if (response) {
        setUrls(response.data);
      }

    };

    fetchUrls();

  }, [refreshKey]);

  useEffect(() => {
    if (!clickUpdate) return;

    setUrls((currentUrls) =>
      currentUrls.map((url) =>
        url.id === clickUpdate.id
          ? {
              ...url,
              clicks: clickUpdate.clicks,
            }
          : url,
      ),
    );
  }, [clickUpdate]);


  return (

    <section className="my-urls">
      <div className="my-urls__header">
        <div className="section-heading">
          <span>Your workspace</span>
          <h2>Link portfolio</h2>
        </div>
        <div className="my-urls__summary">
          <span>
            <Link2 size={15} aria-hidden="true" />
            {urls.length} links
          </span>
          <span>
            <BarChart3 size={15} aria-hidden="true" />
            {urls.reduce((total, url) => total + url.clicks, 0)} clicks
          </span>
        </div>
      </div>

      {urls.length === 0 ? (
        <div className="empty-state glass-panel">
          <div className="empty-state__icon">
            <Plus size={28} aria-hidden="true" />
          </div>
          <h3>No URLs created yet</h3>
          <p>
            Paste a long URL above and your first polished Shortify link will
            appear here.
          </p>
        </div>
      ) : (
        <div className="url-list">
          {urls.map((url) => (
            <UrlCard key={url.id} urlData={url} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MyUrls;
