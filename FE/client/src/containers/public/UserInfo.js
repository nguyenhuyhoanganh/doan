import React, { useContext, useState } from "react";
import icons from "../../utils/icons";
import { AuthContext } from "../../contexts/auth.context";
import { useMutation } from "@tanstack/react-query";
import fileApi from "../../apis/file";
import { toast } from "react-toastify";
import * as apis from "../../apis";
import { useEffect } from "react";
import { setProfileToLocalStorage } from "../../utils/auth";

const UserInfo = () => {
  const { BsPen } = icons;
  const [isChooseImg, setIsChooseImg] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const { profile, setProfile } = useContext(AuthContext);
  const [isEdit, setIsEdit] = useState(false);
  const [email, setEmail] = useState(profile?.email);
  const [firstName, setFirstName] = useState(profile?.firstName);
  const [lastName, setLastName] = useState(profile?.lastName);
  const [emailValid, setEmailValid] = useState("");
  const [firstNameValid, setFirstNameValid] = useState("");
  const [lastNameValid, setLastNameValid] = useState("");
  const roles = profile?.roles?.map((el) => el.roleName);
  const [isChangeAvatar, setIsChangeAvatar] = useState(false);
  const [avatarChanged, setAvatarChanged] = useState(null);

  useEffect(() => {
    if ("avatarUrl" in profile) {
      setBackgroundImage(profile?.avatarUrl);
    }
  }, []);
  const handleEdit = () => {
    setIsEdit(true);
  };
  const handleUpdate = () => {
    if (isEdit) {
    } else {
      toast.warning("Hãy nhấn chỉnh sửa trước");
    }
    if (!firstNameValid && !lastNameValid && !emailValid) {
      // khi rỗng
      const fetchUpdate = async () => {
        const res = await apis.updateInfo(profile?.id, {
          email: email,
          firstName: firstName,
          lastName: lastName,
        });
        setProfile(res?.data?.data);
      };
      fetchUpdate();
      setIsEdit(false);
    } else {
      toast.warning("Kiểm tra lại thông tin hợp lệ");
    }
  };

  const hanldeChooseFileImg = (event) => { 
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setBackgroundImage(e.target.result);
      file && setAvatarChanged(file);
      setIsChangeAvatar(true);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleChangeImg = () => {
    setIsChooseImg(true);
  };

  const uploadFilesMutation = useMutation({
    mutationFn: async (files) => {
      const fileUploadPromises = files.map((file) => {
        return file.name !== "fileUpload"
          ? fileApi.uploadFile(file)
          : undefined;
      });
      const results = await Promise.all(fileUploadPromises);
      return results;
    },
  });
  const handleAccept = async () => {
    if (isChangeAvatar === true) {
      const uploadResponse = await uploadFilesMutation.mutateAsync([
        avatarChanged,
      ]);
      const avatarUrl =
        uploadResponse[0] !== undefined
          ? uploadResponse[0].data.data.download_url
          : undefined;
      // update profile
      const fetchUpdateImage = async () => {
        const res = await apis.updateInfo(profile?.id, {
          avatarUrl: avatarUrl,
        });
        setProfile(res?.data?.data);
        // update lại LCS, có avatarUrl = avatarUrl
        setProfileToLocalStorage(res?.data?.data);
      };
      fetchUpdateImage();
      setIsChooseImg(false);
      isChangeAvatar(false);
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
          onClick={handleChangeImg}
          size={30}
          className="absolute cursor-pointer top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#230e0e] text-center group-hover:flex hidden"
        />
      </div>
      {isChooseImg ? (
        <div className="fixed top-1/2 transform -translate-y-1/2 left-1/2 bg-main-300 p-2 -translate-x-1/2 w-[400px] h-[400px] border shadow-md rounded-lg z-10">
          <div className="flex flex-col justify-center gap-3 items-center h-[100%] w-[100%]">
            <h1 className="font-extrabold text-[20px] text-[#0D7373]">
              Chọn ảnh nền
            </h1>
            <div
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onLoad={120}
              onResize={120}
              className="w-[80%] h-[90%] m-auto bg-white rounded-md items-center flex justify-center"
            >
              <div
                onClick={() => document.getElementById("fileInput").click()}
                className="flex w-[300px] h-[300px] items-center justify-center cursor-pointer rounded-full bg-[rgba(0,0,0,0.1)]"
              >
                {backgroundImage ? null : "Chọn ảnh nền"}
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  accept=".jpg,.png"
                  onChange={(e) => hanldeChooseFileImg(e)}
                />
              </div>
            </div>
            <div className="flex gap-5">
              <button
                disabled={!isChangeAvatar}
                onClick={() => handleAccept()}
                className={`border border-green-500 rounded-md ${!isChangeAvatar? "cursor-not-allowed": "cursor-pointer hover:bg-green-500"} px-4`}
              >
                Xác nhận
              </button>
              <div
                onClick={() => setIsChooseImg(false)}
                className="border border-red-500 hover:bg-red-500 rounded-md cursor-pointer px-4"
              >
                Hủy
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
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
