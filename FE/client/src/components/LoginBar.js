import React from "react";
import icons from "../utils/icons";
import { NavLink } from "react-router-dom";

const { RiVipFill, BiInfoCircle, BiLogOutCircle, BiLogInCircle } = icons;
const LoginBar = () => {
  const loginImg = document.getElementById("loginImg");
  // const user = {
  //   name: "Hô hô",
  //   img: "https://avatar.talk.zdn.vn/default.jpg",
  // };
  const user = null
  return (
    <div className="h-10 border flex rounded-md hover:shadow-md hover:bg-main-300 cursor-pointer">
      {user ? (
        <div id="loginImg" className="relative" title={user.name}>
          <img
            className="object-contain w-10 hover:flex"
            src={user.img}
            alt=""
          />
          <div
            id="userInfo"
            className="bg-main-100 h-[100px] w-[180px] shadow-sm absolute top-[40px] right-0 z-40 flex-col gap-2 justify-center items-center p-2 flex"
          >
            <NavLink
              className="hover:bg-main-400 hover:text-[#fff] flex items-center"
              to="/"
              end=""
            >
              <span>
                <BiInfoCircle size={24} />
              </span>
              <span className="hover:bg-main-400 text-[20px] px-5">
                Thông tin
              </span>
            </NavLink>
            <NavLink
              className="hover:bg-main-400 hover:text-[#fff] flex items-center"
              to="/"
              end=""
            >
              <span>
                <BiLogOutCircle size={24} />
              </span>
              <span className="hover:bg-main-400 text-[20px] px-5">
                Đăng xuất
              </span>
            </NavLink>
          </div>
        </div>
      ) : (
        <div id="loginImg" className="relative">
          <img
            className="object-contain w-10 hover:flex"
            src="https://avatar.talk.zdn.vn/default.jpg"
            alt=""
          />
          <div
            id="userInfo"
            className="bg-main-100 h-[100px] w-[180px] shadow-sm absolute top-[40px] right-0 z-40 flex-col gap-2 justify-center items-center p-2 flex"
          >
            <NavLink
              className="hover:bg-main-400 hover:text-[#fff] flex items-center"
              to="/"
              end=""
            >
              <span>
                <BiInfoCircle size={24} />
              </span>
              <span className="hover:bg-main-400 text-[20px] px-5">
                Thông tin
              </span>
            </NavLink>
            <NavLink
              className="hover:bg-main-400 hover:text-[#fff] flex items-center"
              to="/login"
              end=""
            >
              <span>
                <BiLogInCircle size={24} />
              </span>
              <span className="hover:bg-main-400 text-[20px] px-5">
                Đăng nhập
              </span>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginBar;
