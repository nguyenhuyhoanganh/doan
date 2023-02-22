import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import * as api from "../apis";
import icons from "../utils/icons";
import * as actions from "../store/actions";
import { useRef } from "react";
import { toast } from "react-toastify";

var intervalId;
const Player = () => {
  const {
    MdInfoOutline,
    AiOutlineHeart,
    BsShuffle,
    AiOutlinePlayCircle,
    AiOutlinePauseCircle,
    IoMdSkipBackward,
    IoMdSkipForward,
    RxLoop,
    MdPlaylistPlay,
    BsVolumeUp,
  } = icons;
  // const [isPlaying, setIsPlaying] = useState(false)
  const dispatch = useDispatch();
  const { curSongId, isPlaying, atAlbum } = useSelector((state) => state.music);
  const [songInfo, setSongInfo] = useState(null);
  // const [source, setSource] = useState(null);
  const [currentSec, setCurrentSec] = useState(0);
  const thumbRef = useRef();
  const trackRef = useRef();
  const [isVipSong, setIsVipSong] = useState(false);
  // const audioElm = useRef(new Audio())
  const [audio, setAudio] = useState(new Audio());
  useEffect(() => {
    const fetchDetailSong = async () => {
      const [res1, res2] = await Promise.all([
        api.apiGetDetailSong(curSongId),
        api.apiGetSong(curSongId),
      ]);
      // console.log(res2);
      if (res1?.data.err === 0) {
        setSongInfo(res1.data.data);
        // console.log(res1.data.data)
        setIsVipSong(false);
      }
      if (res2?.data.err === 0) {
        // setSource(res2.data.data['128'])
        // setCurrentSec(0);
        // thumbRef.current.style.cssText = `right: 100%`;
        audio.pause();
        setAudio(new Audio(res2.data.data["128"]));
        setIsVipSong(false);
      } else {
        // ERROR occurred when call VIP songs
        audio.pause();
        setAudio(new Audio());
        dispatch(actions.play(false));
        toast.warning(res2.data.msg);
        toast.warning("Không nghe nhạc VIP");
        setCurrentSec(0);
        setIsVipSong(true);
        console.log(isVipSong);
        thumbRef.current.style.cssText = `right: 100%`;
      }
    };
    fetchDetailSong();
  }, [curSongId]);

  console.log(isVipSong);
  useEffect(() => {
    // dispatch(actions.play(true))
    intervalId && clearInterval(intervalId);
    audio.pause();
    // audio.load();
    if (isPlaying && !isVipSong) {
      audio.play();
      intervalId = setInterval(() => {
        console.log(audio.currentTime);
        let percent =
          Math.round((audio.currentTime * 10000) / songInfo.duration) / 100;
        // console.log(percent)
        thumbRef.current.style.cssText = `right: ${100 - percent}%`;
        setCurrentSec(Math.floor(audio.currentTime));
        // console.log(audio.currentTime)
      }, 100);
    }
  }, [audio]);

  useEffect(() => {
    intervalId && clearInterval(intervalId);
    if (isPlaying && !isVipSong) {
      audio.play();
      intervalId = setInterval(() => {
        console.log(audio.currentTime);
        let percent =
          Math.round((audio.currentTime * 10000) / songInfo.duration) / 100;
        // console.log(percent)
        thumbRef.current.style.cssText = `right: ${100 - percent}%`;
        setCurrentSec(Math.floor(audio.currentTime));
        // console.log(audio.currentTime)
      }, 100);
    }
  }, [isPlaying]);
  // console.log(curSongId);
  const handleTogglePlayMusic = () => {
    // setIsPlaying(prev => !prev)
    if (!isVipSong) {
      if (!isVipSong) {
        if (isPlaying) {
          console.log("pause");
          audio.pause();
          dispatch(actions.play(false));
        } else {
          audio.play();
          dispatch(actions.play(true));
        }
      }
    }
  };
  const handleTime = (sec) => {
    let min = Math.floor(sec / 60);
    let second = sec - Math.floor(sec / 60) * 60;
    return second < 10 ? min + ":0" + second : min + ":" + second;
  };

  const handleClickProgressbar = (e) => {
    console.log(e);
    // console.log(trackRef.current.getBoundingClientRect());
    const trackRect = trackRef.current.getBoundingClientRect();
    const percent =
      Math.round(((e.clientX - trackRect.left) * 10000) / trackRect.width) /
      100;
    console.log(percent);
    thumbRef.current.style.cssText = `right: ${100 - percent}%`;
    audio.currentTime = (percent * songInfo.duration) / 100;
    setCurrentSec(Math.round((percent * songInfo.duration) / 100));
  };
  const handleNextSong = () => {
    if (atAlbum) {
      console.log("1");
    }
  };
  return (
    <div className="px-5 h-full flex justify-center bg-main-300">
      <div className="w-[30%] flex-auto flex items-center">
        <img
          src={songInfo?.thumbnail}
          className="w-16 h-16 object-cover rounded-md ml-4"
        />
        <div className="flex flex-col gap-1 pl-2">
          <span className="font-semibold">{songInfo?.title}</span>
          <span className="text-sm text-gray-500">
            {songInfo?.artistsNames}
          </span>
        </div>
        <div className="flex gap-3 ml-8 cursor-pointer">
          {/* icons */}
          <AiOutlineHeart size={24} className="hover:bg-red-500" />
          <MdInfoOutline size={24} />
        </div>
      </div>
      <div className="w-[40%] flex-auto">
        <div className="flex flex-col justify-center items-center h-[100%]">
          <div className="flex h-[70%] gap-12 mt-4 items-center cursor-pointer">
            <span className="hover:text-[#fff]" title="Bật phát ngẫu nhiên">
              <BsShuffle size={24} />
            </span>
            <span className="hover:text-[#fff]" title="Lùi bài">
              <IoMdSkipBackward size={24} />
            </span>
            <span
              title="Phát"
              className={`${
                isVipSong ? "cursor-default" : "hover:text-[#fff]"
              }`}
              onClick={handleTogglePlayMusic}
            >
              {isPlaying && !isVipSong ? (
                <AiOutlinePauseCircle size={50} />
              ) : (
                <AiOutlinePlayCircle size={50} />
              )}
            </span>
            <span className="hidden">
              <AiOutlinePauseCircle size={30} />
            </span>
            <span
              onClick={handleNextSong}
              className={`${
                !atAlbum ? "text-gray-500 cursor-default" : "hover:text-[#fff]"
              }`}
              title=""
            >
              <IoMdSkipForward size={24} />
            </span>
            <span className="hover:text-[#fff]" title="Lặp bài hát">
              <RxLoop size={24} />
            </span>
          </div>
          <div className="flex h-[30%] gap-6 justify-center cursor-pointer m-auto items-center w-full">
            <span>{handleTime(currentSec)}</span>
            <div
              ref={trackRef}
              onClick={handleClickProgressbar}
              className="w-3/4 h-[4px] hover:h-[6px] rounded-l-full rounded-r-full relative bg-[rgba(0,0,0,0.1)]"
            >
              <div
                ref={thumbRef}
                className="h-[100%] rounded-l-full rounded-r-full absolute top-0 left-0 bg-main-400"
              ></div>
            </div>

            <span>
              {songInfo?.duration ? handleTime(songInfo?.duration) : `0:00`}
            </span>
          </div>
        </div>
      </div>
      <div className="w-[30%] flex-auto gap-10 flex justify-between p-10 items-center">
        <span>
          <BsVolumeUp size={24} />
        </span>
        <span>
          <MdPlaylistPlay size={24} />
        </span>
      </div>
    </div>
  );
};

export default Player;
