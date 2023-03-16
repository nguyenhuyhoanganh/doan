import React from "react";
import logo from "../assets/logo.svg";
import { sidebarMenu } from "../utils/menu";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import path from '../utils/path'

const notActiveStyle = "py-2 px-[25px] text-[#32323D] text-[13px] flex gap-3 items-center"
const activeStyle = "py-2 px-[25px] text-[#0F7070] text-[13px] flex gap-3 items-center"

const SidebarLeft = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col bg-main-100">
      <div onClick={() => {navigate(path.HOME)}} className="w-full h-full flex justify-start items-center cursor-pointer">
        <img src={process.env.PUBLIC_URL + "/LOGO_3.png"} alt="logo" className="w-full h-auto object-cover" />
      </div>
      <div className="flex flex-col">
        {sidebarMenu.map((item) => (
          <NavLink to={item.path} key={item.path} end={item.end} className={({isActive}) => isActive ? activeStyle : notActiveStyle}>
            {item.icons}
            <span className="hover:text-[#0F7070]">{item.text}</span>

          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SidebarLeft;
