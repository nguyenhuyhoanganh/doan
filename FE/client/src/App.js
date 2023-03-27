import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Home, Login, Pubic, Personal, Chart, Follow, Album, SongInfo, Search, Register } from "./containers/public/";
import { Routes, Route } from "react-router-dom";
import path from "./utils/path";
import { useEffect, useState } from "react";
import * as actions from './store/actions'
import {useDispatch} from 'react-redux'
import TestSlide from "./containers/public/TestSlide";
import Art_Com from "./containers/public/Art_Com";
import SearchByVoice from "./containers/public/SearchByVoice";

// function ProtectedRoute() {
//   const { isAuthenticated } = useContext(AuthContext)
//   return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
// }

// // prevent authenticated user from returning to the login page
// function RejectedRoute() {
//   const { isAuthenticated } = useContext(AuthContext)
//   return !isAuthenticated ? <Outlet /> : <Navigate to={path.root} />
// }

function App() {
  const dispatch = useDispatch() // redux
  useEffect(() => {
    dispatch(actions.getHome())
    dispatch(actions.getNewRelease())
    dispatch(actions.getTop10())
  }, [])

  return (
    <>
      <div>
        <Routes>
          <Route path={path.PUBLIC} element={<Pubic/>}>
            // nằm trong rt khác thì lấy path cha + con
            <Route path={path.HOME} element={<Home />}/>
            <Route path={path.LOGIN} element={<Login/>}/>
            <Route path={path.MY_MUSIC} element={<Personal/>}/>
            <Route path={path.ZING_CHART} element={<Chart/>}/>
            <Route path={path.FOLLOW} element={<Follow />}/>
            <Route path={path.ALBUM__TITLE__PID} element={<Album />}/>
            <Route path={path.PLAYLIST__TITLE__PID} element={<Album />}/>
            <Route path={path.SONG__SID} element={<SongInfo />}/>
            <Route path={path.SEARCH} element={<Search />}/>
            <Route path={path.TEST} element={<TestSlide />}/>
            <Route path={path.ARTIST} element={<Art_Com />}/>
            <Route path={path.COMPOSER} element={<Art_Com />}/>
            <Route path={path.REGISTER} element={<Register />}/>
            <Route path={path.SEARCHBYVOICE} element={<SearchByVoice />}/>
            <Route path={path.LOGOUT} element={<Home />}/>
            
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
