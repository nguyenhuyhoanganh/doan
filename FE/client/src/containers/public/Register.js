import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import path from "../../utils/path";
import { useForm } from "react-hook-form";
import { registerSchema } from "../../utils/validate.form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as apis from "../../apis"
import { AuthContext } from "../../contexts/auth.context";
import {useMutation} from "@tanstack/react-query"
import { HttpStatusCode, isAxiosError } from "axios";
import {omit} from "lodash"

const Register = () => {
  const registerMutation = useMutation({mutationFn: body => apis.register(body)})
  const { setIsAuthenticated, setProfile} = useContext(AuthContext)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) });
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputRePass, setInputRePass] = useState("");
  const navigate = useNavigate();
  const handleRegister = handleSubmit((data) => {
    // loại bỏ 
    const body = omit(data, ['confirm_password'])
    registerMutation.mutate(body, {onSuccess: (data) => {
      setIsAuthenticated(true)
      setProfile(data.data.data.user)
      navigate('/')
    }, onError: (err) => {
      if(isAxiosError(err) && err.response?.status === HttpStatusCode.UnprocessableEntity){
        const error = err.response?.data?.error
        if(error){
          Object.keys(error).forEach(key => setError(key, {message: error[key]}))
        }
      }
    }})
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
        <form onSubmit={handleRegister} noValidate className="flex flex-col w-[400px] h-[500px] text-[#38d1d1] bg-slate-600 z-50 gap-5 p-5">
          <h1 className="flex justify-center">ĐĂNG KÍ TÀI KHOẢN</h1>
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
            <label httpfor="pass-input">Mật khẩu:</label>
            <input
            {...register("password")}
              className="w-[80%] rounded-md p-1"
              type="text"
              id="pass-input"
              name="password"
            />
          </div>
          <span>{errors.password?.message}</span>
          <div className="flex items-center justify-between">
            <label httpfor="confirm-pass-input">Nhập lại mật khẩu:</label>
            <input
              {...register("confirm_password")}
              className="w-[80%] rounded-md p-1"
              type="text"
              id="confirm-pass-input"
              name="confirm_password"
            />
          </div>
          <span>{errors.confirm_password?.message}</span>
          <button
          type="submit"
            className="rounded-lg hover:bg-[#38d1d1] hover:text-[#fff] border border-[#000] p-3 "
          >
            Đăng Kí
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

export default Register;
