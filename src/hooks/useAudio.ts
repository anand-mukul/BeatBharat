import { useState, useEffect, useRef, useCallback } from "react";
import { Track } from "@/types/Music";

export const useAudio = (currentTrack: Track | null, autoPlay: boolean) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [loadedChunks, setLoadedChunks] = useState<
    { start: number; end: number }[]
  >([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);
    const handleProgress = () => {
      const chunks = [];
      for (let i = 0; i < audio.buffered.length; i++) {
        chunks.push({
          start: audio.buffered.start(i),
          end: audio.buffered.end(i),
        });
      }
      setLoadedChunks(chunks);
    };
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("progress", handleProgress);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("progress", handleProgress);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  useEffect(() => {
    const cleanup = initAudio();
    return cleanup;
  }, [initAudio]);

  const playTrack = useCallback(
    (url: string) => {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
        if (autoPlay) {
          audioRef.current.play().catch((error) => {
            console.error("Error playing audio:", error);
            setIsPlaying(false);
          });
          setIsPlaying(true);
        }
      }
    },
    [autoPlay]
  );

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback(
    (newVolume: number) => {
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
        setVolumeState(newVolume);
        setIsMuted(newVolume === 0);
      }
    },
    [setVolumeState]
  );

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  return {
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    isMuted,
    isLooping,
    loadedChunks,
    togglePlay,
    setVolume,
    toggleMute,
    setIsLooping,
    seekTo,
    playTrack,
  };
};
