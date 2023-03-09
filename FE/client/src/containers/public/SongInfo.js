import React from "react";
import { SkeletonComment } from "../../components";

const SongInfo = () => {
  return (
    <div className="flex gap-5 p-5 w-full h-screen">
      <div className="w-[40%] border border-red-300 h-[500px] flex flex-col items-center gap-1">
        <img
          className="object-contain rounded-md w-full shadow-md"
          src="https://avatar.talk.zdn.vn/def"
          alt="thumbnailM"
        ></img>
        <h3 className="text-[20px] font-semibold">Tiêu đề</h3>
        <span>Mô tả playlist</span>
        <span>
          <span>Cập nhật: </span>
          <span>12/12/2023</span>
        </span>
        <span>Lượt nghe: 1000</span>
      </div>
      <div className="w-[60%] border border-blue-300 h-[500px] flex gap-5 flex-col">
        <h1 className="font-extrabold text-[30px] text-[#0D7373]">Bình Luận</h1>
        <div className="flex flex-col w-auto mx-10 gap-2">
          {/* list bình luận */}
          {[1, 2, 3, 4].map((item, index) => {
            return <SkeletonComment key={index} className='w-[100%]' />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SongInfo;
