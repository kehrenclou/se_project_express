/* --------------------------------- imports -------------------------------- */

import { Route, Link, useRouteMatch } from "react-router-dom";
import { useState } from "react";
import headerlogo from "../images/headerlogo.svg";

import { useUser, useAuth } from "../hooks";
/* ----------------------------- function Header ---------------------------- */
function Header() {
  /* -------------------------------- useState -------------------------------- */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  /* ---------------------------------- hooks --------------------------------- */
  const { path, url } = useRouteMatch();
  const { currentUser } = useUser();
  const { onSignOut } = useAuth();
  /* -------------------------------- handlers -------------------------------- */
  const handleSignOut = () => {
    onSignOut();
  };

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };
  const handleCloseClick=()=>{
    setIsMenuOpen(false);
  }

  /* --------------------------------- return --------------------------------- */
  return (
    <header className={`header ${isMenuOpen ? "header__menu" : ""}`}>
      <img
        className="header__logo"
        src={headerlogo}
        alt="Graphic Around the World in the US"
      />
      <Route path={`${path}/`}>
        <div
          className={`${
            isMenuOpen ? "header__sub-container_open" : "header__sub-container"
          }`}
        >
          {currentUser ? (
            <div
              className={`header__text${isMenuOpen ? "header__menu_open" : ""}`}
            >
              {currentUser.email}
            </div>
          ) : null}
          <Link
            to={`${url}signin`}
            className={`header__link header__link_light ${
              isMenuOpen ? "header__menu_open" : ""
            }`}
            onClick={handleSignOut}
          >
            Log out
          </Link>
        </div>

        {isMenuOpen ? (
          <button className="header__btn header__btn_open" onClick={handleCloseClick}></button>
        ) : (
          <button
            className="header__btn header__btn_closed"
            onClick={handleMenuClick}
          ></button>
        )}
        {/* <button
          className={`header__btn ${
            isMenuOpen ? "header__btn_open" : "header__btn_closed"
          }`}
        ></button> */}
      </Route>

      <Route path={`${path}signup`}>
        <Link to={`${url}signin`} className="header__link">
          Log in
        </Link>
      </Route>

      <Route path={`${path}signin`}>
        <Link to={`${url}signup`} className="header__link">
          Sign Up
        </Link>
      </Route>
    </header>
  );
}

/* --------------------------------- exports -------------------------------- */
export default Header;
