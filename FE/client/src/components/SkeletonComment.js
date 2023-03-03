import React from "react";

const SkeletonComment = () => {
  return (
    <div class="flex items-center space-x-4 animate-pulse">
      <div class="w-14 h-14 bg-gray-400 rounded-md"></div>
      <div class="flex flex-col space-y-2">
        <div class="w-40 h-4 bg-gray-400 rounded"></div>
        <div class="w-32 h-3 bg-gray-400 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonComment;
