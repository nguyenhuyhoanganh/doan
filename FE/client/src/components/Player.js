import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import * as api from "../apis";
import icons from "../utils/icons";
import * as actions from "../store/actions";
import { useRef } from "react";
import { toast } from "react-toastify";
import SkeletonComment from "./SkeletonComment";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";

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
    TbRepeat,
    TbRepeatOnce,
  } = icons;
  const navigate = useNavigate();
  let songSuf = null;
  const dispatch = useDispatch();
  const { curSongId, isPlaying, atAlbum, songs, skip } = useSelector(
    (state) => state.music
  );
  const [songInfo, setSongInfo] = useState(null);
  const [currentSec, setCurrentSec] = useState(0);
  const thumbRef = useRef();
  const trackRef = useRef();
  const voiceRef = useRef();
  const voiceRefTrack = useRef();
  const [isVipSong, setIsVipSong] = useState(false);
  const [skeleton, setSkeleton] = useState(true);
  const [loopBtn, setLoopBtn] = useState(false);
  const [like, setLike] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  var tempSource;
  const [audio, setAudio] = useState(new Audio());
  const { friday } = useSelector((state) => state.app);
  useEffect(() => {
    const fetchDetailSong = async () => {
      setSkeleton(true);
      const res = await api.apiGetDetailSong(curSongId);
      if (res?.data.code === 200) {
        audio.pause();
        setSongInfo(res?.data?.data[0]);
        setAudio(new Audio(res?.data?.data[0]?.sourceUrls[0]));
        setSkeleton(false);
        setIsVipSong(false);
        setLike(res?.data?.data[0]?.liked);
      } else {
        // ERROR occurred when call VIP songs
        audio.pause();
        setAudio(new Audio());
        dispatch(actions.play(false));
        toast.warning(res.data.msg);
        toast.warning("Không nghe nhạc VIP");
        setCurrentSec(0);
        setIsVipSong(true);
        handleNextSong();
        // console.log(isVipSong);
        thumbRef.current.style.cssText = `right: 100%`;
      }
      const res2 = await api.apiIncresingView(curSongId);
    };

    fetchDetailSong();
  }, [curSongId]);

  useEffect(() => {
    if (friday.length > 0) {
      dispatch(actions.setCurSongId(friday[0].id));
      dispatch(actions.play(false));
      dispatch(actions.playAlbum(true));
      dispatch(actions.setPlaylistData(friday));
    }
  }, [friday]);
  // console.log(isVipSong);
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
        thumbRef.current.style.cssText = `right: ${100 - percent}%`;
        setCurrentSec(Math.floor(audio.currentTime));
      }, 100);
    }
  }, [audio]);
  // console.log("AT ALBUM", atAlbum);

  const handleEnd = () => {
    intervalId && clearInterval(intervalId);
    // trường hợp có lặp
    console.log(loopBtn)
    if (loopBtn) {
      audio.currentTime = 0;
      audio.play();
      intervalId = setInterval(() => {
        // console.log(audio.currentTime);
        let percent =
          Math.round((audio.currentTime * 10000) / songInfo.duration) / 100;
        // console.log(percent);
        thumbRef.current.style.cssText = `right: ${100 - percent}%`;
        setCurrentSec(Math.floor(audio.currentTime));
      }, 100);
    } else {
      if (!songs || songs[songs.length - 1].id === curSongId) {
      } else {
        if (skip) {
          handleNextSong();
        }
      }
    }

    audio.removeEventListener("ended", handleEnd);
  };
  // trường hợp không lặp bài
  audio.addEventListener("ended", handleEnd);

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
      }, 100);
    }
  }, [isPlaying]);
  // console.log(curSongId);
  const handleTogglePlayMusic = () => {
    // setIsPlaying(prev => !prev)
    if (!isVipSong) {
      if (!isVipSong) {
        if (isPlaying) {
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
    // console.log(trackRef.current.getBoundingClientRect());
    const trackRect = trackRef.current.getBoundingClientRect();
    const percent =
      Math.round(((e.clientX - trackRect.left) * 10000) / trackRect.width) /
      100;
    thumbRef.current.style.cssText = `right: ${100 - percent}%`;
    audio.currentTime = (percent * songInfo.duration) / 100;
    setCurrentSec(Math.round((percent * songInfo.duration) / 100));
  };
  const handleNextSong = () => {
    if (songSuf != null) {
      // phát theo list này
    } else {
      if (songs != null) {
        let curSongIndex;
        songs?.forEach((item, index) => {
          if (item.id === +curSongId) {
            curSongIndex = index;
          }
        });

        // dispatch(actions.setCurSongId(songs[curSongId + 1]?.encodeId));
        if (curSongIndex < songs.length - 1) {
          dispatch(actions.setCurSongId(songs[curSongIndex + 1]?.id));
          dispatch(actions.play(true));
        } else {
          dispatch(actions.setCurSongId(songs[0]?.id));
          dispatch(actions.play(true));
        }
        // console.log(songs[curSongIndex + 1]?.encodeId);
        // console.log(songs[curSongIndex + 1]);

        // console.log(curSongIndex);
      }
    }
  };
  const handlePrevSong = () => {
    if (songs !== null) {
      // console.log("1");

      let curSongIndex;
      songs?.forEach((item, index) => {
        if (item.id === +curSongId) {
          curSongIndex = index;
        }
      });

      // dispatch(actions.setCurSongId(songs[curSongId + 1]?.encodeId));
      if (curSongIndex > 0) {
        dispatch(actions.setCurSongId(songs[curSongIndex - 1]?.id));
        dispatch(actions.play(true));
      } else {
        dispatch(actions.setCurSongId(songs[songs.length - 1]?.id));
        dispatch(actions.play(true));
      }
      // console.log(songs[curSongIndex + 1]?.encodeId);
      // console.log(songs[curSongIndex + 1]);

      // console.log(curSongIndex);
    }
  };
  const handleClickVoiceConfig = (e) => {
    const trackRect = voiceRefTrack.current.getBoundingClientRect();
    const percent =
      Math.round(((e.clientX - trackRect.left) * 10000) / trackRect.width) /
      100;
    voiceRef.current.style.cssText = `right: ${100 - percent}%`;
    audio.volume = Math.floor(percent) / 100;
  };

  function shuffle(array) {
    const newArray = [...array];
    const length = newArray.length;

    for (let start = 0; start < length; start++) {
      const randomPosition = Math.floor(
        (newArray.length - start) * Math.random()
      );
      const randomItem = newArray.splice(randomPosition, 1);

      newArray.push(...randomItem);
    }

    return newArray;
  }
  const handleShuffle = (e) => {
    // TH chưa có bài nào đc chọn
    if (songs) {
      if (songs.find((s) => s.id === curSongId)) {
        songSuf = songs;
        // dispatch(actions.setPlaylistData(songSuf));
        // xử lý trộn bài loại bỏ 1
        songSuf.forEach((element, index) => {
          // if (element.id === curSongId) {
          //   songSuf.splice(index, 1);
          // }
        });
        songSuf = shuffle(songSuf);
        dispatch(actions.setPlaylistData(songSuf));
        dispatch(actions.setCurSongId(songSuf[0].id));
        dispatch(actions.play(true));
      } else {
        const songSuf = shuffle(songs);
        dispatch(actions.setPlaylistData(songSuf));
        // phát luôn bài đầu tiên này
        songSuf && dispatch(actions.setCurSongId(songSuf[0].id));
      }
    } else {
      toast.info("chưa có bài hát trong danh sách phát");
    }
    // TH chọn 1 bài trong playlist rồi thì sẽ có id
  };
  const handleCLickLoop = () => {
    setLoopBtn((pre) => !pre);
    console.log(loopBtn);
  };
  const handleLikeSong = () => {
    const actionLikeSong = async () => {
      if (isAuthenticated) {
        if (like) {
          // nếu like = true là đã like
          const res = await api.apiUnLikeSong(curSongId);
          setLike(false);
          toast.info("Bỏ lượt thích :((");
        } else {
          // like = false là chưa like
          const res = await api.apiLikeSong(curSongId);
          setLike(true);
          toast.info("Cảm ơn đã thích bài hát <3");
        }
      } else {
        toast.warning("Bạn cần đăng nhập để like bài hát");
      }
    };
    actionLikeSong();
  };
  return (
    <div className="px-5 h-full flex justify-center bg-main-300">
      {/* thông tin bài hát */}
      {skeleton ? (
        <div className="w-[30%]">
          <SkeletonComment />
        </div>
      ) : (
        <div className="w-[30%] flex-auto flex items-center">
          <img
            src={songInfo?.imageUrl}
            className="w-16 h-16 object-cover rounded-md ml-4"
          />
          <div className="flex flex-col gap-1 pl-2">
            <span className="font-semibold">{songInfo?.title}</span>
            <span className="text-sm text-gray-500">
              {songInfo?.artists[0].fullName}
            </span>
          </div>
          <div className="flex gap-3 ml-8 cursor-pointer">
            {/* icons */}
            <AiOutlineHeart
              onClick={() => handleLikeSong()}
              size={24}
              className={like ? "text-red-500" : "hover:text-red-500"}
            />
            <MdInfoOutline
              onClick={() => {
                navigate(`/song/${songInfo?.slug}/${songInfo?.id}`);
              }}
              size={24}
              className="hover:text-[#fff]"
              title="Info"
            />
          </div>
        </div>
      )}
      {/* <div className="w-[30%] flex-auto flex items-center">
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
          <AiOutlineHeart size={24} className="hover:text-red-500" />
          <MdInfoOutline size={24} className="hover:text-[#fff]" title="Info" />
        </div>
      </div> */}
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
            <span
              onClick={(e) => handleCLickLoop()}
              className="hover:text-[#fff]"
              title="Lặp bài hát"
            >
              {loopBtn ? <TbRepeatOnce size={30} /> : <TbRepeat size={30} />}
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
          className="h-[2px] w-full hover:h-[5px] rounded-l-full rounded-r-full bg-main-100 relative cursor-pointer"
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
