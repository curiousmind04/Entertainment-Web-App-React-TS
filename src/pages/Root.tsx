import { Outlet } from "react-router-dom";

import MainNav from "../components/Navigation";

const RootLayout = () => {
  return (
    <>
      <MainNav />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
