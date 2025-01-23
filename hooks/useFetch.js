import { useState } from "react";
import { toast } from "sonner";

export function useFetch(cb) {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  async function fn(...args) {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    loading,
    error,
    fn,
    setData,
  };
}
