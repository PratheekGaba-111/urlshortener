import { useEffect } from "react";
import type { UrlClickUpdate } from "../types/url";
import { TOKEN_KEY } from "../utils/auth";
import { apiBaseUrl } from "../services/api";

export const useUrlClickEvents = (
  onUrlClick: (update: UrlClickUpdate) => void,
) => {
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) return;

    const events = new EventSource(
      `${apiBaseUrl}/url/events?token=${encodeURIComponent(token)}`,
    );

    events.addEventListener("url-click", (event) => {
      const update = JSON.parse(event.data) as UrlClickUpdate;
      onUrlClick(update);
    });

    events.onerror = (error) => {
      console.warn("SSE connection interrupted.", error);
      // The browser automatically retries the connection.
      // Don't log the user out here.
    };

    return () => {
      events.close();
    };
  }, [onUrlClick]);
};