import React from "react";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/hooks/playerUtils";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  loadedChunks: { start: number; end: number }[];
  isExpanded: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  loadedChunks,
  isExpanded,
}) => {
  return (
    <div
      className={`flex items-center ${
        isExpanded ? "w-full max-w-xl mb-8" : "w-full sm:w-1/2 mb-4 sm:mb-0"
      }`}
    >
      <span className="mr-2 text-xs sm:text-sm">{formatTime(currentTime)}</span>
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
      <span className="ml-2 text-xs sm:text-sm">{formatTime(duration)}</span>
    </div>
  );
};

export default ProgressBar;
