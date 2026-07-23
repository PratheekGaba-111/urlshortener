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
          <div className="home-hero__meta">
            <span className="home-hero__pill">⚡ Launch-ready</span>
            <span className="home-hero__pill">📈 Live click signal</span>
            <span className="home-hero__pill">🔐 Secure workspace</span>
          </div>
          <h1 id="home-title">
            <span>Shorten, ship, and </span>
            <span className="gradient-text">own the moment</span>
          </h1>
          <p>
            Create clean, trackable links in seconds with a dashboard built for founders, builders, and fast-moving teams.
          </p>
          <UrlForm onSuccess={handleUrlCreated} />
          <div className="home-hero__stats">
            <article className="home-hero__stat">
              <strong>Fast launch flow</strong>
              <span>Turn long URLs into polished short links in seconds.</span>
            </article>
            <article className="home-hero__stat">
              <strong>Clear signal</strong>
              <span>Keep an eye on clicks without leaving the workspace.</span>
            </article>
            <article className="home-hero__stat">
              <strong>Built for momentum</strong>
              <span>Designed for founders, launch crews, and creators.</span>
            </article>
          </div>
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
