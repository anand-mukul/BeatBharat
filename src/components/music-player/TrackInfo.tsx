import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Track } from "@/types/Music";

interface TrackInfoProps {
  track: Track | null;
  isExpanded: boolean;
}

export const TrackInfo: React.FC<TrackInfoProps> = ({ track, isExpanded }) => (
  <div className={`flex items-center ${isExpanded ? "flex-col mb-8" : "mr-4"}`}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative ${isExpanded ? "w-64 h-64" : "w-16 h-16"} mr-4`}
    >
      {track && (
        <Image
          src={track.artist.image}
          alt={`${track.title} cover`}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      )}
    </motion.div>
    <div className={`${isExpanded ? "text-center mt-4" : ""}`}>
      <h3 className="font-bold">{track?.title}</h3>
      <p className="text-gray-400">{track?.artist.name}</p>
    </div>
  </div>
);