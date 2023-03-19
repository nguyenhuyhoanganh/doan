import React from "react";
import { useSelector } from "react-redux";
import { List } from "../../components";
import { Scrollbars } from "react-custom-scrollbars-2";

const Search = () => {
  const { songs } = useSelector((state) => state.music);
  return (
    <Scrollbars className="pl-5" style={{ width: "100%", height: 610 }}>
      <div className="flex flex-col gap-5 m-4">
        <div className="flex flex-col">
          <h1 className="font-extrabold text-[30px] text-[#0D7373]">BÀI HÁT</h1>
          <List songs={songs} />
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="font-extrabold text-[30px] text-[#0D7373]">NGHỆ SĨ</h1>
          <div className="flex gap-3 w-full justify-center">
            <div className="w-[30%] h-[200px] border border-red-400">
              Nghệ sĩ
            </div>
            <div className="w-[30%] h-[200px] border border-red-400">
              Nghệ sĩ
            </div>
            <div className="w-[30%] h-[200px] border border-red-400">
              Nghệ sĩ
            </div>
          </div>
        </div>
      </div>
    </Scrollbars>
  );
};

export default Search;
