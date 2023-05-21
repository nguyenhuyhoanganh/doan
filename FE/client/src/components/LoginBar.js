import React, { useState, useRef, useEffect } from "react";
import icons from "../utils/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";
import * as apis from "../apis";


const { BiUserPlus, BiInfoCircle, BiLogOutCircle, BiLogInCircle } = icons;
const LoginBar = () => {
  const { profile, setIsAuthenticated, setProfile } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const handleClick = () => {
    setShow((pre) => !pre);
  };

  useEffect(() => {
    // Hàm xử lý sự kiện click bên ngoài của div1
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShow(false);
      }
    }

    // Đăng ký sự kiện click bên ngoài của div1
    document.addEventListener("mousedown", handleClickOutside);

    // Hủy đăng ký sự kiện khi component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  // const user = {
  //   name: "Hô hô",
  //   img: "https://avatar.talk.zdn.vn/default.jpg",
  // };
  const handleLogOut = async () => {
    const res = await apis.logout();
    if (res?.status === 200) {
      setIsAuthenticated(false);
      setProfile(null);
    }
    navigate("/");
  };

  return (
    <div className="h-10 border flex rounded-full hover:shadow-md hover:bg-main-300 cursor-pointer">
      {profile ? (
        <div id="loginImg" className="relative" title={profile?.firstName}>
          <img
            onClick={handleClick}
            className="object-contain rounded-full w-10 h-10 hover:flex"
            src={profile?.avatarUrl === undefined ? 'https://avatar.talk.zdn.vn/default.jpg' : profile?.avatarUrl}
            alt=""
          />
          {show && (
            <div
              ref={ref}
              id="userInfo"
              className="bg-main-100 h-[80px] w-[180px] shadow-sm absolute top-[40px] right-0 z-40 flex-col gap-2 justify-center items-center p-2"
            >
              <NavLink
                className="hover:bg-main-400 hover:text-[#fff] flex items-center"
                to="/userinfo"
                end=""
              >
                <span>
                  <BiInfoCircle size={24} />
                </span>
                <span className="hover:bg-main-400 text-[20px] px-5">
                  Thông tin
                </span>
              </NavLink>
              <button
                onClick={handleLogOut}
                className="hover:bg-main-400 hover:text-[#fff] flex items-center"
              >
                <span>
                  <BiLogOutCircle size={24} />
                </span>
                <span className="hover:bg-main-400 text-[20px] px-5">
                  Đăng xuất
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div id="loginImg" className="relative">
          <img
            onClick={handleClick}
            className="object-contain w-10 hover:flex"
            src="https://avatar.talk.zdn.vn/default.jpg"
            alt=""
          />
          {show && (
            <div
              ref={ref}
              id="userInfo"
              className="bg-main-100 h-[80px] w-[180px] shadow-sm absolute top-[40px] right-0 z-40 flex-col gap-2 justify-center items-center p-2"
            >
              {/* <NavLink
                className="hover:bg-main-400 hover:text-[#fff] flex items-center"
                to="/userinfo"
                end=""
              >
                <span>
                  <BiInfoCircle size={24} />
                </span>
                <span className="hover:bg-main-400 text-[20px] px-5">
                  Thông tin
                </span>
              </NavLink> */}
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
              <NavLink
                className="hover:bg-main-400 hover:text-[#fff] flex items-center"
                to="/register"
                end=""
              >
                <span>
                  <BiUserPlus size={24} />
                </span>
                <span className="hover:bg-main-400 text-[20px] px-5">
                  Đăng Kí
                </span>
              </NavLink>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginBar;
