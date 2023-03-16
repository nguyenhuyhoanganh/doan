import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import path from "../../utils/path"

const Login = () => {
  const navigate = useNavigate();
  const handleLogIn = () => {
    if (false) {
        // check account exist
      navigate("/home");
    } else {
        toast.error('Mật khẩu sai!')
    }
  };
  return (
    <div className="flex h-screen w-auto">
      <div 
      onClick={() => {
        window.history.back()
      }}
      className="absolute top-0 left-0 right-0 bottom-0 bg-gray-300 bg-opacity-80 h-screen w-screen flex z-40"></div>
      <div className="flex w-full">
        <div className="flex flex-col w-[400px] h-[500px] text-[#38d1d1] bg-slate-600 z-50 gap-5 p-5">
          <h1 className="flex justify-center">ĐĂNG NHẬP</h1>
          <div className="flex items-center justify-between ">
            <label for="email-input">Email:</label>
            <input
              className="w-[80%] rounded-md p-1"
              type="email"
              id="email-input"
              name="email"
            />
          </div>
          <div className="flex items-center justify-between">
            <label for="email-input">Mật khẩu:</label>
            <input
              className="w-[80%] rounded-md p-1"
              type="password"
              id="pass-input"
              name="password"
            />
          </div>
          <button
            onClick={handleLogIn}
            className="rounded-lg hover:bg-[#38d1d1] hover:text-[#fff] border border-[#000] p-3 "
          >
            Đăng Nhập
          </button>
        </div>
        <div className="h-[500px] w-[600px] z-50 bg-slate-700">
          <div className="flex flex-col items-center gap-20">
            <h1 className="text-[30px] font-bold text-[#38d1d1]">
              WELCOME TO ALAHA MUSIC
            </h1>
            <img
              alt="err"
              className="object-cover rounded-md w-[50%] h-auto"
              src={process.env.PUBLIC_URL + "/LOGO.png"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
