import { NavLink } from "react-router-dom";
// import { useContext } from "react";

import classes from "./Navigation.module.css";
// import { AuthContext } from "../context/auth-context";

const MainNav = () => {
  // const auth = useContext(AuthContext);
  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <img src="/assets/logo.svg" alt="logo" />
        <div className={classes.group}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? classes.active : classes.link
            }
          >
            <img src="/assets/icon-nav-home.svg" alt="logo" />
          </NavLink>
          <NavLink
            to="/movies"
            className={({ isActive }) =>
              isActive ? classes.active : classes.link
            }
          >
            <img src="/assets/icon-nav-movies.svg" alt="logo" />
          </NavLink>
          <NavLink
            to="/tv"
            className={({ isActive }) =>
              isActive ? classes.active : classes.link
            }
          >
            <img src="/assets/icon-nav-tv-series.svg" alt="logo" />
          </NavLink>
          <NavLink
            to="/bookmarks"
            className={({ isActive }) =>
              isActive ? classes.active : classes.link
            }
          >
            <img src="/assets/icon-nav-bookmark.svg" alt="logo" />
          </NavLink>
          {/* {!auth?.isLoggedIn && (
            <li>
              <NavLink to="/auth">AUTHENTICATE</NavLink>
            </li>
          )}
          {auth?.isLoggedIn && (
            <li>
              <button onClick={auth?.logout}>LOGOUT</button>
            </li>
          )} */}
        </div>

        <div className={classes.avatar}>
          <NavLink to="/auth">
            <img src="/assets/image-avatar.png" alt="avatar" />
          </NavLink>
        </div>

        {/* <div className={classes.avatar}>
          <img src="/assets/image-avatar.png" alt="avatar" />
        </div> */}
        <h1 className="sr-only">Entertainment Web App</h1>
      </div>
    </header>
  );
};

export default MainNav;
