import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import MoviesPage from "./pages/Movies";
import TVPage from "./pages/TV";
import BookmarksPage from "./pages/Bookmarks";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
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
