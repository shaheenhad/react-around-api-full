import React from "react";
import { Link } from "react-router-dom";
import logoPath from "../images/around_logo.svg";

function Header(props) {
  return (
    <header className="header">
      <img className="logo" src={logoPath} alt="Around the U.S. Logo" />
      {props.linkText && (
        <Link className="header__link" to={props.linkTo}>
          {props.linkText}
        </Link>
      )}
      {props.userEmail && (
        <>
          <p className="header__link">{props.userEmail}</p>
          <Link
            className="header__link header__logout"
            onClick={props.logOut}
            to="/"
          >
            Log Out
          </Link>
        </>
      )}
    </header>
  );
}

export default Header;
