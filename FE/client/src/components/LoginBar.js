import React from "react";
import icons from "../utils/icons";
import { NavLink } from "react-router-dom";

const { RiVipFill } = icons;
const LoginBar = () => {
  const loginImg = document.getElementById("loginImg");
  return (
    <div className="h-10 border flex rounded-md hover:shadow-md hover:bg-main-300 cursor-pointer">
      <div>
        <span>
          <RiVipFill size={24} color="gray" />
        </span>
      </div>
      <div id="loginImg" className="relative">
        <img
          className="object-contain w-10 hover:flex"
          src="https://avatar.talk.zdn.vn/default.jpg"
          alt=""
        />
        <div
          id="userInfo"
          className="bg-[#C0D8D8] h-[200px] w-[150px] absolute top-[40px] right-0 z-40 flex-col gap-2 items-center p-2 hidden"
        >
          <NavLink className="hover:bg-gray-500" to="/" end="">
            <span className="hover:bg-gray-400 text-[20px] px-5 border border-[#0D7373]">
              Thông tin
            </span>
          </NavLink>
          <NavLink className="hover:bg-gray-500" to="/" end="">
            <span className="hover:bg-gray-400 text-[20px] px-5 border border-[#0D7373]">
              PageLoad
            </span>
          </NavLink>
          <NavLink className="hover:bg-gray-500" to="/" end="">
            <span className="hover:bg-gray-400 text-[20px] px-5 border border-[#0D7373]">
              Đăng xuất
            </span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default LoginBar;
