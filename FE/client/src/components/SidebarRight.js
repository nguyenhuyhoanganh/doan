import React, { useState } from "react";
import icons from "../utils/icons";
import { useEffect, useSelector } from "react";
import { useDispatch } from "react-redux";

const { BsToggleOff, BsToggleOn, GrCaretNext } = icons;
const SidebarRight = () => {
  const [autoPlay, setAutoPlay] = useState(false);
  const [btnList, setBtnList] = useState(true);
  const [song, setSong] = useState();
  // const useDispatch = useDispatch()
  // const { curSongId, isPlaying, atAlbum } = useSelector((state) => state.music);

  const handleAutoButton = () => {
    setAutoPlay(!autoPlay);
    console.log(autoPlay);
  };
  // useEffect(() => {
  //   console.log('re-render with songs')
  // }, [])
  const activeStyle = "";
  const notActiveStyle = "hidden";
  console.log("re-render");

  // useEffect(() => {
  //   var requestOptions = {
  //     method: "GET",
  //     redirect: "follow",
  //   };
  // TEST API
  //   fetch("http://localhost:8080/api/songs", requestOptions)
  //     .then((response) => response.json())
  //     // .then(result => JSON.parse(result))
  //     .then((result) => setSong(result.data[0]))
  //     .catch((error) => console.log("error", error));
  // }, []);
  // const audio = new Audio()
  return (
    <div className="bg-main-200 w-full h-screen flex flex-col gap-4">
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

      <div
        // onClick={() => {
        //   console.log('object')
        //   audio.src = song.sourceUrls[0]
        //   audio.load()
        //   audio.play()
        // }}
        className="flex gap-6 bg-[#0E8080] border border-[#CED9D9] shadow-lg w-[100%] rounded-lg"
      >
        <span className="text-[#fff] absolute pt-3 pl-[30px]">
          <GrCaretNext size={24} />
        </span>
        <img
          src={song?.imageUrl}
          className="w-12 h-12 object-cover rounded-md ml-4"
        />
        <div className="flex flex-col gap-1 pl-2">
          <span className="font-bold text-[#fff]">Tên bài hát</span>
          <span className="text-sm text-[#e7e9e9]">Nghệ sỹ</span>
        </div>
      </div>

      <div className="flex pt-5 m-5 gap-10 justify-between">
        <div className="flex flex-col">
          <span className="font-semibold">Tự động phát</span>
          <span>Gợi ý nội dung phát</span>
        </div>
        <span
          className="flex items-center cursor-pointer"
          onClick={handleAutoButton}
        >
          {/* <BsToggleOff
            size={24}
            className={(autoPlay) => (autoPlay ? activeStyle : notActiveStyle)}
          />
          <BsToggleOn size={24} className="hidden" /> */}
          {autoPlay ? (
            <BsToggleOff size={24}></BsToggleOff>
          ) : (
            <BsToggleOn size={24}></BsToggleOn>
          )}
        </span>
      </div>
      {/* map list recommend */}
      {/* {[1, 2, 3, 4, 5, 6, 7, 8].map((el) => {
        return (
          <div key={el} className="flex gap-6 bg-main-200 border border-[#CED9D9] shadow-lg w-[100%] rounded-lg">
            <span className="absolute pt-3 pl-[30px]">
              <GrCaretNext size={24} />
            </span>
            <img src="" className="w-12 h-12 object-cover rounded-md ml-4" />
            <div className="flex flex-col gap-1 pl-2">
              <span className="font-bold text-[#111010]">Tên bài hát</span>
              <span className="text-sm text-[#171e1e]">Nghệ sỹ</span>
            </div>
          </div>
        );
      })} */}
    </div>
  );
};

export default SidebarRight;
