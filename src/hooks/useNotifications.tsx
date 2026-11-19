
import { useCallback, useEffect } from "react";
import { getNotifications } from "../services/notificationService";
import { errorMessage } from "../services/apiError";

export function useNotifications(
  setNotificationState,
  setLoading,
  setError
) {
  const refetch = useCallback(async (signal?: AbortSignal) => {
    try {
      const notis = await getNotifications({ signal });
      setNotificationState(notis);
      return notis;
    } catch (err) {
      if (!signal?.aborted) {
        setError(errorMessage(err));
      }

      throw err;
    }
  }, [setNotificationState, setError]);

  useEffect(() => {
    const controller = new AbortController();

    refetch(controller.signal)
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [refetch, setLoading]);

  return refetch;
}
