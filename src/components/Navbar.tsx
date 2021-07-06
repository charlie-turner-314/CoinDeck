import React from "react";
import "./Navbar.css";
import add from "../icons/add.png";
import home from "../icons/home.png";

interface Props {
  addNewDeck: any;
}

const Navbar = (props: Props) => {
  return (
    <div className="navbar">
      <div className="nav-item">
        <img src={home} alt="home" />
      </div>
      <div className="nav-item" onClick={props.addNewDeck}>
        <img src={add} alt="add new deck" />
      </div>
      <div className="nav-item">Nav item</div>
    </div>
  );
};

export default Navbar;
