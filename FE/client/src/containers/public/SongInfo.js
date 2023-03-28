import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SkeletonComment } from "../../components";
import * as apis from "../../apis";
import formatDate from "../../utils/formatDay";
import SongComment from "./SongComment"
import { useParams } from "react-router-dom";

const SongInfo = () => {
  const [song, setSong] = useState(null);
  const [useSkeleton, setUseSkeleton] = useState(true);
  const [comments, setComments] = useState(null);
  // const { curSongId } = useSelector((state) => state.music);
  const {sid} = useParams()
  useEffect(() => {
    const fetchInfoSong = async () => {
      setUseSkeleton(true);
      const res = await apis.apiGetDetailSong(sid);
      const res2 = await apis.apiGetCommentBySId(sid);
      if (res.data?.code === 200) {
        setSong(res.data?.data[0]);
      }
      if (res2.data?.code === 200) {
        setComments(res2.data?.data);
      }
      // console.log(song)
      setUseSkeleton(false);
    };

    fetchInfoSong();
  }, [sid]);
  console.log(sid)
  return (
    <div className="flex gap-5 p-5 w-full h-screen">
      <div
        title={`artist/${song?.artists[0]?.slug}`}
        className="w-[40%] text-center h-[500px] flex flex-col items-center gap-1"
      >
        <img
          className="object-contain rounded-md w-full shadow-md"
          src={song?.backgroundImageUrl}
          alt="thumbnailM"
        ></img>
        <h3 className="text-[20px] font-semibold">{song?.title}</h3>
        <span>Thể loại: {song?.categories[0]?.title}</span>
        <span className="flex flex-col">
          <span>Nghệ sĩ: {song?.artists[0]?.fullName}</span>
          <span>Cập nhật: {formatDate(song?.updatedAt)}</span>
        </span>
        <span>Lượt nghe: {song?.view}</span>
      </div>
        <SongComment songId={sid}/>
    </div>
  );
};

export default SongInfo;
