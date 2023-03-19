import React, { useEffect, useState } from "react";
import * as apis from "../../apis";
import icons from "../../utils/icons";
import { useNavigate } from "react-router-dom";

const Follow = () => {
  const { GrPrevious, GrNext } = icons;
  const [page, setPage] = useState(0);
  const [items, setItems] = useState(null);
  const [composers, setComposers] = useState(null);
  const [artists, setArtists] = useState(null);
  const navigate = useNavigate()
  let setTimeOutId;
  useEffect(() => {
    const fetchComposers = async () => {
      const res = await apis.apiGetComposers();
      const res2 = await apis.apiGetArtists();
      if (res?.data.code === 200) {
        setComposers(res.data?.data);
      }
      if (res2.data?.code === 200) {
        setArtists(res?.data?.data);
      }
    };
    fetchComposers();
  }, []);
  // useEffect(() => {
  //   if (composers) {
  //     setItems(composers.slice(page * 5, page * 5 + 5));
  //   }
  // }, [page]);
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
    <div className="w-full flex flex-col gap-10">
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
                  className="w-[180px] rounded-full object-contain animate-slide-left"
                ></img>
              );
            })}
          </div>
          <div
            onClick={handlePrev}
            className="w-10 h-10 flex justify-center items-center rounded-full bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.8)]  z-10 absolute top-1/2 left-0 transform -translate-y-1/2"
          >
            <GrPrevious size={30}></GrPrevious>
          </div>
          <div
            onClick={handleNext}
            className="w-10 h-10 flex justify-center items-center rounded-full bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.8)]  z-10 absolute top-1/2 right-0 transform -translate-y-1/2"
          >
            <GrNext size={30}></GrNext>
          </div>
        </div>
      </div>

      <div className="gap-5 flex flex-col">
        <h1 className="font-extrabold text-[30px] text-[#0D7373]">NHẠC SĨ</h1>
        <div className="relative">
          <div id="slider2" className="flex gap-5 items-center overflow-x-hidden">
            {artists?.map((el, index) => {
              return (
                <img
                  key={index}
                  title={el?.fullName}
                  src={el?.backgroundImageUrl}
                  onClick={()=>{
                    navigate(`/artist/${el?.slug}/${el?.id}`)
                  }}
                  alt="ảnh nghệ sĩ"
                  className="w-[180px] rounded-full object-contain animate-slide-left"
                ></img>
              );
            })}
          </div>
          <div
            onClick={handlePrev2}
            className="w-10 h-10 flex justify-center items-center rounded-full bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.8)]  z-10 absolute top-1/2 left-0 transform -translate-y-1/2"
          >
            <GrPrevious size={30}></GrPrevious>
          </div>
          <div
            onClick={handleNext2}
            className="w-10 h-10 flex justify-center items-center rounded-full bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.8)]  z-10 absolute top-1/2 right-0 transform -translate-y-1/2"
          >
            <GrNext size={30}></GrNext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Follow;
