import { Album, Track, ApiResponse, PaginatedResponse } from "@/types/Music";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/music",
});

export async function fetchAlbums(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Album[]>> {
  try {
    const response = await api.get<ApiResponse<PaginatedResponse<Album[]>>>(
      `/albums`,
      {
        params: { page, limit },
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching albums:", error);
    throw error;
  }
}

export async function fetchTopPicks(): Promise<Album[]> {
  try {
    const response = await api.get<ApiResponse<{ topAlbums: Album[] }>>(
      `/top-picks`
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data.topAlbums;
  } catch (error) {
    console.error("Error fetching top picks:", error);
    throw error;
  }
}

export const fetchAlbumById = async (id: string): Promise<Album> => {
  try {
    const response = await api.get<ApiResponse<{ album: Album }>>(
      `/albums/${id}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch album");
    }
    const album = response.data.data.album;
    if (!album.tracks || !Array.isArray(album.tracks)) {
      console.error("Invalid tracks data:", album.tracks);
      throw new Error(
        "Invalid album data: tracks are missing or in wrong format"
      );
    }
    return album;
  } catch (error) {
    console.error("Error in fetchAlbumById:", error);
    throw error;
  }
};
