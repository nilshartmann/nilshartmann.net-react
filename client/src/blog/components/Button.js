import React from "react";
import { Link } from "react-router";

export default function Button({ onClick, linkTo, children }) {
  if (onClick) {
    return (
      <a className="Button" onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link to={linkTo} className="Button">
      {children}
    </Link>
  );
}
