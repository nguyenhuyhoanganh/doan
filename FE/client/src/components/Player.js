import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import * as api from "../apis";
import icons from "../utils/icons";
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
  const { curSongId, isPlaying } = useSelector((state) => state.music);
  const [songInfo, setSongInfo] = useState(null);
  const [source, setSource] = useState(null);
  const audioElm = new Audio("https://mp3-s1-zmp3.zmdcdn.me/c579777ecb3e22607b2f/2469051156594466330?authen=exp=1677028055~acl=/c579777ecb3e22607b2f/*~hmac=ab9399a5aa43c0f0e6e6993c127589f0&fs=MTY3Njg1NTI1NTQyNXx3ZWJWNnwyMzEwNjI2MDh8MTQdUngMjMyLjIwOC4yMzQ")
  useEffect(() => {
    const fetchDetailSong = async () => {
      const [res1, res2] = await Promise.all([
        api.apiGetDetailSong(curSongId),
        api.apiGetSong(curSongId)
      ]) 
      // console.log(res2);
      if (res1?.data.err === 0) {
        setSongInfo(res1.data.data);
      }
      if(res2?.data.err === 0) {
        setSource(res2.data.data['128'])
      }
    };
    fetchDetailSong();
  }, [curSongId]);

  useEffect(() => {
    // audioElm.play()
  }, [curSongId])
  // console.log(curSongId);
  const handleTogglePlayMusic = () => {
    // setIsPlaying(prev => !prev)
  }

  return (
    <div className="px-5 h-full flex justify-center bg-main-300">
      <div className="w-[30%] flex-auto border border-red-500 flex items-center">
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
      <div className="w-[40%] flex-auto border border-red-500">
        <div className="flex flex-col justify-center items-center h-[100%]">
          <div className="flex h-[70%] gap-12 mt-4 items-center cursor-pointer">
            <span className="hover:text-[#fff]" title="Bật phát ngẫu nhiên">
              <BsShuffle size={24} />
            </span>
            <span className="hover:text-[#fff]" title="Lùi bài">
              <IoMdSkipBackward size={24} />
            </span>
            <span title="Phát" className="hover:text-[#fff]"
            onClick={handleTogglePlayMusic}
            >
              {isPlaying ? <AiOutlinePauseCircle size={50} /> : <AiOutlinePlayCircle size={50} />}
            </span>
            <span  className="hidden">
              <AiOutlinePauseCircle size={30} />
            </span>
            <span className="hover:text-[#fff]" title="">
              <IoMdSkipForward size={24} />
            </span>
            <span className="hover:text-[#fff]" title="Lặp bài hát">
              <RxLoop size={24} />
            </span>
          </div>
          <div className="flex h-[30%] gap-6">
            <span>0:00</span>
            <div className="w-full bg-gray-200 h-1">
              <div className="bg-blue-600 h-1"></div>
            </div>
            <span>5:00</span>
          </div>
        </div>
      </div>
      <div className="w-[30%] flex-auto border border-red-500 gap-10 flex justify-between p-10 items-center">
        <span><BsVolumeUp size={24}/></span>
        <span><MdPlaylistPlay size={24} /></span>
      </div>
    </div>
  );
};

export default Player;
