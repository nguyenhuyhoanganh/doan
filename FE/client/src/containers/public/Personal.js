import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import icons from "../../utils/icons";
import * as apis from "../../apis";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth.context";
import Scrollbars from "react-custom-scrollbars-2";
import { useNavigate } from "react-router-dom";
import { List } from "../../components";
import * as actions from "../../store/actions"

const Personal = () => {
  let setTimeOutId;
  const navigate = useNavigate();
  const { GrNext, GrPrevious, IoMdAdd, AiOutlinePlayCircle } = icons;
  const [showBox, setShowBox] = useState(false);

  const [playList, setPlayList] = useState(null);
  const [favoristList, setFavoristList] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const { banner } = useSelector((state) => {
    return state.app;
  });
  const dispatch = useDispatch()
  // console.log(banner);
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
  const handleAddPlaylist = () => {
    setShowBox(true);
  };
  useEffect(() => {
    const fetchPL = async () => {
      if (isAuthenticated) {
        const res = await apis.apiGetPlaylist({
          limit: 40,
          orderBy: "createdAt",
        });
        const res2 = await apis.apiGetFavoritePlaylist({
          limit: 999,
          orderBy: "createdAt",
        });
        // console.log(res2)
        setFavoristList(res2?.data?.data);
        setPlayList(res?.data?.data);
      }
    };
    fetchPL();
  }, []);
  const handlePlayFaList = () => {
    dispatch(actions.setCurSongId(favoristList[0]?.id));
    dispatch(actions.play(true));
    dispatch(actions.playAlbum(true));
    dispatch(actions.setPlaylistData(favoristList));
  };
  return (
    <Scrollbars style={{ width: "100%", height: 560 }}>
      <div className="flex flex-col h-[500px] m-5 p-5 gap-8">
        <h1 className="font-extrabold text-[30px] text-[#0D7373]">THƯ VIỆN</h1>
        <div className="h-[40%]">
          {/* list các album */}
          <div className="relative">
            <div
              id="slider2"
              className="flex gap-5 items-center overflow-x-hidden"
            >
              {banner?.map((el, index) => {
                return (
                  <img
                    key={index}
                    title={el?.description}
                    src={el?.backgroundImageUrl}
                    onClick={() => {
                      navigate(`/album/${el?.slug}/${el?.id}`);
                    }}
                    alt="ảnh nghệ sĩ"
                    className="w-[180px] rounded-full object-contain animate-slide-left cursor-pointer"
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
        <div className="flex flex-col gap-5">
          {/* list các playlist */}
          <div className="flex gap-5 items-center">
            <h1 className="font-extrabold text-[30px] text-[#0D7373]">
              PLAYLIST
            </h1>
            <span
              onClick={handleAddPlaylist}
              className="border border-[#0D7373] rounded-full cursor-pointer text-[#0D7373] p-1 hover:bg-main-400 hover:text-[#fff]"
            >
              <IoMdAdd size={30} />
            </span>
            {showBox ? (
              <div className="absolute top-1/2 transform -translate-y-1/2 left-1/2  -translate-x-1/2 h-auto w-[400px] border border-red-500 z-10">
                <div className="flex flex-col justify-center gap-3 items-center bg-main-300">
                  <h1 className="font-extrabold text-[20px] text-[#0D7373]">
                    Tên playlist
                  </h1>
                  <div className="flex gap-5">
                    <input
                      type="text"
                      className="p-1 w-[300px] focus:outline-none rounded-md focus:border-[#0D7373]"
                    />
                    <button className="border border-[#0D7373] hover:bg-main-400 cursor-pointer rounded-md px-4">
                      Tạo
                    </button>
                  </div>
                  <div
                    onClick={() => setShowBox(false)}
                    className="border border-red-500 hover:bg-red-500 rounded-md cursor-pointer px-2"
                  >
                    Hủy
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="flex justify-between">
            {/* playlist */}
            {playList ? (
              <div className="relative w-full">
                <div
                  id="slider"
                  className="flex gap-5 items-center justify-center overflow-x-hidden"
                >
                  {playList?.map((el, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col text-center gap-2 cursor-pointer "
                      >
                        <img
                          title={el?.title}
                          src={el?.songs[0]?.imageUrl}
                          onClick={() => {
                            navigate(`/playlist/${el?.slug}/${el?.id}`);
                          }}
                          alt="ảnh nghệ sĩ"
                          className="w-[180px] rounded-full object-contain animate-slide-left"
                        ></img>
                        <h1>{el?.title}</h1>
                      </div>
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
            ) : (
              <div className="flex m-auto text-center items-center justify-center">
                <span>Chưa có playlist nào</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {/* list các playlist */}
          <div className="flex gap-5 items-center">
            <h1 className="font-extrabold text-[30px] text-[#0D7373]">
              PLAYLIST YÊU THÍCH
            </h1>
            <span
              title="Phát playlist yêu thích"
              onClick={handlePlayFaList}
              className="border border-[#0D7373] rounded-full cursor-pointer text-[#0D7373] p-1 hover:bg-main-400 hover:text-[#fff]"
            >
              <AiOutlinePlayCircle size={30} />
            </span>
          </div>
          <div className="flex flex-col justify-between">
            {/* playlist */}
            <List songs={favoristList}></List>
          </div>
        </div>
      </div>
    </Scrollbars>
  );
};

export default Personal;
