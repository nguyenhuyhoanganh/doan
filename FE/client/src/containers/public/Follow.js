import React, { useEffect, useState } from "react";
import icons from "../../utils/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Follow = () => {
  const { GrPrevious, GrNext } = icons;
  const navigate = useNavigate()
  let setTimeOutId;
  const {artists, composers} = useSelector(state => state.app)
  const handleNext = () => {
    setTimeOutId && clearInterval(setTimeOutId);
    const slider = document.getElementById("slider");
    let scrollDistance = 940; // khoảng cách sẽ trượt (px)
    let speed = 940 / 50;
    let count = 0;
    setTimeOutId = setInterval(() => {
      count += 940 / 50;
      slider.scrollLeft += speed;
      if (Math.ceil(count) === scrollDistance) {
        setTimeOutId && clearInterval(setTimeOutId);
      }
    }, 20);
  };
  const handleNext2 = () => {
    setTimeOutId && clearInterval(setTimeOutId);
    const slider = document.getElementById("slider2");
    let scrollDistance = 940; // khoảng cách sẽ trượt (px)
    let speed = 940 / 50;
    let count = 0;
    setTimeOutId = setInterval(() => {
      count += 940 / 50;
      slider.scrollLeft += speed;
      if (Math.ceil(count) === scrollDistance) {
        setTimeOutId && clearInterval(setTimeOutId);
      }
    }, 20);
  };
  const handlePrev = () => {
    setTimeOutId && clearInterval(setTimeOutId);
    const slider = document.getElementById("slider");
    let scrollDistance = 940; // khoảng cách sẽ trượt (px)
    let speed = 940 / 50;
    let count = 0;
    setTimeOutId = setInterval(() => {
      count += 940 / 50;
      slider.scrollLeft -= speed;
      if (Math.ceil(count) === scrollDistance) {
        setTimeOutId && clearInterval(setTimeOutId);
      }
    }, 20);
  };
  const handlePrev2 = () => {
    setTimeOutId && clearInterval(setTimeOutId);
    const slider = document.getElementById("slider2");
    let scrollDistance = 940; // khoảng cách sẽ trượt (px)
    let speed = 940 / 50;
    let count = 0;
    setTimeOutId = setInterval(() => {
      count += 940 / 50;
      slider.scrollLeft -= speed;
      if (Math.ceil(count) === scrollDistance) {
        setTimeOutId && clearInterval(setTimeOutId);
      }
    }, 20);
  };
  return (
    <div className="w-full flex flex-col gap-10 pl-4">
      <div className="gap-5 flex flex-col ">
        <h1 className="font-extrabold text-[30px] text-[#0D7373]">NGHỆ SĨ</h1>

        {/* list ảnh nghệ sĩ */}
        <div className="relative">
          <div
            id="slider"
            className="flex justify-between gap-2 relative p-2 overflow-x-hidden transition-all"
          >
            {composers?.map((el, index) => {
              return (
                <img
                  key={index}
                  title={el?.fullName}
                  src={el?.backgroundImageUrl}
                  onClick={()=>{
                    navigate(`/artist/${el?.slug}/${el?.id}`)
                  }}
                  alt="ảnh nghệ sĩ"
                  className="w-[180px] rounded-full object-contain cursor-pointer animate-slide-left"
                ></img>
              );
            })}
          </div>
          <div
            onClick={handlePrev}
            className="w-10 h-10 flex justify-center items-center cursor-pointer rounded-full bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.8)]  z-10 absolute top-1/2 left-0 transform -translate-y-1/2"
          >
            <GrPrevious size={30}></GrPrevious>
          </div>
          <div
            onClick={handleNext}
            className="w-10 h-10 flex justify-center items-center cursor-pointer rounded-full bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.8)]  z-10 absolute top-1/2 right-0 transform -translate-y-1/2"
          >
            <GrNext size={30}></GrNext>
          </div>
        </div>
      </div>

      <div className="gap-5 flex flex-col">
        <h1 className="font-extrabold text-[30px] text-[#0D7373]">NHẠC SĨ</h1>
        <div className="relative">
          <div id="slider2" className="flex gap-5 items-center overflow-x-hidden">
            {artists?.reverse().map((el, index) => {
              return (
                <img
                  key={index}
                  title={el?.fullName}
                  src={el?.backgroundImageUrl}
                  onClick={()=>{
                    navigate(`/composer/${el?.slug}/${el?.id}`)
                  }}
                  alt="ảnh nghệ sĩ"
                  className="w-[180px] rounded-full object-contain cursor-pointer animate-slide-left"
                ></img>
              );
            })}
          </div>
          <div
            onClick={handlePrev2}
            className="w-10 h-10 flex justify-center items-center cursor-pointer rounded-full bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.8)]  z-10 absolute top-1/2 left-0 transform -translate-y-1/2"
          >
            <GrPrevious size={30}></GrPrevious>
          </div>
          <div
            onClick={handleNext2}
            className="w-10 h-10 flex justify-center items-center cursor-pointer rounded-full bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.8)]  z-10 absolute top-1/2 right-0 transform -translate-y-1/2"
          >
            <GrNext size={30}></GrNext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Follow;
