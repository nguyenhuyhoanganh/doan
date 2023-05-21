import React from "react";
import icons from "../utils/icons"
import { useDispatch } from "react-redux";
import * as actions from "../store/actions"

const Item = ({song}) => {
  const { FaRegPlayCircle } = icons;
  const dispatch = useDispatch();
  const handleTime = (sec) => {
    let min = Math.floor(sec / 60);
    let second = sec - Math.floor(sec / 60) * 60;
    return second < 10 ? min + ":0" + second : min + ":" + second;
  };
  return (
    <div className="group flex relative gap-6 cursor-pointer hover:shadow-2xl text-[#fff] border border-main-400F w-[100%] h-auto rounded-lg justify-between items-center pr-[10px]">
      <span
        onClick={() => {
          dispatch(actions.setCurSongId(song?.id));
          dispatch(actions.play(true));
        }}
        className="absolute pt-3 pl-[30px] top-0 left-0 hover:opacity-100 opacity-0"
      >
        <FaRegPlayCircle size={24} />
      </span>
      <div className="flex " title={song.title}>
        <img
          src={song.imageUrl}
          className="w-12 h-12 object-cover rounded-md ml-4"
        />
        <div className="flex flex-col gap-1 pl-2">
          <span className="font-bold text-[#fff]">
            {song.title.length < 20
              ? song.title
              : `${song.title.slice(0, 20)}...`}
          </span>
          <span className="text-sm text-[#fff]">
            {song?.artists !== undefined ? song?.artists[0]?.fullName : ""}
          </span>
        </div>
      </div>
      <span className="">{handleTime(song.duration)}</span>
      {/* <div className="group-hover:opacity-100 group-hover:visible opacity-0 hidden group-hover:flex"></div> */}
    </div>
  );
};

export default Item;
