import React from "react";

const SkeletonCard = () => {
  return (
    <div className="flex gap-3 justify-between cursor-pointer">
      {[1, 2, 3, 4, 5].map((item, index) => {
        return (
          <div
          key={index}
          className="flex flex-col bg-gray-500 w-[20%] h-[200px] items-center gap-2 text-center hover:shadow-md animate-pulse">
            {/* <img
              className="object-cover h-auto w-full rounded-sm"
              src=""
              alt="ảnh"
            ></img> */}
            <span className="font-semibold text-[12px]"></span>
            <span className="text-gray-500 text-[10px]"></span>
          </div>
        );
      })}
    </div>
  );
};

export default SkeletonCard;
