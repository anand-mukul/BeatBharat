import { useState, useEffect } from "react";
import axios from "axios";
import { StreamingToken } from "@/types/Music";

export const useStreamingToken = (trackId: string | undefined) => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!trackId) return;

    const fetchStreamingToken = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post<{ data: StreamingToken }>(
          "/api/music/streaming-token",
          {
            trackId,
          }
        );
        const { token } = response.data.data;
        setStreamUrl(`/api/music/streaming?token=${encodeURIComponent(token)}`);
        console.log("streaming url:" + streamUrl)
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreamingToken();
  }, [trackId, streamUrl]);

  return { streamUrl, isLoading, error };
};
