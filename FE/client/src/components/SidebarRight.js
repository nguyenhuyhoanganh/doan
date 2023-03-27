import React, { useState } from "react";
import icons from "../utils/icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Scrollbars } from "react-custom-scrollbars-2";
import * as actions from "../store/actions";
import * as api from "../apis";
import { SkeletonSong } from "../components";

const { BsToggleOff, BsToggleOn, TbPlayerTrackNext } = icons;
const SidebarRight = () => {
  // const [autoPlay, setAutoPlay] = useState(false);
  const [btnList, setBtnList] = useState(true);
  const [songList, setSongList] = useState(null);
  const [firstSong, setFirstSong] = useState(null);
  const [curSong, setCurSong] = useState(null);
  const [skeleton, setSkeleton] = useState(true);
  const [atNext, setAtNext] = useState(true);
  const dispatch = useDispatch();
  const [preSong, setPreSong] = useState(null);
  const { songs, skip, curSongId, preSongs } = useSelector(
    (state) => state.music
  );
  useEffect(() => {
    setPreSong(preSongs);
    songs &&
      songs.forEach((element, index) => {
        if (element.id == +curSongId) {
          setSongList(songs.slice(index));
        }
      });
  }, [curSongId]);

  useEffect(() => {
    setSkeleton(true);
    const fetchDetailSong = async () => {
      const res1 = await api.apiGetDetailSong(curSongId);
      if (res1?.data.code === 200) {
        setCurSong(res1?.data?.data[0]);
        setSkeleton(false);
        dispatch(actions.setPreSongs(res1.data?.data[0]));
      }
    };
    fetchDetailSong();
  }, [curSongId]);
  // console.log('Skip', skip)
  const handleAutoButton = () => {
    let autoPlay = !skip;
    dispatch(actions.setAutoSkip(autoPlay));
  };

  const activeStyle = "";
  const notActiveStyle = "hidden";

  return (
    <div className="bg-main-200 w-full h-screen flex flex-col gap-4 border-l-2 shadow-md">
      {/* {console.log(song)} */}
      <div className="flex bg-main-300 rounded-lg justify-between h-8 gap-2 w-[80%] m-4 p-1 cursor-pointer">
        <div
          onClick={() => setBtnList((prev) => !prev)}
          className={`${btnList ? "bg-[#E7ECEC] rounded-lg" : ""}`}
        >
          <span>Danh sách phát</span>
        </div>
        <div
          onClick={() => setBtnList((prev) => !prev)}
          className={`${btnList ? "" : "bg-[#E7ECEC] rounded-lg"}`}
        >
          <span>Nghe gần đây</span>
        </div>
      </div>

      {/* bài hát hiện tại */}
      {skeleton ? (
        <SkeletonSong></SkeletonSong>
      ) : (
        <div
          onClick={() => {}}
          className="flex gap-4 bg-[#0E8080] border border-[#CED9D9] shadow-lg w-[100%] rounded-lg cursor-pointer hover:shadow-md"
        >
          {/* <span className="text-[#fff] absolute pt-3 pl-[30px]">
          <TbPlayerTrackNext size={24} />
        </span> */}
          <img
            src={curSong?.imageUrl}
            className="w-12 h-12 object-cover rounded-md ml-4"
          />
          <div className="flex flex-col gap-1 pl-2">
            <span className="font-bold text-[#fff]">
              {curSong?.title?.length < 25
                ? curSong?.title
                : `${curSong?.title?.slice(0, 20)}...`}
            </span>
            <span className="text-sm text-[#e7e9e9]">
              {curSong?.artists[0]?.fullName.length < 25
                ? curSong?.artists[0].fullName
                : `${curSong?.artists[0]?.fullName.slice(0, 20)}...`}
            </span>
          </div>
        </div>
      )}
      {!btnList ? (
        <Scrollbars className="pl-5" style={{ width: "100%", height: 428 }}>
          <div className="flex flex-col gap-3 mr-4">
            {preSong?.map((item, index) => {
              if (index > 0) {
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      dispatch(actions.setCurSongId(item?.id));
                      dispatch(actions.play(true));
                    }}
                    className="flex cursor-pointer bg-main-300 border border-[#0D7373] hover:shadow-md w-[100%] rounded-lg"
                  >
                    {/* <span className="absolute pt-3 pl-[30px]">
                  <TbPlayerTrackNext size={24} />
                </span> */}
                    <img
                      src={item.imageUrl}
                      className="w-12 h-12 object-cover rounded-md ml-4"
                    />
                    <div className="flex flex-col gap-1 pl-2">
                      <span className="font-bold text-[#111010]">
                        {item.title.length < 25
                          ? item.title
                          : `${item.title.slice(0, 20)}...`}
                      </span>
                      <span className="text-sm text-[#171e1e]">
                        {item.artists[0]?.fullName.length < 25
                          ? item.artists[0]?.fullName
                          : `${item.artists[0]?.fullName.slice(0, 25)}...`}
                      </span>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </Scrollbars>
      ) : (
        <div className="flex flex-col">
          <div className="flex pt-5 m-5 gap-10 justify-between">
            <div className="flex flex-col">
              <span className="font-semibold">Tự động phát</span>
              <span>Gợi ý nội dung phát</span>
            </div>
            <span
              className="flex items-center cursor-pointer"
              onClick={handleAutoButton}
            >
              {!skip ? (
                <BsToggleOff size={24}></BsToggleOff>
              ) : (
                <BsToggleOn size={24}></BsToggleOn>
              )}
            </span>
          </div>
          {/* map list recommend */}
          <Scrollbars className="pl-5" style={{ width: "100%", height: 428 }}>
            <div className="flex flex-col gap-3 mr-4">
              {songList?.map((item, index) => {
                if (index > 0) {
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        dispatch(actions.setCurSongId(item?.id));
                        dispatch(actions.play(true));
                        dispatch(actions.playAlbum(true));
                      }}
                      className="flex cursor-pointer bg-main-300 border border-[#0D7373] hover:shadow-md w-[100%] rounded-lg"
                    >
                      {/* <span className="absolute pt-3 pl-[30px]">
                      <TbPlayerTrackNext size={24} />
                    </span> */}
                      <img
                        src={item.imageUrl}
                        className="w-12 h-12 object-cover rounded-md ml-4"
                      />
                      <div className="flex flex-col gap-1 pl-2">
                        <span className="font-bold text-[#111010]">
                          {item.title.length < 25
                            ? item.title
                            : `${item.title.slice(0, 20)}...`}
                        </span>
                        <span className="text-sm text-[#171e1e]">
                          {item.artists[0]?.fullName.length < 25
                            ? item.artists[0]?.fullName
                            : `${item.artists[0]?.fullName.slice(0, 25)}...`}
                        </span>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </Scrollbars>
        </div>
      )}
    </div>
  );
};

export default SidebarRight;
