import React, { useEffect } from "react";
import icons from "../utils/icons";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SkeletonCard from "./SkeletonCard";
import handleTime from "../utils/formatDuration";

const { TbPlayerTrackNext } = icons;
var fakeWaitAPI;
const HomeContainer = () => {
  const [skeleton, setSkeleton] = useState(true);
  const { friday, top10 } = useSelector((state) => {
    return state.app;
  });
  // console.log(top10)
  // const [listTH, setListTH] = useState(null)
  // setListTH(friday?.items)
  // console.log(friday)
  const setList = () => {
    setSkeleton(false);
    fakeWaitAPI && clearTimeout(fakeWaitAPI);
  };
  useEffect(() => {
    fakeWaitAPI = setTimeout(setList, 1000);
    // console.log('reset')
  }, []);
  const navigate = useNavigate();

  const handleClickPlaylist = (link) => {
    const albumPath = link.split(".")[0];
    console.log(albumPath);
    navigate(albumPath);
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5">
        <span className="font-semibold text-[24px] text-[#0D7373]">
          Mới phát hành
        </span>
      </div>
      {/* 3 hàng mỗi hàng 4 bài */}
      <div className="flex flex-col w-[100%] justify-between p-5 gap-2 cursor-pointer">
        {friday.map((el, index) => {
          return (
            <div
              key={index}
              className="flex gap-6 rounded-md bg-main-200 justify-between items-center border border-[#CED9D9] shadow-lg w-[100%] hover:shadow-lg hover:bg-main-400"
            >
              <span className="absolute pt-3 pl-[30px] top-0 left-0 hover:opacity-100 opacity-0 text-[#fff]">
                <TbPlayerTrackNext size={24} />
              </span>
              <div className="flex">
                <img
                  src={el?.imageUrl}
                  className="w-12 h-12 object-cover rounded-md ml-4"
                />
                <div className="flex flex-col gap-1 pl-2">
                  <span className="font-bold text-[#111010]">{el.title}</span>
                  <span className="text-sm text-[#171e1e]">
                    {el.artists[0].fullName}
                  </span>
                </div>
              </div>
              <span>{handleTime(el.duration)}</span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-5">
        <span className="font-semibold text-[24px] text-[#0D7373]">
          Nhiều lượt nghe nhất
        </span>
      </div>
      <div className="flex flex-col w-[100%] justify-between p-5 gap-2 cursor-pointer">
        {top10.map((el, index) => {
          return (
            <div
              key={index}
              className="flex gap-6 rounded-md bg-main-200 justify-between items-center border border-[#CED9D9] shadow-lg w-[100%] hover:shadow-lg hover:bg-main-400"
            >
              <span className="absolute pt-3 pl-[30px] top-0 left-0 hover:opacity-100 opacity-0 text-[#fff]">
                <TbPlayerTrackNext size={24} />
              </span>
              <div className="flex">
                <img
                  src={el?.imageUrl}
                  className="w-12 h-12 object-cover rounded-md ml-4"
                />
                <div className="flex flex-col gap-1 pl-2">
                  <span className="font-bold text-[#111010]">{el.title}</span>
                  <span className="text-sm text-[#171e1e]">
                    {el.artists[0].fullName}
                  </span>
                </div>
              </div>
              <span>{handleTime(el.duration)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeContainer;
