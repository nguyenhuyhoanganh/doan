import React, { useState, useEffect } from "react";
import formatDate from "../../utils/formatDay";
import Scrollbars from "react-custom-scrollbars-2";
import { List } from "../../components";
import { useParams } from "react-router-dom";
import * as apis from "../../apis";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth.context";

const Playlist = () => {
  const { pid } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([])
  const { isAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    const fetchSongPlaylist = async (pid) => {
      if (isAuthenticated) {
        const res = await apis.apiGetPlaylistById(pid);
        setSongs(res?.data?.data?.songs);
        setPlaylist(res?.data?.data)

      }
    };
    fetchSongPlaylist(pid);
  }, []);
  return (
    <div className="flex gap-4 w-full px-[40px]">
      <div className="flex-none w-[30%] flex flex-col items-center gap-2">
        <img
          className="object-contain rounded-md w-full shadow-md"
          src={songs.length !== 0? songs[0].imageUrl: process.env.PUBLIC_URL + "/LOGO.png"}
          alt="thumbnailM"
          ></img>
        <h3 className="text-[20px] text-center font-semibold">
          {playlist?.title}
        </h3>
        {/* <span>{songs?.description}</span> */}
        <span>
          <span>Cập nhật: {formatDate(playlist?.createdAt)}</span>
          <span></span>
        </span>
      </div>
      <div className="flex-auto flex flex-col gap-5 h-screen">
        <h1 className="font-semibold text-[24px]">
          {/* {playlistData?.description} */}
        </h1>
        {/* playlist */}
        {songs.length !== 0 ? (
          <Scrollbars className="pl-5" style={{ width: "100%", height: 510 }}>
            <List songs={songs} />
          </Scrollbars>
        ) : (
          "Chưa có bài hát nào"
        )}
      </div>
    </div>
  );
};

export default Playlist;
