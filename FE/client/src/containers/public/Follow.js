import React from "react";

const Follow = () => {
  return (
    <div className="w-full flex flex-col gap-10">
      <div className="border border-red-500 gap-5 flex flex-col">
        <h1 className="font-extrabold text-[30px] text-[#0D7373]">NGHỆ SĨ</h1>
        {/* list ảnh nghệ sĩ */}
        <div className="flex gap-5 items-center">
          <img
            src=""
            alt="ảnh nghệ sĩ"
            className="w-[20%] h-[200px] object-cover rounded-sm"
          ></img>
          <img
            src=""
            alt="ảnh nghệ sĩ"
            className="w-[20%] h-auto object-cover rounded-sm"
          ></img>
          <img
            src=""
            alt="ảnh nghệ sĩ"
            className="w-[20%] h-auto object-cover rounded-sm"
          ></img>
          <img
            src=""
            alt="ảnh nghệ sĩ"
            className="w-[20%] h-auto object-cover rounded-sm"
          ></img>
          <img
            src=""
            alt="ảnh nghệ sĩ"
            className="w-[20%] h-auto object-cover rounded-sm"
          ></img>
        </div>
      </div>
      <div className="border border-blue-500 flex flex-col">
        <h1 className="font-extrabold text-[30px] text-[#0D7373]">NHẠC SĨ</h1>
        <div className="flex gap-5 items-center">
          <img
            src=""
            alt="ảnh nhạc sĩ"
            className="w-[20%] h-[200px] object-cover rounded-sm"
          ></img>
          <img
            src=""
            alt="ảnh nhạc sĩ"
            className="w-[20%] h-auto object-cover rounded-sm"
          ></img>
          <img
            src=""
            alt="ảnh nhạc sĩ"
            className="w-[20%] h-auto object-cover rounded-sm"
          ></img>
          <img
            src=""
            alt="ảnh nhạc sĩ"
            className="w-[20%] h-auto object-cover rounded-sm"
          ></img>
          <img
            src=""
            alt="ảnh nhạc sĩ"
            className="w-[20%] h-auto object-cover rounded-sm"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default Follow;
