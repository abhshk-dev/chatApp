import React from "react";
import { useState } from "react";
import IconArrowUpSLine from "./IconArrowUpSLine";

const Menu = ({ deleteChat, id }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <button id="menu" onClick={handleClick}>
      {showMenu ? (
        <select name="" id="">
          <option value="Delete" onSelect={deleteChat(id)}>
            Delete
          </option>
          <option value="Reply">Reply</option>
          <option value="React">React</option>
        </select>
      ) : (
        <IconArrowUpSLine />
      )}
    </button>
  );
};
export default Menu;
