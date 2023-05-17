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
import AuthPage from "./pages/Auth";

function App() {
  const [data, setData] = useState<MediaItem[]>();
  const [bookmarksMovies, setBookmarksMovies] = useState<MediaItem[]>([]);
  const [bookmarksTV, setBookmarksTV] = useState<MediaItem[]>([]);
  const { token, login, logout, userId } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("data.json");

      if (!response.ok) {
        console.log("Could not fetch data");
        return;
      }

      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);

  // console.log(data);

  const moviesBookmarksHandler = (movie: MediaItem) => {
    console.log(movie);
    if (!bookmarksMovies.includes(movie)) {
      setBookmarksMovies((prevState) => prevState.concat(movie));
    } else {
      setBookmarksMovies((prevState) =>
        prevState.filter((item) => item !== movie)
      );
    }
  };

  const tvBookmarksHandler = (series: MediaItem) => {
    if (!bookmarksTV.includes(series)) {
      setBookmarksTV((prevState) => prevState.concat(series));
    } else {
      setBookmarksTV((prevState) =>
        prevState.filter((item) => item !== series)
      );
    }
  };

  // console.log(bookmarksMovies);
  // console.log(bookmarksTV);

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
                onMovieBookmark={moviesBookmarksHandler}
                onTVBookmark={tvBookmarksHandler}
                movieBookmarks={bookmarksMovies}
                tvBookmarks={bookmarksTV}
              />
            ),
          },
          {
            path: "/movies",
            element: (
              <MoviesPage
                data={data}
                onMovieBookmark={moviesBookmarksHandler}
                onTVBookmark={tvBookmarksHandler}
                movieBookmarks={bookmarksMovies}
                tvBookmarks={bookmarksTV}
              />
            ),
          },
          {
            path: "/tv",
            element: (
              <TVPage
                data={data}
                onMovieBookmark={moviesBookmarksHandler}
                onTVBookmark={tvBookmarksHandler}
                movieBookmarks={bookmarksMovies}
                tvBookmarks={bookmarksTV}
              />
            ),
          },
          {
            path: "/bookmarks",
            element: (
              <BookmarksPage
                onMovieBookmark={moviesBookmarksHandler}
                onTVBookmark={tvBookmarksHandler}
                movieBookmarks={bookmarksMovies}
                tvBookmarks={bookmarksTV}
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
                onMovieBookmark={moviesBookmarksHandler}
                onTVBookmark={tvBookmarksHandler}
                movieBookmarks={bookmarksMovies}
                tvBookmarks={bookmarksTV}
              />
            ),
          },
          {
            path: "/movies",
            element: (
              <MoviesPage
                data={data}
                onMovieBookmark={moviesBookmarksHandler}
                onTVBookmark={tvBookmarksHandler}
                movieBookmarks={bookmarksMovies}
                tvBookmarks={bookmarksTV}
              />
            ),
          },
          {
            path: "/tv",
            element: (
              <TVPage
                data={data}
                onMovieBookmark={moviesBookmarksHandler}
                onTVBookmark={tvBookmarksHandler}
                movieBookmarks={bookmarksMovies}
                tvBookmarks={bookmarksTV}
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
      }}
    >
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
