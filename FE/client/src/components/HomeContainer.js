import React, { useEffect } from "react";
import icons from "../utils/icons";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SkeletonCard from "./SkeletonCard";
import handleTime from "../utils/formatDuration";
import List from "../components/List"

const { FaRegPlayCircle } = icons;
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
        <List songs={friday} />
      </div>
      <div className="flex flex-col gap-5">
        <span className="font-semibold text-[24px] text-[#0D7373]">
          Nhiều lượt nghe nhất
        </span>
      </div>
      <div className="flex flex-col w-[100%] justify-between p-5 gap-2 cursor-pointer">
        <List songs={top10} />
      </div>
    </div>
  );
};

export default HomeContainer;
