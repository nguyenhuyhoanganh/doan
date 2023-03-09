import React from "react";

const Zingchart = () => {
  return (
    <div className="flex flex-col bg-main-200 h-full w-full p-5">
      <h1 className="font-extrabold text-[30px] text-[#0D7373]">#CHART</h1>
      <div className="flex flex-col">
        {/* Mỗi thẻ div là 1 bài hát */}
        <div className="flex gap-5 justify-between border border-[#CED9D9] shadow-lg mt-5 items-center">
          <span>1</span>
          <div className="flex gap-6 bg-main-200  w-[50%] rounded-lg">
            <img src="" className="w-12 h-12 object-cover rounded-md ml-4" />
            <div className="flex flex-col gap-1 pl-2">
              <span className="font-bold text-[#111010]">Tên bài hát</span>
              <span className="text-sm text-[#171e1e]">Nghệ sỹ</span>
            </div>
          </div>
          <span>Tên bài hátttttttttttttttttttttttt</span>
          <span>4:00</span>
        </div>

        <div>
          {/* Mỗi thẻ div là 1 bài hát */}
          <div className="flex gap-5 justify-between border border-[#CED9D9] shadow-lg mt-5 items-center">
            <span>2</span>
            <div className="flex gap-6 bg-main-200  w-[50%] rounded-lg">
              <img src="" className="w-12 h-12 object-cover rounded-md ml-4" />
              <div className="flex flex-col gap-1 pl-2">
                <span className="font-bold text-[#111010]">Tên bài hát</span>
                <span className="text-sm text-[#171e1e]">Nghệ sỹ</span>
              </div>
            </div>
            <span>Tên bài hátttttttttttttttttttttttt</span>
            <span>4:00</span>
          </div>
        </div>

        <div>
          {/* Mỗi thẻ div là 1 bài hát */}
          <div className="flex gap-5 justify-between border border-[#CED9D9] shadow-lg mt-5 items-center">
            <span>3</span>
            <div className="flex gap-6 bg-main-200  w-[50%] rounded-lg">
              <img src="" className="w-12 h-12 object-cover rounded-md ml-4" />
              <div className="flex flex-col gap-1 pl-2">
                <span className="font-bold text-[#111010]">Tên bài hát</span>
                <span className="text-sm text-[#171e1e]">Nghệ sỹ</span>
              </div>
            </div>
            <span>Tên bài hátttttttttttttttttttttttt</span>
            <span>4:00</span>
          </div>
        </div>
        <div className="flex cursor-pointer border border-gray-200 shadow-lg rounded-lg w-[20%] justify-center m-auto bg-main-400 p-3 mt-5">
          Xem top 100
        </div>
      </div>
    </div>
  );
};

export default Zingchart;
