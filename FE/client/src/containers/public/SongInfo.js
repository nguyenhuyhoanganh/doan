import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SkeletonComment } from "../../components";
import * as apis from "../../apis";
import formatDate from "../../utils/formatDay";

const SongInfo = () => {
  const [song, setSong] = useState(null);
  const [useSkeleton, setUseSkeleton] = useState(true);
  const [comments, setComments] = useState(null);
  const { curSongId } = useSelector((state) => state.music);
  useEffect(() => {
    const fetchInfoSong = async () => {
      setUseSkeleton(true);
      const res = await apis.apiGetDetailSong(curSongId);
      const res2 = await apis.apiGetCommentBySId(curSongId);
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
  }, [curSongId]);
  return (
    <div className="flex gap-5 p-5 w-full h-screen">
      <div
        title={`artist/${song?.artists[0]?.slug}`}
        className="w-[40%] border border-red-300 text-center h-[500px] flex flex-col items-center gap-1"
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
      <div className="w-[60%] border border-blue-300 h-[500px] flex gap-5 flex-col">
        <h1 className="font-extrabold text-[30px] text-[#0D7373]">Bình Luận</h1>
        <div className="flex flex-col w-auto mx-10 gap-2">
          {/* list bình luận */}
          {useSkeleton
            ? [1, 2, 3, 4].map((item, index) => {
                return <SkeletonComment key={index} className="w-[100%]" />;
              })
            : comments
            ? comments.map((comment) => {
                return (
                  <div className="flex">
                    <img src=""></img>
                    <div className="flex flex-col">
                      <h1 className="text-[20px] font-semibold">Name</h1>
                      <span>Nội dung</span>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
};

export default SongInfo;
