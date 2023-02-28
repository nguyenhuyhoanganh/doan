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
  const { curSongId, isPlaying, atAlbum, songs } = useSelector(
    (state) => state.music
  );
  const [songInfo, setSongInfo] = useState(null);
  // const [source, setSource] = useState(null);
  const [currentSec, setCurrentSec] = useState(0);
  const thumbRef = useRef();
  const trackRef = useRef();
  const voiceRef = useRef();
  const voiceRefTrack = useRef();
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
        console.log(res1.data.data);
        setIsVipSong(false);
      }
      if (res2?.data.err === 0) {
        // setSource(res2.data.data['128'])
        console.log(res2.data.data["128"]);
        // setCurrentSec(0);
        // thumbRef.current.style.cssText = `right: 100%`;
        audio.pause();
        setAudio(new Audio(res2.data.data["128"]));
        setIsVipSong(false);
      } else {
        // ERROR occurred when call VIP songs
        console.log(res2?.data.err);
        audio.pause();
        setAudio(new Audio());
        dispatch(actions.play(false));
        toast.warning(res2.data.msg);
        toast.warning("Không nghe nhạc VIP");
        setCurrentSec(0);
        setIsVipSong(true);
        // console.log(isVipSong);
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
      audio.volume = 0.75;
      intervalId = setInterval(() => {
        // console.log(audio.currentTime);
        let percent =
          Math.round((audio.currentTime * 10000) / songInfo.duration) / 100;
        // console.log(percent);
        thumbRef.current.style.cssText = `right: ${100 - percent}%`;
        setCurrentSec(Math.floor(audio.currentTime));
        // console.log(audio.currentTime)
        if (percent > 99) {
          console.log("Next bài");
          handleNextSong();
        }
      }, 100);
    }
  }, [audio]);

  useEffect(() => {
    intervalId && clearInterval(intervalId);
    if (isPlaying && !isVipSong) {
      audio.play();
      audio.volume = 0.75;
      intervalId = setInterval(() => {
        // console.log(audio.currentTime);
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
  // console.log(songs);
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
    if (songs != null) {
      // console.log("1");

      let curSongIndex;
      songs?.forEach((item, index) => {
        if (item.encodeId == curSongId) {
          curSongIndex = index;
        }
      });

      // dispatch(actions.setCurSongId(songs[curSongId + 1]?.encodeId));
      if (curSongIndex < songs.length) {
        dispatch(actions.setCurSongId(songs[curSongIndex + 1]?.encodeId));
        dispatch(actions.play(true));
      } else {
        dispatch(actions.setCurSongId(songs[0]?.encodeId));
        dispatch(actions.play(true));
      }
      // console.log(songs[curSongIndex + 1]?.encodeId);
      // console.log(songs[curSongIndex + 1]);

      // console.log(curSongIndex);
    }
  };
  const handlePrevSong = () => {
    if (songs != null) {
      // console.log("1");

      let curSongIndex;
      songs?.forEach((item, index) => {
        if (item.encodeId == curSongId) {
          curSongIndex = index;
        }
      });

      // dispatch(actions.setCurSongId(songs[curSongId + 1]?.encodeId));
      if (curSongIndex > 0) {
        dispatch(actions.setCurSongId(songs[curSongIndex - 1]?.encodeId));
        dispatch(actions.play(true));
      } else {
        dispatch(actions.setCurSongId(songs[songs.length - 1]?.encodeId));
        dispatch(actions.play(true));
      }
      // console.log(songs[curSongIndex + 1]?.encodeId);
      // console.log(songs[curSongIndex + 1]);

      // console.log(curSongIndex);
    }
  };
  const handleClickVoiceConfig = (e) => {
    const trackRect = voiceRefTrack.current.getBoundingClientRect();
    console.log(trackRect.left + ": " + trackRect.width);
    console.log(e.clientX);
    const percent =
      Math.round(((e.clientX - trackRect.left) * 10000) / trackRect.width) /
      100;
    console.log(percent);
    voiceRef.current.style.cssText = `right: ${100 - percent}%`;
    audio.volume = Math.floor(percent) / 100;
  };

  function shuffle(array) {
    const newArray = [...array]
    const length = newArray.length
  
    for (let start = 0; start < length; start++) {
      const randomPosition = Math.floor((newArray.length - start) * Math.random())
      const randomItem = newArray.splice(randomPosition, 1)
  
      newArray.push(...randomItem)
    }
  
    return newArray
  }
  const handleShuffle = (e) => {
    console.log("truffle");
    // console.log(songs);
    // TH chưa có bài nào đc chọn
    if (songs.find((s) => s.encodeId === curSongId)) {
      console.log("bài trong list đc chọn");
      const songSuf = shuffle(songs)
      dispatch(actions.setPlaylistData(songSuf))
      // console.log(suf)

    } else {
      console.log("bài trong list chưa được chọn");
    }
    // TH chọn 1 bài trong playlist rồi thì sẽ có id
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
            <span
              onClick={handleShuffle}
              className="hover:text-[#fff]"
              title="Bật phát ngẫu nhiên"
            >
              <BsShuffle size={24} />
            </span>
            <span
              onClick={handlePrevSong}
              className={
                !songs ? "text-gray-500 cursor-default" : "hover:text-[#fff]"
              }
              title="Lùi bài"
            >
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
                !songs ? "text-gray-500 cursor-default" : "hover:text-[#fff]"
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
          <BsVolumeUp className="cursor-pointer hover:text-[#fff]" size={24} />
        </span>
        <div
          onClick={handleClickVoiceConfig}
          ref={voiceRefTrack}
          className="h-[2px] w-full hover:h-[5px] rounded-l-full rounded-r-full bg-main-100 relative"
        >
          <div
            ref={voiceRef}
            className="h-[100%] right-[25%] rounded-l-full rounded-r-full absolute top-0 left-0 bg-main-400"
          ></div>
        </div>
        {/* <span>
          <MdPlaylistPlay
            className="cursor-pointer hover:text-[#fff]"
            size={24}
          />
        </span> */}
      </div>
    </div>
  );
};

export default Player;
