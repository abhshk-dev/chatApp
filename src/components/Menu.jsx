import React, { useEffect, useRef } from "react";


const Menu = ({ deleteChat, id, isSelfMessage,showMenu }) => {

  const dropdown=useRef(null);

  useEffect(()=>{
    if (!dropdown.current) return
        let spaceAbove=dropdown.current.getBoundingClientRect().top;
        
        let el =document.getElementById('chat');
        
        const spaceBelow = el.offsetHeight - dropdown.current.getBoundingClientRect().bottom;
        

        if (spaceBelow < dropdown.current.clientHeight && spaceAbove > spaceBelow) {
          // Display above
          dropdown.current.style.bottom = "100%";
          dropdown.current.style.top = "auto";
      } else {
          // Display below
          dropdown.current.style.top = "100%";
          dropdown.current.style.bottom = "auto";
      }

  },[showMenu])
  
  return (
    <>
      
        <ul ref={dropdown} className="dropdown bg-[#f3e7ee] absolute rounded-md shadow-2xl border border-[#11090d] border-opacity-20 right-2 bottom-11 z-10  py-2 min-w-[120px] flex justify-center items-start flex-col">
          <li className="hover:bg-slate-500 hover:text-white w-full hover:transition-all">
            <button className="px-5">Reply</button>
          </li>
          <li className="hover:bg-slate-500 hover:text-white w-full hover:transition-all">
            <button className="px-5">React</button>
          </li>
          {isSelfMessage ? (
            <li onClick={()=>deleteChat(id)} className="hover:bg-slate-500 hover:text-white w-full hover:transition-all">
              <button className="px-5">Delete</button>
            </li>
          ) : null}
        </ul>
      
    </>
  );
};
export default Menu;
