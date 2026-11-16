import { useEffect } from "react";
import { getNotifications } from "../services/notificationService";


export function useNotifications(setnotificationState, setLoading, setError) {
  useEffect(() => {
    const controller = new AbortController();

    getNotifications({signal: controller.signal })
    
    .then(setnotificationState)
      .catch((err) => {
        if (!controller.signal.aborted) setError(errorMessage(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);
}