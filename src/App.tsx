import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { MediaItem } from "myTypes";

import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import MoviesPage from "./pages/Movies";
import TVPage from "./pages/TV";
import BookmarksPage from "./pages/Bookmarks";

import { AuthContext } from "./context/auth-context";
import { useAuth } from "./hooks/auth-hook";
import { useHttpClient } from "./hooks/http-hook";
import AuthPage from "./pages/Auth";

function App() {
  const [data, setData] = useState<MediaItem[]>();
  const {
    token,
    login,
    logout,
    userId,
    movieBookmarks,
    movieBookmarksHandler,
    tvBookmarks,
    tvBookmarksHandler,
    tokenExpirationDate,
  } = useAuth();
  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("data.json");

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);

  const moviesHandler = async (movie: MediaItem) => {
    if (!movieBookmarks.some((bookmark) => bookmark.title === movie.title)) {
      const bookmarks = [...movieBookmarks, movie];
      movieBookmarksHandler(bookmarks);
      try {
        await sendRequest(
          import.meta.env.VITE_REACT_APP_BACKEND_URL +
            "/users/addMovieBookmark",
          "POST",
          JSON.stringify({
            bookmark: movie,
          }),
          {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }
        );
      } catch (err) {
        alert(err);
      }
    } else {
      const bookmarks = movieBookmarks.filter(
        (item) => item.title !== movie.title
      );
      movieBookmarksHandler(bookmarks);
      try {
        await sendRequest(
          import.meta.env.VITE_REACT_APP_BACKEND_URL +
            "/users/removeMovieBookmark",
          "DELETE",
          JSON.stringify({
            bookmark: movie,
          }),
          {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }
        );
      } catch (err) {
        alert(err);
      }
    }
  };

  const tvHandler = async (series: MediaItem) => {
    if (!tvBookmarks.some((bookmark) => bookmark.title === series.title)) {
      const bookmarks = [...tvBookmarks, series];
      tvBookmarksHandler(bookmarks);
      try {
        await sendRequest(
          import.meta.env.VITE_REACT_APP_BACKEND_URL + "/users/addTVBookmark",
          "POST",
          JSON.stringify({
            bookmark: series,
          }),
          {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }
        );
      } catch (err) {
        alert(err);
      }
    } else {
      const bookmarks = tvBookmarks.filter(
        (item) => item.title !== series.title
      );
      tvBookmarksHandler(bookmarks);
      try {
        await sendRequest(
          import.meta.env.VITE_REACT_APP_BACKEND_URL +
            "/users/removeTVBookmark",
          "DELETE",
          JSON.stringify({
            bookmark: series,
          }),
          {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }
        );
      } catch (err) {
        alert(err);
      }
    }
  };

  useEffect(() => {
    if (tokenExpirationDate) {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: userId,
          token: token,
          expiration: tokenExpirationDate.toISOString(),
          movieBookmarks: movieBookmarks,
          tvBookmarks: tvBookmarks,
        })
      );
    }
  }, [movieBookmarks, tvBookmarks, token, userId, tokenExpirationDate]);

  let router;

  if (token) {
    router = createBrowserRouter([
      {
        path: "/",
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: (
              <HomePage
                data={data}
                onMovieBookmark={moviesHandler}
                onTVBookmark={tvHandler}
                movieBookmarks={movieBookmarks}
                tvBookmarks={tvBookmarks}
              />
            ),
          },
          {
            path: "/movies",
            element: (
              <MoviesPage
                data={data}
                onMovieBookmark={moviesHandler}
                onTVBookmark={tvHandler}
                movieBookmarks={movieBookmarks}
                tvBookmarks={tvBookmarks}
              />
            ),
          },
          {
            path: "/tv",
            element: (
              <TVPage
                data={data}
                onMovieBookmark={moviesHandler}
                onTVBookmark={tvHandler}
                movieBookmarks={movieBookmarks}
                tvBookmarks={tvBookmarks}
              />
            ),
          },
          {
            path: "/bookmarks",
            element: (
              <BookmarksPage
                onMovieBookmark={moviesHandler}
                onTVBookmark={tvHandler}
                movieBookmarks={movieBookmarks}
                tvBookmarks={tvBookmarks}
              />
            ),
          },
          {
            path: "/auth",
            element: <AuthPage />,
          },
          {
            path: "*",
            element: <Navigate to="/" replace />,
          },
        ],
      },
    ]);
  } else {
    router = createBrowserRouter([
      {
        path: "/",
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: (
              <HomePage
                data={data}
                onMovieBookmark={moviesHandler}
                onTVBookmark={tvHandler}
                movieBookmarks={movieBookmarks}
                tvBookmarks={tvBookmarks}
              />
            ),
          },
          {
            path: "/movies",
            element: (
              <MoviesPage
                data={data}
                onMovieBookmark={moviesHandler}
                onTVBookmark={tvHandler}
                movieBookmarks={movieBookmarks}
                tvBookmarks={tvBookmarks}
              />
            ),
          },
          {
            path: "/tv",
            element: (
              <TVPage
                data={data}
                onMovieBookmark={moviesHandler}
                onTVBookmark={tvHandler}
                movieBookmarks={movieBookmarks}
                tvBookmarks={tvBookmarks}
              />
            ),
          },
          {
            path: "/auth",
            element: <AuthPage />,
          },
          {
            path: "/bookmarks",
            element: <Navigate to="/auth" replace />,
          },
          {
            path: "*",
            element: <Navigate to="/" replace />,
          },
        ],
      },
    ]);
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
        movieBookmarks: movieBookmarks,
        movieBookmarksHandler: movieBookmarksHandler,
        tvBookmarks: tvBookmarks,
        tvBookmarksHandler: tvBookmarksHandler,
      }}
    >
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
