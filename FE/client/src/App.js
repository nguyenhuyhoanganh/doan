import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Home, Login, Pubic, Personal, Zingchart, Follow, Album, SongInfo } from "./containers/public/";
import { Routes, Route } from "react-router-dom";
import path from "./utils/path";
import { useEffect, useState } from "react";
import * as actions from './store/actions'
import {useDispatch} from 'react-redux'



function App() {
  const dispatch = useDispatch() // redux
  useEffect(() => {
    dispatch(actions.getHome())
  }, [])

  return (
    <>
      <div className="">
        <Routes>
          <Route path={path.PUBLIC} element={<Pubic/>}>
            // nằm trong rt khác thì lấy path cha + con
            <Route path={path.HOME} element={<Home />}/>
            <Route path={path.LOGIN} element={<Login/>}/>
            <Route path={path.MY_MUSIC} element={<Personal/>}/>
            <Route path={path.ZING_CHART} element={<Zingchart/>}/>
            <Route path={path.FOLLOW} element={<Follow />}/>
            <Route path={path.ALBUM__TITLE__PID} element={<Album />}/>
            <Route path={path.PLAYLIST__TITLE__PID} element={<Album />}/>
            <Route path={path.SONG__SID} element={<SongInfo />}/>

            <Route path={path.STAR} element={<Home/>}/>
          </Route>
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
    </>
  );
}

export default App;
