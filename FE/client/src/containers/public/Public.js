import React from "react";
import { Outlet } from "react-router-dom";

const Public = () => {
  return (
    <div>
      Public
      <Outlet></Outlet>
    </div>
  );
};

export default Public;
