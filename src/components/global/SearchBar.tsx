import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Search,
  Mic,
  X,
  Filter,
  Music,
  User,
  PlayCircle,
  ListMusic,
  Play,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { format } from "date-fns";
import { LoadingSpinner } from "../ui/loading-spinner";
import MusicPlayer from "../music-player/MusicPlayer";
import { Track } from "@/types/Music";

interface ArtistResult {
  _id: string;
  name?: string;
  bio?: string;
  image: string;
  genres?: string[];
}

interface SearchResult {
  _id: string;
  title?: string;
  artist: ArtistResult;
  duration?: number;
  url: string;
  genre?: string[];
  releaseDate?: string;
  play?: number;
  type: "user" | "track" | "artist" | "playlist";
  username?: string;
  name?: string;
  tracks?: { length: number };
}

interface SearchBarProps {
  isExpanded: boolean;
  onClose: () => void;
}

interface FilterOptions {
  types: ("user" | "track" | "artist" | "playlist")[];
  releaseYear?: number;
  genre?: string;
}

interface ApiResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SearchResponse {
  data: ApiResponse;
}
const placeholders = ["songs", "artists", "albums", "playlists"];

export function SearchBar({ isExpanded, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayPlaceholder, setDisplayPlaceholder] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({ types: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      const currentPlaceholder = placeholders[placeholderIndex];
      if (displayPlaceholder.length < currentPlaceholder.length) {
        setDisplayPlaceholder(
          currentPlaceholder.slice(0, displayPlaceholder.length + 1)
        );
      } else {
        clearInterval(typingEffect);
        setTimeout(() => {
          setDisplayPlaceholder("");
          setPlaceholderIndex(
            (prevIndex) => (prevIndex + 1) % placeholders.length
          );
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingEffect);
  }, [displayPlaceholder, placeholderIndex]);

  useEffect(() => {
    const searchDebounce = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const response = await axios.get<SearchResponse>("/api/search", {
            params: { query, ...filters },
          });
          const searchResults = response.data.data.results;
          setResults(searchResults);
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [query, filters]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const startVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      console.error("Web Speech API is not supported in this browser");
    }
  };

  const getResultTitle = (result: SearchResult) => {
    switch (result.type) {
      case "user":
        return result.username;
      case "track":
        return result.title;
      case "artist":
      case "playlist":
        return result.name;
      default:
        return "Unknown";
    }
  };

  const handleFilterChange = (
    type: "user" | "track" | "artist" | "playlist"
  ) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      releaseYear: event.target.value
        ? parseInt(event.target.value)
        : undefined,
    }));
  };

  const handleGenreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      genre: event.target.value || undefined,
    }));
  };

  const removeFilter = (
    type: "user" | "track" | "artist" | "playlist" | "releaseYear" | "genre"
  ) => {
    if (type === "releaseYear" || type === "genre") {
      setFilters((prev) => ({ ...prev, [type]: undefined }));
    } else {
      setFilters((prev) => ({
        ...prev,
        types: prev.types.filter((t) => t !== type),
      }));
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="h-5 w-5 text-blue-500" />;
      case "track":
        return <Music className="h-5 w-5 text-green-500" />;
      case "artist":
        return <User className="h-5 w-5 text-purple-500" />;
      case "playlist":
        return <ListMusic className="h-5 w-5 text-yellow-500" />;
      default:
        return <PlayCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "track") {
      const track: Track = {
        _id: result._id,
        title: result.title || "",
        artist: {
          _id: result.artist._id,
          name: result.artist.name || "",
          image: result.artist.image,
        },
        duration: result.duration || 0,
        url: result.url,
        album: "",
        type: "track",
      };
      setCurrentTrack(track);
      setPlaylist((prevPlaylist) => {
        const newPlaylist = [...prevPlaylist, track];
        return newPlaylist.slice(-50);
      });
      setIsPlayerVisible(true);
    }
  };

  const handleTrackChange = (track: Track | null) => {
    setCurrentTrack(track);
  };

  const handleLike = (trackId: string) => {
    console.log("Liked:", trackId);
    // Implement like functionality here
  };

  const handleDislike = (trackId: string) => {
    console.log("Disliked:", trackId);
    // Implement dislike functionality here
  };

  const handleShare = (trackId: string) => {
    console.log("Shared:", trackId);
    // Implement share functionality here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          placeholder={`Search ${displayPlaceholder}...`}
          className="w-full pl-10 pr-24 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-12 top-1/2 transform -translate-y-1/2"
          onClick={startVoiceSearch}
        >
          <Mic
            className={`h-5 w-5 ${
              isListening ? "text-red-500" : "text-gray-400"
            }`}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <Filter className="h-5 w-5 text-gray-400" />
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {filters.types?.map((type) => (
          <div
            key={type}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
          >
            {type}
            <button onClick={() => removeFilter(type)} className="ml-1">
              <X size={14} />
            </button>
          </div>
        ))}
        {filters.releaseYear && (
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center">
            Year: {filters.releaseYear}
            <button
              onClick={() => removeFilter("releaseYear")}
              className="ml-1"
            >
              <X size={14} />
            </button>
          </div>
        )}
        {filters.genre && (
          <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center">
            Genre: {filters.genre}
            <button onClick={() => removeFilter("genre")} className="ml-1">
              <X size={14} />
            </button>
          </div>
        )}
      </div>
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-10 w-[37vw] max-h-[70vh] mt-2 dark:bg-black rounded-md shadow-lg p-4 flex justify-center items-center"
          >
            <div className="relative">
              <LoadingSpinner />
            </div>
          </motion.div>
        ) : (results ?? []).length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-[37vw] mt-2 dark:bg-black rounded-md shadow-lg max-h-[70vh] overflow-y-auto border"
          >
            {results.map((result, index) => (
              <motion.div
                key={result._id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="relative group p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 transition duration-300 dark:bg-black cursor-pointer flex items-center"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-center w-[80%] p-2 rounded-lg transition duration-300">
                  <div className="flex-shrink-0 mr-3 relative group-hover:opacity-100">
                    {result.artist && result.artist.image ? (
                      <Image
                        src={result.artist.image}
                        alt={getResultTitle(result) || "Result"}
                        width={15}
                        height={15}
                        className="rounded mr-2 w-full h-full object-cover group-hover:opacity-20 transition-opacity duration-300"
                      />
                    ) : (
                      getResultIcon(result.type)
                    )}
                    <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play
                        fill="currentColor"
                        className="w-4 h-4 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {getResultTitle(result)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {result.artist && result.artist.name}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                    {result.type === "track" && result.duration && (
                      <span>{formatDuration(result.duration)}</span>
                    )}
                    {result.type === "playlist" && result.tracks && (
                      <span>{result.tracks.length} tracks</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Options</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Result Types</h3>
              {(["user", "track", "artist", "playlist"] as const).map(
                (type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.types.includes(type)}
                      onCheckedChange={() => handleFilterChange(type)}
                    />
                    <Label htmlFor={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Label>
                  </div>
                )
              )}
            </div>
            <div>
              <Label htmlFor="releaseYear">Release Year</Label>
              <select
                id="releaseYear"
                value={filters.releaseYear || ""}
                onChange={handleYearChange}
                className="w-full mt-1 rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Any</option>
                {[...Array(30)].map((_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="genre">Genre</Label>
              <select
                id="genre"
                value={filters.genre || ""}
                onChange={handleGenreChange}
                className="w-full mt-1 rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Any</option>
                {[
                  "Pop",
                  "Rock",
                  "Hip Hop",
                  "Electronic",
                  "Classical",
                  "Jazz",
                  "Country",
                ].map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {isPlayerVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <MusicPlayer
            currentTrack={currentTrack}
            playlist={playlist}
            onTrackChange={handleTrackChange}
            autoPlay={true}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

const formatDuration = (duration: number): string => {
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const formatReleaseDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "MMMM dd, yyyy");
};
