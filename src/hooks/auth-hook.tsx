import { useCallback, useEffect, useState } from "react";
import { MediaItem } from "myTypes";

let logoutTimer: ReturnType<typeof setTimeout>;

export const useAuth = () => {
  const [token, setToken] = useState<string | undefined>();
  const [tokenExpirationDate, setTokenExpirationDate] = useState<
    Date | undefined
  >();
  const [userId, setUserId] = useState<string | undefined>();
  const [movieBookmarks, setMovieBookmarks] = useState<MediaItem[]>([]);
  const [tvBookmarks, setTVBookmarks] = useState<MediaItem[]>([]);

  const movieBookmarksHandler = (movieBookmarks: MediaItem[]) => {
    setMovieBookmarks(movieBookmarks);
  };

  const tvBookmarksHandler = (tvBookmarks: MediaItem[]) => {
    setTVBookmarks(tvBookmarks);
  };

  const login = useCallback(
    (
      uid: string,
      token: string,
      movieBookmarks: MediaItem[],
      tvBookmarks: MediaItem[],
      expirationDate: Date | undefined
    ) => {
      setToken(token);
      setUserId(uid);

      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token: token,
          expiration: tokenExpirationDate.toISOString(),
          movieBookmarks: movieBookmarks,
          tvBookmarks: tvBookmarks,
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(undefined);
    setTokenExpirationDate(undefined);
    setUserId(undefined);
    setTVBookmarks([]);
    setMovieBookmarks([]);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    let storedData;

    if (userData) {
      storedData = JSON.parse(userData);
    }

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.movieBookmarks,
        storedData.tvBookmarks,
        new Date(storedData.expiration)
      );
      setMovieBookmarks(storedData.movieBookmarks);
      setTVBookmarks(storedData.tvBookmarks);
    }
  }, [login]);

  return {
    token,
    login,
    logout,
    userId,
    movieBookmarks,
    movieBookmarksHandler,
    tvBookmarks,
    tvBookmarksHandler,
    tokenExpirationDate: tokenExpirationDate,
  };
};
