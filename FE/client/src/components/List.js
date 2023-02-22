import React from "react";
import icons from "../utils/icons";
import { useDispatch } from "react-redux";
import * as actions from "../../src/store/actions"


const { GrCaretNext } = icons;
const List = ({ songs }) => {
  const dispatch = useDispatch()
  console.log(songs);
  const handleTime = (sec) => {
    let min = Math.floor(sec/60)
    let second = sec - Math.floor(sec/60)*60
    return second < 10? min + ':0' + second : min + ':' + second
  }
  return (
    <div className="flex flex-col gap-2 overflow-x-hidden">
      {/*  playlist */}
      {songs?.map((item) => {
        return (
          <div
          onClick={() => {
            dispatch(actions.setCurSongId(item?.encodeId))
            dispatch(actions.play(true))
          }}
          key={item.encodeId} className="flex gap-6 cursor-pointer hover:shadow-2xl hover:bg-main-400 bg-main-200 border border-main-400F w-[100%] h-auto rounded-lg justify-between items-center pr-[10px]">
            <span className="absolute pt-3 pl-[30px] ">
              <GrCaretNext size={24} className="hover:inline hidden" />
            </span>
            <div className="flex ">
              <img src={item.thumbnail} className="w-12 h-12 object-cover rounded-md ml-4" />
              <div className="flex flex-col gap-1 pl-2">
                <span className="font-bold text-[#111010]">{item.title}</span>
                <span className="text-sm text-[#171e1e]">{item.artistsNames}</span>
              </div>
            </div>
            <span>{handleTime(item.duration)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default List;
