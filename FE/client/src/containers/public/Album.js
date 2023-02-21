import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as api from "../../apis";
import moment from "moment";
import icons from "../../utils/icons";

const { GrCaretNext } = icons;
const Album = () => {
  const [playlistData, setPlaylistData] = useState(null);
  const { title, pid } = useParams();
  console.log({ title, pid });
  useEffect(() => {
    const fetchDetailPlaylist = async () => {
      const res = await api.apiGetDetailPlaylist(pid);
      if (res.data.err === 0) {
        setPlaylistData(res.data?.data);
        console.log(res);
      }
    };
    fetchDetailPlaylist();
  }, [pid]);

  return (
    <div className="flex gap-4 w-full px-[50px]">
      <div className="flex-none w-[30%] border border-red-500 flex flex-col items-center gap-2">
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
      <div className="flex-auto border border-blue-500 flex flex-col">
        {/* playlist */}
        <div className="flex gap-6 bg-main-200 border border-[#CED9D9] shadow-lg w-[100%] rounded-lg justify-between items-center">
          <span className="absolute pt-3 pl-[30px] ">
            <GrCaretNext size={24} className="hidden" />
          </span>
          <div className="flex">
            <img src="" className="w-12 h-12 object-cover rounded-md ml-4" />
            <div className="flex flex-col gap-1 pl-2">
              <span className="font-bold text-[#111010]">Tên bài hát</span>
              <span className="text-sm text-[#171e1e]">Nghệ sỹ</span>
            </div>
          </div>
          <span>4:00</span>
        </div>
      </div>
    </div>
  );
};

export default Album;
