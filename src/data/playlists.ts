import axios from "axios";
import { Playlist, ApiResponse } from "@/types/Music";

const api = axios.create({
  baseURL: "/api/music",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getPlaylists = async (): Promise<Playlist[]> => {
  try {
    const response = await api.get<ApiResponse<{ playlists: Playlist[] }>>(
      "/playlists"
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data.playlists;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
};

export async function createPlaylist(
  name: string,
  description: string,
  isPublic: boolean
): Promise<Playlist> {
  try {
    const response = await api.post<ApiResponse<{ playlist: Playlist }>>(
      "/create-playlist",
      {
        name,
        description,
        isPublic,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data.playlist;
  } catch (error) {
    console.error("Error creating playlist:", error);
    throw error;
  }
}

export async function updatePlaylist(
  id: string,
  tracks: string[]
): Promise<Playlist> {
  try {
    const response = await api.put<ApiResponse<{ playlist: Playlist }>>(
      `/playlist/${id}`,
      {
        tracks,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data.playlist;
  } catch (error) {
    console.error("Error updating playlist:", error);
    throw error;
  }
}

export async function getPlaylistById(id: string): Promise<Playlist> {
  try {
    const response = await api.get<ApiResponse<{ playlist: Playlist }>>(
      `/playlist/${id}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data.playlist;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    throw error;
  }
}

export async function deletePlaylist(id: string): Promise<void> {
  try {
    const response = await api.delete<ApiResponse<void>>(`/playlist/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error deleting playlist:", error);
    throw error;
  }
}
