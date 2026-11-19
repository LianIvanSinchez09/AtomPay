// hooks/useNotificationScan.ts
import { useEffect, useRef, useState } from "react";
import { useNotifications } from "./useNotifications";

const INTERVAL_MS = 10 * 60 * 1000;

export function useNotificationScan(onNewNotifications?: () => void) {
  const callbackRef = useRef(onNewNotifications);
  callbackRef.current = onNewNotifications;

  const [items, setItems] = useState(null);

  useEffect(() => {
    let lastRun = Date.now();

    const run = async () => {
      lastRun = Date.now();
      try {
        const controller = new AbortController();
        getNotifications(setItems)
        if (items > 0) callbackRef.current()
      } catch (err) {
        console.error("Scan de notificaciones falló:", err);
      }
    };

    const id = setInterval(() => {
      if (document.visibilityState === "visible") run();
    }, INTERVAL_MS);

    // Si la pestaña estuvo en segundo plano (el navegador frena los timers), recupera al volver
    const onVisible = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastRun >= INTERVAL_MS
      ) {
        run();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
}
