import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import "./header.scss";

import logo from "./../../assets/logo.png";

import * as Config from "./../../constants/Config";
import { useAuth } from "../../context/AuthContext";

const headerNav = [
  {
    display: "Home",
    path: `/${Config.HOME_PAGE}`,
  },
  {
    display: "Movies",
    path: `/${Config.HOME_PAGE}/movie`,
  },
  {
    display: "TV Series",
    path: `/${Config.HOME_PAGE}/tv`,
  },
];

const Header = () => {
  const { pathname } = useLocation();
  const headerRef = useRef(null);
  const { user, logout } = useAuth();

  const active = headerNav.findIndex((e) => e.path === pathname);

  useEffect(() => {
    const shrinkHeader = () => {
      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        headerRef.current.classList.add("shrink");
      } else {
        headerRef.current.classList.remove("shrink");
      }
    };

    window.addEventListener("scroll", shrinkHeader);

    return () => {
      window.removeEventListener("scroll", shrinkHeader);
    };
  }, []);

  return (
    <div ref={headerRef} className="header">
      <div className="header__wrap container">
        <div className="logo">
          <img src={logo} alt="logo" />
          <Link to={`/${Config.HOME_PAGE}`}>hMovies</Link>
        </div>

        <ul className="header__nav">
          {headerNav.map((e, i) => (
            <li key={i} className={`${i === active ? "active" : ""}`}>
              <Link to={e.path}>{e.display}</Link>
            </li>
          ))}

          {!user ? (
            <li className={pathname.includes("/login") ? "active" : ""}>
              <Link to={`/${Config.HOME_PAGE}/login`}>Login</Link>
            </li>
          ) : (
            <>
              {user.role === "admin" && (
                <li className={pathname.includes("/admin") ? "active" : ""}>
                  <Link to={`/${Config.HOME_PAGE}/admin`}>Admin</Link>
                </li>
              )}
              <li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  Logout
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
