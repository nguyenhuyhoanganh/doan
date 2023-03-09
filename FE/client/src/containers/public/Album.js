import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as api from "../../apis";
import moment from "moment";
import { Scrollbars } from "react-custom-scrollbars-2";
import List from "../../components/List";
import { useDispatch } from "react-redux";
import * as actions from "../../store/actions"

const Album = () => {
  const [playlistData, setPlaylistData] = useState(null);
  const { title, pid } = useParams();
  const dispatch = useDispatch()
  console.log({ title, pid });
  useEffect(() => {
    const fetchDetailPlaylist = async () => {
      const res = await api.apiGetDetailPlaylist(pid);
      if (res.data.err === 0) {
        setPlaylistData(res.data?.data);
        console.log(res.data.data);
        dispatch(actions.setPlaylistData(res.data?.data?.song?.items))
      }
    };
    fetchDetailPlaylist();
  }, [pid]);

  return (
    <div className="flex gap-4 w-full px-[40px]">
      <div className="flex-none w-[30%] flex flex-col items-center gap-2">
        <img
          className="object-contain rounded-md w-full shadow-md"
          src={playlistData?.thumbnailM}
          alt="thumbnailM"
        ></img>
        <h3 className="text-[20px] font-semibold">{playlistData?.title}</h3>
        <span>Mô tả playlist</span>
        <span>
          <span>Cập nhật</span>
          <span></span>
        </span>
      </div>
      <div className="flex-auto flex flex-col gap-5 h-screen">
        <h1 className="font-semibold text-[24px]">
          {playlistData?.description}
        </h1>
        {/* playlist */}
        <Scrollbars className="pl-5" style={{ width: '100%', height: 510 }}>
          <List songs={playlistData?.song.items} />
        </Scrollbars>
      </div>
    </div>
  );
};

export default Album;
