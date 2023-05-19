import React from "react";
import { MediaItem } from "myTypes";

type ContextType = {
  isLoggedIn: boolean;
  userId: string | undefined;
  token: string | undefined;
  login: (
    uid: string,
    token: string,
    movieBookmarks: MediaItem[],
    tvBookmarks: MediaItem[],
    expirationDate?: Date | undefined
  ) => void;
  logout: () => void;
  movieBookmarks: MediaItem[];
  movieBookmarksHandler: (movieBookmarks: MediaItem[]) => void;
  tvBookmarks: MediaItem[];
  tvBookmarksHandler: (movieBookmarks: MediaItem[]) => void;
};

export const AuthContext = React.createContext<ContextType | null>(null);
