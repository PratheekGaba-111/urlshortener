import { useEffect } from "react";
import type { UrlClickUpdate } from "../types/url";
import { clearAuthToken, TOKEN_KEY } from "../utils/auth";

const API_BASE_URL = "http://localhost:3333/api";

export const useUrlClickEvents = (
  onUrlClick: (update: UrlClickUpdate) => void,
) => {
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) return;

    const events = new EventSource(
      `${API_BASE_URL}/url/events?token=${encodeURIComponent(token)}`,
    );

    events.addEventListener("url-click", (event) => {
      const update = JSON.parse(event.data) as UrlClickUpdate;
      onUrlClick(update);
    });

    events.onerror = () => {
      if (events.readyState === EventSource.CLOSED) {
        clearAuthToken();
      }
    };

    return () => {
      events.close();
    };
  }, [onUrlClick]);
};
