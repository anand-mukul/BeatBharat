import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  toggleMute: () => void;
  handleVolumeChange: (value: number) => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  toggleMute,
  handleVolumeChange,
}) => (
  <div className="flex items-center">
    <Button variant="ghost" size="icon" onClick={toggleMute}>
      {isMuted ? <VolumeX /> : <Volume2 />}
    </Button>
    <Slider
      value={[isMuted ? 0 : volume]}
      max={1}
      step={0.01}
      onValueChange={([value]) => handleVolumeChange(value)}
      className="w-24 ml-2"
    />
  </div>
);