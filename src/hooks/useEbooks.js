import { useEffect, useState } from "react";
import { subscribeToEbooks } from "../services/ebookService";

/**
 * Real-time hook that subscribes to the ebooks Firestore collection.
 * Returns { ebooks, loading, error }.
 */
export function useEbooks() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToEbooks(
      (data) => {
        setEbooks(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { ebooks, loading, error };
}
