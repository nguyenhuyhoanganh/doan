import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { List } from "../../components";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useParams } from "react-router-dom";
import * as apis from "../../apis";
import { useNavigate } from "react-router-dom";
import icons from "../../utils/icons";

const Search = () => {
  let setTimeOutId;
  const [result, setResult] = useState(null);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const { key } = useParams();
  const navigate = useNavigate();
  const { GrPrevious, GrNext } = icons;
  useEffect(() => {
    const fetchResult = async () => {
      const res = await apis.apiSearchSong(key);
      const artistsResult = [];
      const albumResult = [];
      if (res.data?.code === 200) {
        setResult(res.data?.data);
        res.data?.data?.forEach((element) => {
          const artist = element.artists[0];
          const album = element.album;
          artistsResult.push(artist);
          albumResult.push(album);
        });
        // unique artistResult
        const uniArts = artistsResult.filter(
          (obj, index, self) => self.findIndex((t) => t.id === obj.id) === index
        );
        setArtists(uniArts);
        const uniAlbs = albumResult.filter(
          (obj, index, self) => self.findIndex((t) => t.id === obj.id) === index
        );
        setAlbums(uniAlbs);
      }
    };
    fetchResult();
  }, [key]);

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
  return (
    <Scrollbars className="pl-5" style={{ width: "100%", height: 560 }}>
      <div className="flex flex-col gap-5 m-4">
        <div className="flex flex-col gap-4">
          <h1 className="font-extrabold text-[30px] text-[#0D7373]">
            Kết quả tìm kiếm của: {key}
          </h1>
          <h1 className="font-extrabold text-[30px] text-[#0D7373]">BÀI HÁT</h1>
          {result?.length === 0? '<không tìm thấy bài hát>':<List songs={result}></List>}
          {/* result && <List songs={result} /> */}
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="font-extrabold text-[30px] text-[#0D7373]">NGHỆ SĨ</h1>
          <div className="relative">
            <div
              id="slider"
              className="flex justify-center items-center gap-2 relative p-2 overflow-x-hidden transition-all cursor-pointer"
            >
              {artists?.length === 0? '<không tìm thấy kêt quả>':artists?.map((el, index) => {
                return (
                  <img
                    key={index}
                    title={el?.fullName}
                    src={el?.avatarUrl}
                    onClick={() => {
                      navigate(`/artist/${el?.slug}/${el?.id}`);
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
        <div className="flex flex-col gap-5">
          <h1 className="font-extrabold text-[30px] text-[#0D7373]">ALBUM</h1>
          <div className="relative">
            <div
              id="slider2"
              className="flex justify-center items-center gap-2 relative p-2 overflow-x-hidden transition-all cursor-pointer"
            >
              {albums?.length === 0? '<không tìm thấy kêt quả>' :albums?.map((el, index) => {
                return (
                  <img
                    key={index}
                    title={el?.fullName}
                    src={el?.backgroundImageUrl}
                    onClick={() => {
                      navigate(`/album/${el?.slug}/${el?.id}`);
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
    </Scrollbars>
  );
};

export default Search;
