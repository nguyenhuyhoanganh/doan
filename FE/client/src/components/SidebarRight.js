import React, { useState } from "react";
import icons from "../utils/icons";

const { BsToggleOff, BsToggleOn, GrCaretNext } = icons;
const SidebarRight = () => {
  const [autoPlay, setAutoPlay] = useState(false);
  const handleAutoButton = () => {
    setAutoPlay(!autoPlay);
    console.log(autoPlay);
  };
  const activeStyle = "";
  const notActiveStyle = "hidden";
  console.log("re-render");
  return (
    <div className="bg-main-200 h-full w-full flex flex-col">
      <div className="flex bg-main-300 rounded-lg justify-between h-8 gap-2 w-[80%] m-4 p-1 cursor-pointer">
        <div className="bg-[#E7ECEC] rounded-lg">
          <span>Danh sách phát</span>
        </div>
        <div>
          <span>Nghe gần đây</span>
        </div>
      </div>

      <div className="flex gap-6 bg-[#0E8080] border border-[#CED9D9] shadow-lg w-[100%] rounded-lg">
        <span className="absolute pt-3 pl-[30px]">
          <GrCaretNext size={24} />
        </span>
        <img src="" className="w-12 h-12 object-cover rounded-md ml-4" />
        <div className="flex flex-col gap-1 pl-2">
          <span className="font-bold text-[#fff]">Tên bài hát</span>
          <span className="text-sm text-[#e7e9e9]">Nghệ sỹ</span>
        </div>
      </div>

      <div className="flex pt-5 m-5 gap-10 justify-between">
        <div className="flex flex-col">
          <span className="font-semibold">Tự động phát</span>
          <span>Gợi ý nội dung phát</span>
        </div>
        <span
          className="flex items-center cursor-pointer"
          onClick={handleAutoButton}
        >
          <BsToggleOff
            size={24}
            className={(autoPlay) => (autoPlay ? activeStyle : notActiveStyle)}
          />
          <BsToggleOn size={24} className="hidden" />
        </span>
      </div>
      {/* map list recommend */}
      {[1, 2].map(() => {
        return (
          <div className="flex gap-6 bg-main-200 border border-[#CED9D9] shadow-lg w-[100%] rounded-lg">
            <span className="absolute pt-3 pl-[30px]">
              <GrCaretNext size={24} />
            </span>
            <img src="" className="w-12 h-12 object-cover rounded-md ml-4" />
            <div className="flex flex-col gap-1 pl-2">
              <span className="font-bold text-[#111010]">Tên bài hát</span>
              <span className="text-sm text-[#171e1e]">Nghệ sỹ</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarRight;
