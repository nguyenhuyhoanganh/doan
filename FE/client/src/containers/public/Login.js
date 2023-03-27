import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import path from "../../utils/path";
import * as apis from "../../apis";
import { AuthContext } from "../../contexts/auth.context";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../utils/validate.form";
import { yupResolver } from "@hookform/resolvers/yup";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const navigate = useNavigate();
  const { setIsAuthenticated, setProfile } = useContext(AuthContext);

  // mới chạy ctrinh, đọc localstorage, nếu có => isAu = true, profile = {}
  // chưa từng đăng nhập, lC không có gì => isAu = null, profile = null
  const handleLogIn = handleSubmit((data) => {
    const login =  async (data) => {
        const res = await apis.login({
          email: data.email,
          password: data.password,
        });
        console.log(res)
        if (res?.status === 200) {
          // nghĩa là đã được xác thức
          // trc đấy là null
          setIsAuthenticated(true);
          setProfile(res?.data?.data?.user);
          // chuyển hướng trang
          navigate("/");
        }
      };
      login(data)
  })
  return (
    <div className="flex h-screen w-auto">
      <div
        onClick={() => {
          window.history.back();
        }}
        className="absolute top-0 left-0 right-0 bottom-0 bg-gray-300 bg-opacity-80 h-screen w-screen flex z-40"
      ></div>
      <div className="flex w-full">
        <form onSubmit={handleLogIn} noValidate className="flex flex-col w-[400px] h-[500px] text-[#38d1d1] bg-slate-600 z-50 gap-5 p-5">
          <h1 className="flex justify-center">ĐĂNG NHẬP</h1>
          <div className="flex items-center justify-between ">
            <label httpfor="email-input">Email:</label>
            <input
              {...register("email")}
              className="w-[80%] rounded-md p-1"
              type="email"
              id="email-input"
              name="email"
            />
          </div>
          <span>{errors.email?.message}</span>
          <div className="flex items-center justify-between">
            <label httpfor="email-input">Mật khẩu:</label>
            <input
              {...register("password")}
              
              className="w-[80%] rounded-md p-1"
              type="password"
              id="pass-input"
              name="password"
            />
          </div>
          <span>{errors.password?.message}</span>
          <button
            type="submit"
            className="rounded-lg hover:bg-[#38d1d1] hover:text-[#fff] border border-[#000] p-3 "
          >
            Đăng Nhập
          </button>
        </form>
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
