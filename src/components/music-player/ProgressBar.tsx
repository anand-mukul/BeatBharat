import React from "react";
import { Slider } from "@/components/ui/slider";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  loadedChunks: { start: number; end: number }[];
  onSeek: (time: number) => void;
  isExpanded: boolean;
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  loadedChunks,
  onSeek,
  isExpanded,
}) => (
  <div className={`flex items-center ${isExpanded ? "w-full max-w-xl mb-8" : "flex-1 mx-4"}`}>
    <span className="mr-2">{formatTime(currentTime)}</span>
    <div className="relative flex-1">
      <Slider
        value={[currentTime]}
        max={duration}
        step={1}
        onValueChange={([value]) => onSeek(value)}
        className="z-10"
      />
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 transform -translate-y-1/2">
        {loadedChunks.map((chunk, index) => (
          <div
            key={index}
            className="absolute h-full bg-gray-500"
            style={{
              left: `${(chunk.start / duration) * 100}%`,
              width: `${((chunk.end - chunk.start) / duration) * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
    <span className="ml-2">{formatTime(duration)}</span>
  </div>
);