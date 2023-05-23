import { useState } from "react";
import icons from "../utils/icons";
import { useDispatch, useSelector } from "react-redux";
import SongMore from "../containers/public/SongMore";
import * as actions from "../../src/store/actions";
import SongItem from "../containers/public/SongItem";

const List = ({ songs, handleAfterDelete }) => {
  const dispatch = useDispatch()
  const handlePlay = (item) => {
    dispatch(actions.setCurSongId(item?.id));
    dispatch(actions.play(true));
    dispatch(actions.playAlbum(true));
    dispatch(actions.setPlaylistData(songs));
  };
  return (
    <div className="flex flex-col gap-2 pr-2 overflow-x-hidden p-2">
      {/*  playlist */}
      {songs?.map((item) => {
        return <SongItem key={item.id} handleAfterDelete={handleAfterDelete} item={item} songs={songs}></SongItem>;
      })}
    </div>
  );
};

export default List;
