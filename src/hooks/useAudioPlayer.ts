import { useState, useEffect, useRef, useCallback } from "react";
import { Track } from "@/types/Music";

export const useAudioPlayer = (
  streamUrl: string | null,
  playlist: Track[],
  onTrackChange: (track: Track | null) => void,
  autoPlay: boolean
) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [loadedChunks, setLoadedChunks] = useState<
    { start: number; end: number }[]
  >([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackIndex = useRef(0);

  useEffect(() => {
    console.log('streamUrl changed:', streamUrl);
    if (streamUrl && audioRef.current) {
      console.log('Setting audio src:', streamUrl);
      audioRef.current.src = streamUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
      
      console.log('Can play MP3:', audioRef.current.canPlayType('audio/mpeg'));
      console.log('Can play AAC:', audioRef.current.canPlayType('audio/aac'));
      console.log('Can play OGG:', audioRef.current.canPlayType('audio/ogg; codecs="vorbis"'));
    }
  }, [streamUrl, isPlaying]);

  const togglePlay = useCallback(() => {
    console.log("togglePlay called, current isPlaying:", isPlaying);
    if (audioRef.current) {
      if (isPlaying) {
        console.log("Pausing audio");
        audioRef.current.pause();
      } else {
        console.log("Playing audio");
        audioRef.current.play().catch((error) => {
          console.error("Play failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
    } else {
      console.error("Audio element not initialized");
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleNext = useCallback(() => {
    if (isShuffled) {
      currentTrackIndex.current = Math.floor(Math.random() * playlist.length);
    } else {
      currentTrackIndex.current =
        (currentTrackIndex.current + 1) % playlist.length;
    }
    onTrackChange(playlist[currentTrackIndex.current]);
  }, [isShuffled, playlist, onTrackChange]);

  const handlePrevious = useCallback(() => {
    if (currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    } else {
      currentTrackIndex.current =
        (currentTrackIndex.current - 1 + playlist.length) % playlist.length;
      onTrackChange(playlist[currentTrackIndex.current]);
    }
  }, [currentTime, playlist, onTrackChange]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  }, []);

  const handleSeek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const toggleLoop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
      setIsLooping(!isLooping);
    }
  }, [isLooping]);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(!isShuffled);
  }, [isShuffled]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handlePlay = () => {
      console.log("Audio started playing");
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log("Audio paused");
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      console.log("Duration changed:", audio.duration);
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      console.log("Track ended");
      handleNext();
    };

    const handleWaiting = () => {
      console.log("Audio buffering");
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      console.log('Audio can play');
      setIsBuffering(false);
    };

    const handleLoadedMetadata = () => {
      console.log('Metadata loaded:', {
        duration: audio.duration,
        currentTime: audio.currentTime,
        buffered: audio.buffered,
        paused: audio.paused,
        ended: audio.ended,
        src: audio.src
      });
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e, audio.error);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);

    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error auto-playing audio:", error);
      });
      setIsPlaying(true);
    }

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, [handleNext]);

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLooping,
    isShuffled,
    isBuffering,
    loadedChunks,
    togglePlay,
    toggleMute,
    handleNext,
    handlePrevious,
    handleVolumeChange,
    handleSeek,
    toggleLoop,
    toggleShuffle,
  };
};
