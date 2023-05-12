import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { MediaItem } from "myTypes";

import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import MoviesPage from "./pages/Movies";
import TVPage from "./pages/TV";
import BookmarksPage from "./pages/Bookmarks";

function App() {
  const [data, setData] = useState<MediaItem[]>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("data.json");

      if (!response.ok) {
        console.log("error");
        return;
      }

      const data = await response.json();
      setData(data);
    };

    fetchData();
  }, []);

  // console.log(data);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage data={data} /> },
        {
          path: "/movies",
          element: <MoviesPage />,
        },
        {
          path: "/tv",
          element: <TVPage />,
        },
        {
          path: "/bookmarks",
          element: <BookmarksPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
