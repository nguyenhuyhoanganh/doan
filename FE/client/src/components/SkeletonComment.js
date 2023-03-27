import React from "react";

const SkeletonComment = () => {
  return (
    <div className="flex items-center space-x-4 animate-pulse">
      <div className="w-14 h-14 bg-gray-400 rounded-md"></div>
      <div className="flex flex-col space-y-2">
        <div className="w-40 h-4 bg-gray-400 rounded"></div>
        <div className="w-32 h-3 bg-gray-400 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonComment;
