import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import { useLocation } from "react-router-dom";

const Header = ({ title, toggleForm, isVisibleForm }) => {
  const location = useLocation();
  return (
    <header className="header">
      <h1 className="title">{title}</h1>
      {location.pathname === "/" && (
        <Button
          color={isVisibleForm ? "red" : "green"}
          text={isVisibleForm ? "Close" : "Add"}
          onClick={toggleForm}
        />
      )}
    </header>
  );
};

Header.defaultProps = {
  title: "Task Tracker",
};
Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
