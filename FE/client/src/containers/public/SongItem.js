import React from "react";
import { useState } from "react";
import icons from "../../utils/icons";
import { useDispatch } from "react-redux";
import SongMore from "../../containers/public/SongMore";
import * as actions from "../../store/actions";

const SongItem = ({ item, songs }) => {
  const { TbPlayerTrackNext, BsThreeDots } = icons;
  const dispatch = useDispatch();
  const handleTime = (sec) => {
    let min = Math.floor(sec / 60);
    let second = sec - Math.floor(sec / 60) * 60;
    return second < 10 ? min + ":0" + second : min + ":" + second;
  };
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const handleUpdateOpenInfo = (state) => setIsOpenInfo(state);

  return (
    <div className="group flex relative gap-6 cursor-pointer hover:shadow-2xl hover:bg-main-400 bg-main-200 border border-main-400F w-[100%] h-auto rounded-lg justify-between items-center pr-[10px]">
      <span
        onClick={() => {
          dispatch(actions.setCurSongId(item?.id));
          dispatch(actions.play(true));
          dispatch(actions.playAlbum(true));
          dispatch(actions.setPlaylistData(songs));
          console.log("play");
        }}
        className="absolute pt-3 pl-[30px] top-0 left-0 hover:opacity-100 opacity-0"
      >
        <TbPlayerTrackNext size={24} />
      </span>
      <div className="flex " title={item.title}>
        <img
          src={item.imageUrl}
          className="w-12 h-12 object-cover rounded-md ml-4"
        />
        <div className="flex flex-col gap-1 pl-2">
          <span className="font-bold text-[#111010]">
            {item.title.length < 40
              ? item.title
              : `${item.title.slice(0, 40)}...`}
          </span>
          <span className="text-sm text-[#171e1e]">
            {item?.artists !== undefined? item?.artists[0]?.fullName : ""}
          </span>
        </div>
      </div>
      <span className="group-hover:hidden">{handleTime(item.duration)}</span>
      <div className="group-hover:opacity-100 group-hover:visible opacity-0 hidden group-hover:flex">
        <SongMore
          song={item}
          onChangeOpen={handleUpdateOpenInfo}
          isOpen={isOpenInfo}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </div>
        </SongMore>
      </div>
    </div>
  );
};

export default SongItem;
