import React, { useContext, useState } from "react";
import icons from "../../utils/icons";
import { AuthContext } from "../../contexts/auth.context";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../utils/validate.form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as apis from "../../apis";

const UserInfo = () => {
  const { BsPen } = icons;
  const { profile, setProfile } = useContext(AuthContext);
  const [isEdit, setIsEdit] = useState(false);
  const [email, setEmail] = useState(profile?.email);
  const [firstName, setFirstName] = useState(profile?.firstName);
  const [lastName, setLastName] = useState(profile?.lastName);
  const [emailValid, setEmailValid] = useState("");
  const [firstNameValid, setFirstNameValid] = useState("");
  const [lastNameValid, setLastNameValid] = useState("");
  const roles = profile?.roles?.map((el) => el.roleName);
  console.log(profile)
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({ resolver: yupResolver(loginSchema) });
  const handleEdit = () => {
    setIsEdit(true);
  };
  const handleUpdate = () => {
    if(isEdit){

    } else {
      toast.warning('Hãy nhấn chỉnh sửa trước')
    }
    if (!firstNameValid && !lastNameValid && !emailValid) {
      // khi rỗng
      const fetchUpdate = async () => {
        const res = await apis.updateInfo(profile?.id, {
          email: email,
          firstName: firstName,
          lastName: lastName,
        });
        console.log(res)
        setProfile(res?.data?.data)
      };
      fetchUpdate()
      setIsEdit(false);
    } else {
      toast.warning("Kiểm tra lại thông tin hợp lệ");
    }
  };
  return (
    <div
      // onSubmit={handleUpdate}
      noValidate
      className="flex flex-col w-full m-auto items-center text-center pt-[50px] gap-5 text-[20px]"
    >
      <div className="flex group relative">
        <img
          alt="ảnh nền"
          className="w-[200px] h-[200px] rounded-full border "
          src={
            profile?.avatarUrl !== null
              ? profile.avatarUrl
              : "https://avatar.talk.zdn.vn/default.jpg"
          }
        />
        <BsPen
          size={30}
          className="absolute cursor-pointer top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#230e0e] text-center group-hover:flex hidden"
        />
      </div>
      <div className="flex gap-4 w-[80%]">
        <label className="w-[40%] text-right">Chức vụ:</label>
        <label className="w-[60%] text-left">{roles.join(", ")}</label>
      </div>
      <div className="flex gap-4 w-[80%]">
        <label className="w-[40%] text-right">Email: </label>
        {isEdit ? (
          <input
            // {...register("email")}
            onChange={(e) => {
              const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
              if (emailRegex.test(e.target.value)) {
                setEmailValid("");
              } else {
                setEmailValid("Email không hợp lệ!");
              }
              setEmail(e.target.value);
            }}
            className="p-1 rounded-md focus:outline-none focus:boder-[#0D7373]"
            value={email}
          />
        ) : (
          <span className="w-[60%] text-left">{email}</span>
        )}
        <span className="text-[#bc3b3b]">{emailValid}</span>
      </div>
      <div className="flex gap-4 w-[80%]">
        <label className="w-[40%] text-right">First Name: </label>
        {isEdit ? (
          <input
            className="p-1 rounded-md focus:outline-none focus:boder-[#0D7373]"
            value={firstName}
            onChange={(e) => {
              const nameRegex = /^[\p{L}\s']+$/u;
              if (nameRegex.test(e.target.value)) {
                setFirstNameValid("");
              } else {
                setFirstNameValid("Tên không hợp lệ!");
              }
              setFirstName(e.target.value);
            }}
          />
        ) : (
          <span className="w-[60%] text-left">{firstName}</span>
        )}
        <span className="text-[#bc3b3b]">{firstNameValid}</span>
      </div>
      <div className="flex gap-4 w-[80%]">
        <label className="w-[40%] text-right">Last Name: </label>
        {isEdit ? (
          <input
            className="p-1 rounded-md focus:outline-none focus:boder-[#0D7373]"
            value={lastName}
            onChange={(e) => {
              const nameRegex = /^[\p{L}\s']+$/u;
              if (nameRegex.test(e.target.value)) {
                setLastNameValid("");
              } else {
                setLastNameValid("Tên không hợp lệ!");
              }
              setLastName(e.target.value);
            }}
          />
        ) : (
          <span className="w-[60%] text-left">{lastName}</span>
        )}
        <span className="text-[#bc3b3b]">{lastNameValid}</span>
      </div>
      <div className="flex gap-4 w-[80%] justify-center">
        <div
          onClick={handleEdit}
          className="flex border hover:bg-red-400 hover:text-[#fff] p-2 items-center gap-2"
        >
          <BsPen></BsPen>
          <button>Chỉnh sửa</button>
        </div>
        <div
          onClick={handleUpdate}
          className="flex border hover:bg-main-400 hover:text-[#fff] p-2 items-center gap-2"
        >
          <BsPen></BsPen>
          <button type="submit">Xác thực</button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
