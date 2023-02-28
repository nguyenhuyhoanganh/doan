import React from "react";
import icons from "../utils/icons"
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const {GrCaretNext} = icons

const HomeContainer = () => {
  const { friday } = useSelector((state) => {
    return state.app
  });
  // const [listTH, setListTH] = useState(null)
  // setListTH(friday?.items)
  // console.log(friday)
  const navigate = useNavigate()

  const handleClickPlaylist = (link) => {
    const albumPath = link.split('.')[0]
    console.log(albumPath)
    navigate(albumPath)
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <span className="font-semibold text-lg">Mới phát hành</span>
        <div className="flex gap-4 ">
          <span className="border border-gray-300 rounded-lg p-1 px-6 shadow-lg bg-main-400">
            Tất cả
          </span>
          <span className="border border-gray-300 rounded-lg p-1 px-6 shadow-lg">
            Việt Nam
          </span>
          <span className="border border-gray-300 rounded-lg p-1 px-6 shadow-lg">
            Quốc tế
          </span>
        </div>
      </div>
      {/* 3 hàng mỗi hàng 4 bài */}
      <div className="flex w-[100%] justify-between p-5 ">
        <div className="flex flex-col h-full w-[30%]">
          {[1, 2, 3, 4].map((el) => {
            return (
              <div key={el} className="flex gap-6 bg-main-200 border border-[#CED9D9] shadow-lg w-[100%] rounded-lg">
                <span className="absolute pt-3 pl-[30px]">
                  <GrCaretNext size={24} />
                </span>
                <img
                  src=""
                  className="w-12 h-12 object-cover rounded-md ml-4"
                />
                <div className="flex flex-col gap-1 pl-2">
                  <span className="font-bold text-[#111010]">Tên bài hát</span>
                  <span className="text-sm text-[#171e1e]">Nghệ sỹ</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col h-full border border-red-500 w-[30%]">
        {[1, 2, 3, 4].map((el) => {
            return (
              <div key={el} className="flex gap-6 bg-main-200 border border-[#CED9D9] shadow-lg w-[100%] rounded-lg">
                <span className="absolute pt-3 pl-[30px]">
                  <GrCaretNext size={24} />
                </span>
                <img
                  src=""
                  className="w-12 h-12 object-cover rounded-md ml-4"
                />
                <div className="flex flex-col gap-1 pl-2">
                  <span className="font-bold text-[#111010]">Tên bài hát</span>
                  <span className="text-sm text-[#171e1e]">Nghệ sỹ</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col h-full border border-red-500 w-[30%]">
        {[1, 2, 3, 4].map((el) => {
            return (
              <div key={el} className="flex gap-6 bg-main-200 border border-[#CED9D9] shadow-lg w-[100%] rounded-lg">
                <span className="absolute pt-3 pl-[30px]">
                  <GrCaretNext size={24} />
                </span>
                <img
                  src=""
                  className="w-12 h-12 object-cover rounded-md ml-4"
                />
                <div className="flex flex-col gap-1 pl-2">
                  <span className="font-bold text-[#111010]">Tên bài hát</span>
                  <span className="text-sm text-[#171e1e]">Nghệ sỹ</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        {/* có thể bạn muốn nghe */}
        <span className="font-semibold text-lg">{friday?.title}</span>
        <div className="flex gap-3 justify-between cursor-pointer">
          {/* list bài hát gợi ý */}
          {friday && friday?.items?.map((item, index) => {
            return (
              <div 
              onClick={() => {handleClickPlaylist(item.link)}}
              key={index} className="flex flex-col w-[20%] items-center gap-2 text-center hover:shadow-md">
                <img className="object-cover h-auto w-full rounded-sm" src={item.thumbnail} alt="ảnh"></img>
                <span className="font-semibold text-[12px]">{item.title}</span>
                <span className="text-gray-500 text-[10px]">{item.artistsNames}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeContainer;
