// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Play,
//   Pause,
//   SkipBack,
//   SkipForward,
//   Volume2,
//   VolumeX,
//   Repeat,
//   Shuffle,
//   Heart,
//   Share2,
//   Maximize2,
//   Minimize2,
//   ThumbsDown,
// } from "lucide-react";
// import { Slider } from "@/components/ui/slider";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import Image from "next/image";
// import axios from "axios";
// import { toast } from "sonner";
// import { useParams, useRouter } from "next/navigation";

// interface Artist {
//   _id: string;
//   name: string;
//   image: string;
// }

// export interface Track {
//   _id: string;
//   title: string;
//   artist: Artist;
//   duration: number;
//   url: string;
//   album?: string;
//   genre?: string[];
//   releaseDate?: string;
//   plays?: number;
//   type: "track";
// }

// interface MusicPlayerProps {
//   currentTrack: Track | null;
//   playlist: Track[];
//   onTrackChange: (track: Track | null) => void;
//   onLike?: (trackId: string) => void;
//   onDislike?: (trackId: string) => void;
//   onShare?: (trackId: string) => void;
//   autoPlay?: boolean;
// }

// export const MusicPlayer: React.FC<MusicPlayerProps> = ({
//   currentTrack,
//   playlist,
//   onTrackChange,
//   onLike,
//   onDislike,
//   onShare,
//   autoPlay = false,
// }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(1);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isLooping, setIsLooping] = useState(false);
//   const [isShuffled, setIsShuffled] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isBuffering, setIsBuffering] = useState(false);
//   const [loadedChunks, setLoadedChunks] = useState<
//     { start: number; end: number }[]
//   >([]);
//   const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
//   const [streamUrl, setStreamUrl] = useState<string | null>(null);
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (!audioRef.current) {
//       audioRef.current = new Audio();
//     }

//     const audio = audioRef.current;

//     const handleLoadedMetadata = () => {
//       setDuration(audio.duration);
//     };

//     const handleTimeUpdate = () => {
//       setCurrentTime(audio.currentTime);
//     };

//     const handleEnded = () => {
//       handleNext();
//     };

//     const handleProgress = () => {
//       const chunks = [];
//       for (let i = 0; i < audio.buffered.length; i++) {
//         chunks.push({
//           start: audio.buffered.start(i),
//           end: audio.buffered.end(i),
//         });
//       }
//       setLoadedChunks(chunks);
//     };

//     const handleWaiting = () => {
//       setIsBuffering(true);
//     };

//     const handleCanPlay = () => {
//       setIsBuffering(false);
//     };

//     audio.addEventListener("loadedmetadata", handleLoadedMetadata);
//     audio.addEventListener("timeupdate", handleTimeUpdate);
//     audio.addEventListener("ended", handleEnded);
//     audio.addEventListener("progress", handleProgress);
//     audio.addEventListener("waiting", handleWaiting);
//     audio.addEventListener("canplay", handleCanPlay);

//     // Auto-play logic
//     if (autoPlay && currentTrack && audioRef.current) {
//       audioRef.current.play().catch((error) => {
//         console.error("Error auto-playing audio:", error);
//       });
//       setIsPlaying(true);
//     }

//     return () => {
//       audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
//       audio.removeEventListener("timeupdate", handleTimeUpdate);
//       audio.removeEventListener("ended", handleEnded);
//       audio.removeEventListener("progress", handleProgress);
//       audio.removeEventListener("waiting", handleWaiting);
//       audio.removeEventListener("canplay", handleCanPlay);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchStreamingToken = async () => {
//       if (currentTrack) {
//         setIsLoading(true);
//         try {
//           const response = await axios.post(
//             "/api/music/get-streaming-token",
//             {
//               trackId: currentTrack._id,
//             },
//             {
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           const { token } = response.data.data;

//           if (!token) {
//             console.error("Token is undefined:", response.data);
//             return;
//           }

//           const newStreamUrl = `/api/music/stream-audio?token=${encodeURIComponent(
//             token
//           )}`;
//           setStreamUrl(newStreamUrl);

//           if (audioRef.current) {
//             audioRef.current.src = newStreamUrl;
//             audioRef.current.load();
//             if (isPlaying) {
//               audioRef.current.play().catch((error) => {
//                 console.error("Error playing audio:", error);
//                 setIsPlaying(false);
//               });
//             }
//           }
//         } catch (error) {
//           if (axios.isAxiosError(error)) {
//             console.error(
//               "Error fetching streaming token:",
//               error.response?.data || error.message
//             );
//           } else {
//             console.error("Error fetching streaming token:", error);
//           }
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchStreamingToken();

//     return () => {
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current.src = "";
//       }
//     };
//   }, [currentTrack, isPlaying]);
//   const togglePlay = useCallback(() => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.pause();
//       } else {
//         audioRef.current.play().catch((error) => {
//           console.error("Error playing audio:", error);
//         });
//       }
//       setIsPlaying(!isPlaying);
//     }
//   }, [isPlaying]);

//   const toggleMute = useCallback(() => {
//     if (audioRef.current) {
//       if (isMuted) {
//         audioRef.current.volume = volume;
//         setIsMuted(false);
//       } else {
//         audioRef.current.volume = 0;
//         setIsMuted(true);
//       }
//     }
//   }, [isMuted, volume]);

//   const handleNext = useCallback(() => {
//     const currentIndex = playlist.findIndex(
//       (track) => track._id === currentTrack?._id
//     );
//     const nextIndex = isShuffled
//       ? Math.floor(Math.random() * playlist.length)
//       : (currentIndex + 1) % playlist.length;
//     const nextTrack = playlist[nextIndex];
//     onTrackChange(nextTrack);
//   }, [playlist, currentTrack, isShuffled, onTrackChange]);

//   const handlePrevious = useCallback(() => {
//     const currentIndex = playlist.findIndex(
//       (track) => track._id === currentTrack?._id
//     );
//     const prevIndex = isShuffled
//       ? Math.floor(Math.random() * playlist.length)
//       : (currentIndex - 1 + playlist.length) % playlist.length;
//     const prevTrack = playlist[prevIndex];
//     onTrackChange(prevTrack);
//   }, [playlist, currentTrack, isShuffled, onTrackChange]);

//   const handleVolumeChange = (newVolume: number) => {
//     setVolume(newVolume);
//     if (audioRef.current) {
//       audioRef.current.volume = newVolume;
//     }
//     setIsMuted(newVolume === 0);
//   };

//   const handleSeek = (newTime: number) => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = newTime;
//       setCurrentTime(newTime);
//     }
//   };

//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds.toString().padStart(2, "0")}`;
//   };

//   const toggleLoop = () => {
//     setIsLooping(!isLooping);
//     if (audioRef.current) {
//       audioRef.current.loop = !isLooping;
//     }
//   };

//   const toggleShuffle = () => setIsShuffled(!isShuffled);
//   const toggleExpand = () => setIsExpanded(!isExpanded);

//   const handleLike = () => {
//     setIsLiked(!isLiked);
//     if (currentTrack && onLike) {
//       onLike(currentTrack._id);
//     }
//   };

//   const handleDislike = () => {
//     if (currentTrack && onDislike) {
//       onDislike(currentTrack._id);
//     }
//   };

//   const handleShare = async (platform: string) => {
//     if (!currentTrack) return;

//     try {
//       const response = await axios.post("/api/music/share", {
//         trackId: currentTrack._id,
//         platform,
//       });

//       const shareUrl = response.data.data.shareUrl;
//       console.log("shareUrl " + shareUrl);

//       window.open(shareUrl, "_blank");
//       toast.success("Track shared successfully!");
//     } catch (error) {
//       console.error("Error sharing track:", error);
//       toast.error("An error occurred while sharing the track");
//     }
//   };

//   const copyShareLink = async () => {
//     if (!currentTrack) return;

//     try {
//       const response = await axios.post("/api/music/share-link", {
//         trackId: currentTrack._id,
//       });

//       const shareUrl = response.data.data.shareUrl;

//       console.log("shareUrlLink " + shareUrl);

//       await navigator.clipboard.writeText(shareUrl);
//       toast.success("Share link copied to clipboard!");
//     } catch (error) {
//       console.error("Error copying share link:", error);
//       toast.error("An error occurred while copying the share link");
//     }
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ y: 100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         exit={{ y: 100, opacity: 0 }}
//         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         className={`fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 to-black text-white p-4 z-50 ${
//           isExpanded ? "h-screen" : "h-24"
//         }`}
//       >
//         <div
//           className={`flex ${
//             isExpanded
//               ? "flex-col items-center"
//               : "items-center justify-between"
//           }`}
//         >
//           {/* Album cover and track info */}
//           <div
//             className={`flex items-center ${
//               isExpanded ? "flex-col mb-8" : "mr-4"
//             }`}
//           >
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className={`relative ${
//                 isExpanded ? "w-64 h-64" : "w-16 h-16"
//               } mr-4`}
//             >
//               {currentTrack && (
//                 <Image
//                   src={currentTrack.artist.image}
//                   alt={`${currentTrack.title} cover`}
//                   layout="fill"
//                   objectFit="cover"
//                   className="rounded-lg"
//                 />
//               )}
//             </motion.div>
//             <div className={`${isExpanded ? "text-center mt-4" : ""}`}>
//               <h3 className="font-bold">{currentTrack?.title}</h3>
//               <p className="text-gray-400">{currentTrack?.artist.name}</p>
//             </div>
//           </div>

//           {/* Playback controls */}
//           <div className={`flex items-center ${isExpanded ? "mb-8" : ""}`}>
//             <Button variant="ghost" size="icon" onClick={handlePrevious}>
//               <SkipBack />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={togglePlay}
//               className="mx-2"
//             >
//               {isBuffering ? (
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                 >
//                   ⏳
//                 </motion.div>
//               ) : isPlaying ? (
//                 <Pause />
//               ) : (
//                 <Play />
//               )}
//             </Button>
//             <Button variant="ghost" size="icon" onClick={handleNext}>
//               <SkipForward />
//             </Button>
//           </div>

//           {/* Progress bar */}
//           <div
//             className={`flex items-center ${
//               isExpanded ? "w-full max-w-xl mb-8" : "flex-1 mx-4"
//             }`}
//           >
//             <span className="mr-2">{formatTime(currentTime)}</span>
//             <div className="relative flex-1">
//               <Slider
//                 value={[currentTime]}
//                 max={duration}
//                 step={1}
//                 onValueChange={([value]) => handleSeek(value)}
//                 className="z-10"
//               />
//               <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 transform -translate-y-1/2">
//                 {loadedChunks.map((chunk, index) => (
//                   <div
//                     key={index}
//                     className="absolute h-full bg-gray-500"
//                     style={{
//                       left: `${(chunk.start / duration) * 100}%`,
//                       width: `${((chunk.end - chunk.start) / duration) * 100}%`,
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//             <span className="ml-2">{formatTime(duration)}</span>
//           </div>

//           {/* Volume control */}
//           <div className={`flex items-center ${isExpanded ? "mb-8" : ""}`}>
//             <Button variant="ghost" size="icon" onClick={toggleMute}>
//               {isMuted ? <VolumeX /> : <Volume2 />}
//             </Button>
//             <Slider
//               value={[isMuted ? 0 : volume]}
//               max={1}
//               step={0.01}
//               onValueChange={([value]) => handleVolumeChange(value)}
//               className="w-24 ml-2"
//             />
//           </div>

//           {/* Additional controls */}
//           <div className={`flex items-center ${isExpanded ? "mb-8" : ""}`}>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={toggleLoop}
//               className={isLooping ? "text-green-500" : ""}
//             >
//               <Repeat />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={toggleShuffle}
//               className={isShuffled ? "text-green-500" : ""}
//             >
//               <Shuffle />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={handleLike}
//               className={isLiked ? "text-red-500" : ""}
//             >
//               <Heart />
//             </Button>
//             <Button variant="ghost" size="icon" onClick={handleDislike}>
//               <ThumbsDown />
//             </Button>
//             <div className="">
//               <Dialog
//                 open={isShareDialogOpen}
//                 onOpenChange={setIsShareDialogOpen}
//               >
//                 <DialogTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => setIsShareDialogOpen(true)}
//                   >
//                     <Share2 />
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-md">
//                   <DialogHeader>
//                     <DialogTitle>Share this track</DialogTitle>
//                   </DialogHeader>
//                   <div className="grid grid-cols-2 gap-4 py-4">
//                     {["Facebook", "Twitter", "Instagram", "WhatsApp"].map(
//                       (platform) => (
//                         <Button
//                           key={platform}
//                           onClick={() => handleShare(platform.toLowerCase())}
//                           className="w-full"
//                         >
//                           {platform}
//                         </Button>
//                       )
//                     )}
//                   </div>
//                   <Button onClick={copyShareLink} className="w-full mt-2">
//                     Copy Link
//                   </Button>
//                 </DialogContent>
//               </Dialog>
//             </div>
//           </div>

//           {/* Expand/Minimize button */}
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={toggleExpand}
//             className="ml-4"
//           >
//             {isExpanded ? <Minimize2 /> : <Maximize2 />}
//           </Button>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export const usePlayTrack = () => {
//   const playTrackRef = useRef<(track: Track) => void>();

//   const setPlayTrack = (playTrackFunc: (track: Track) => void) => {
//     playTrackRef.current = playTrackFunc;
//   };

//   const playTrack = (track: Track) => {
//     if (playTrackRef.current) {
//       playTrackRef.current(track);
//     }
//   };

//   return { setPlayTrack, playTrack };
// };
