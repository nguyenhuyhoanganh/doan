import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as api from "../../apis";
import moment from "moment";
import { Scrollbars } from "react-custom-scrollbars-2";
import List from "../../components/List";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions"

const Album = () => {
  const [songs, setSongs] = useState(null);
  const { title, aid } = useParams();
  const dispatch = useDispatch()
  const [album, setAlbum] = useState(null)
  const appData = useSelector(state => state.app)

  useEffect(() => {
    const getSongsByAId = async () => {
      const res = await api.apigetSongsByAlbumId(aid);
      if (res.data.code === 200) {
        setSongs(res?.data?.data);
        // dispatch(actions.setPlaylistData(res.data?.data?.song?.item))
        dispatch(actions.setPlaylistData(res.data?.data))
      }
    };
    getSongsByAId();
    const albumData = appData.banner.find(album => album.id === +aid);
    setAlbum(albumData)
  }, [aid, appData]);

  return (
    <div className="flex gap-4 w-full px-[40px]">
      <div className="flex-none w-[30%] flex flex-col items-center gap-2">
        <img
          className="object-contain rounded-md w-full shadow-md"
          src={album?.backgroundImageUrl}
          alt="thumbnailM"
        ></img>
        <h3 className="text-[20px] text-center font-semibold">{album?.title}</h3>
        <span>{album?.description}</span>
        <span>
          <span>Cập nhật: {album?.createdAt}</span>
          <span></span>
        </span>
      </div>
      <div className="flex-auto flex flex-col gap-5 h-screen">
        <h1 className="font-semibold text-[24px]">
          {/* {playlistData?.description} */}
        </h1>
        {/* playlist */}
        <Scrollbars className="pl-5" style={{ width: '100%', height: 510 }}>
          <List songs={songs} />
        </Scrollbars>
      </div>
    </div>
  );
};

export default Album;
