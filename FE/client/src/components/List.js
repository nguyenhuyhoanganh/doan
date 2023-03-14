import React from "react";
import icons from "../utils/icons";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../src/store/actions"


const { TbPlayerTrackNext } = icons;
const List = ({ songs}) => {

  const dispatch = useDispatch()
  // console.log(songs);
  const handleTime = (sec) => {
    let min = Math.floor(sec/60)
    let second = sec - Math.floor(sec/60)*60
    return second < 10? min + ':0' + second : min + ':' + second
  }
  return (
    <div className="flex flex-col gap-2 pr-2 overflow-x-hidden">
      {/*  playlist */}
      {songs?.map((item) => {
        return (
          <div
          onClick={() => {
            dispatch(actions.setCurSongId(item?.id))
            dispatch(actions.play(true))
            dispatch(actions.playAlbum(true))
            dispatch(actions.setPlaylistData(songs))
          }}
          key={item.id} className="flex relative gap-6 cursor-pointer hover:shadow-2xl hover:bg-main-400 bg-main-200 border border-main-400F w-[100%] h-auto rounded-lg justify-between items-center pr-[10px]">
            
            <span className="absolute pt-3 pl-[30px] top-0 left-0 hover:opacity-100 opacity-0">
              <TbPlayerTrackNext size={24} />
            </span>
            <div className="flex " title={item.title}>
              <img src={item.imageUrl} className="w-12 h-12 object-cover rounded-md ml-4" />
              <div className="flex flex-col gap-1 pl-2">
                <span className="font-bold text-[#111010]">{item.title.length < 40? item.title : `${item.title.slice(0, 40)}...`}</span>
                <span className="text-sm text-[#171e1e]">{item.artists[0].fullName}</span>
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
