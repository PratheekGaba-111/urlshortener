import Navbar from "../components/Navbar";
import UrlCard from "../components/UrlCard";
import { useCallback, useState } from "react";
import UrlForm from "../components/UrlForm";
import MyUrls from "../components/MyUrls";
import "./Home.css";
import type { UrlClickUpdate, UrlData } from "../types/url";
import { useUrlClickEvents } from "../hooks/useUrlClickEvents";
const Home = () => {
  const [urlData, setUrlData] = useState<UrlData | null>(null);
  const [urlsVersion, setUrlsVersion] = useState(0);
  const [clickUpdate, setClickUpdate] = useState<UrlClickUpdate | null>(null);

  const handleUrlCreated = (data: UrlData) => {
    setUrlData(data);
    setUrlsVersion((version) => version + 1);
  };

  const handleUrlClick = useCallback((update: UrlClickUpdate) => {
    setClickUpdate(update);
    setUrlData((currentUrl) => {
      if (!currentUrl || currentUrl.id !== update.id) {
        return currentUrl;
      }

      return {
        ...currentUrl,
        clicks: update.clicks,
      };
    });
  }, []);

  useUrlClickEvents(handleUrlClick);

  return (
    <>
      <Navbar />
      <main className="home">
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-hero__eyebrow">Developer-grade link intelligence</div>
          <h1 id="home-title">
            <span>Shorten your </span>
            <span className="gradient-text">URLs</span>
          </h1>
          <p>
            Create clean, trackable links in seconds with a dashboard built for
            founders, builders, and fast-moving teams.
          </p>
          <UrlForm onSuccess={handleUrlCreated} />
        </section>

        <section className="home-dashboard" aria-label="URL dashboard">
          {urlData && (
            <div className="home-dashboard__latest">
              <div className="section-heading">
                <span>Latest link</span>
                <h2>Ready to share</h2>
              </div>
              <UrlCard urlData={urlData} featured />
            </div>
          )}

          <MyUrls refreshKey={urlsVersion} clickUpdate={clickUpdate} />
        </section>
      </main>
    </>
  );
};
export default Home;
