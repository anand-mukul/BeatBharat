"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Playlist } from "@/types/Music";
import { getPlaylists, createPlaylist, deletePlaylist } from "@/data/playlists";
import { toast } from "sonner";
import { useAuth } from "@/contexts/authContext"; // Assuming you have an auth context

interface PlaylistContextType {
  playlists: Playlist[];
  isLoading: boolean;
  addPlaylist: (
    name: string,
    description: string,
    isPublic: boolean
  ) => Promise<void>;
  removePlaylist: (id: string) => Promise<void>;
  refreshPlaylists: () => Promise<void>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(
  undefined
);

export const usePlaylistContext = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error(
      "usePlaylistContext must be used within a PlaylistProvider"
    );
  }
  return context;
};

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); // Use the auth context to get the current user

  const fetchPlaylists = async () => {
    if (!user) {
      setPlaylists([]);
      setIsLoading(false);
      return;
    }
    try {
      const fetchedPlaylists = await getPlaylists();
      setPlaylists(fetchedPlaylists);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to fetch playlists");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [user]); // Refetch playlists when the user changes

  const addPlaylist = async (
    name: string,
    description: string,
    isPublic: boolean
  ) => {
    if (!user) {
      toast.error("You must be logged in to create a playlist");
      return;
    }
    try {
      const newPlaylist = await createPlaylist(name, description, isPublic);
      setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);
      toast.success("Playlist created successfully");
    } catch (error) {
      toast.error("Failed to create playlist");
    }
  };

  const removePlaylist = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to delete a playlist");
      return;
    }
    try {
      await deletePlaylist(id);
      setPlaylists((prevPlaylists) =>
        prevPlaylists.filter((p) => p._id !== id)
      );
      toast.success("Playlist deleted successfully");
    } catch (error) {
      toast.error("Failed to delete playlist");
    }
  };

  const refreshPlaylists = async () => {
    setIsLoading(true);
    await fetchPlaylists();
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        isLoading,
        addPlaylist,
        removePlaylist,
        refreshPlaylists,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
