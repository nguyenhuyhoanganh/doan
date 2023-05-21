import actionTypes from "./actionTypes";
import * as apis from "../../apis";
import { assign } from "lodash";
export const getHome = () => async (dispatch) => {
  try {
    // console.log("dispatch", dispatch)
    const response = await apis.getHome();
    // const responseRelease = await apis.getNewRelease();
    if (response?.data.code === 200) {
      // console.log('catch')
      dispatch({
        type: actionTypes.GET_HOME,
        homeData: response?.data?.data,
        // send objiect action
      });
    } else {
      dispatch({
        type: actionTypes.GET_HOME,
        homeData: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_HOME,
      homeData: null,
    });
  }
};
export const getNewRelease = () => async (dispatch) => {
  try {
    // console.log("dispatch", dispatch)
    const response = await apis.getNewRelease();
    if (response?.data.code === 200) {
      // console.log('catch')
      dispatch({
        type: actionTypes.GET_NEW_RELEASE,
        newReleaseData: response?.data?.data,
        // send objiect action
      });
    } else {
      dispatch({
        type: actionTypes.GET_NEW_RELEASE,
        newReleaseData: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_NEW_RELEASE,
      newReleaseData: null,
    });
  }
};

export const getTop10 = () => async (dispatch) => {
  try {
    // console.log("dispatch", dispatch)
    const response = await apis.getTop10();
    if (response?.data.code === 200) {
      // console.log('catch')
      dispatch({
        type: actionTypes.GET_TOP_10,
        top10: response?.data?.data,
        // send objiect action
      });
    } else {
      dispatch({
        type: actionTypes.GET_TOP_10,
        top10: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_TOP_10,
      top10: null,
    });
  }
};
export const getChartHome = () => async (dispatch) => {
  try {
    // console.log("dispatch", dispatch)
    const response = await apis.getChart();
    if (response?.data.code === 200) {
      // console.log('catch')
      dispatch({
        type: actionTypes.GET_CHART,
        chart: response?.data?.data,
        // send objiect action
      });
    } else {
      dispatch({
        type: actionTypes.GET_CHART,
        chart: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_CHART,
      chart: null,
    });
  }
};
export const getArtist = () => async (dispatch) => {
  try {
    // console.log("dispatch", dispatch)
    const response = await apis.apiGetArtists();
    if (response?.data.code === 200) {
      // console.log('catch')
      dispatch({
        type: actionTypes.GET_ARTIST,
        artists: response?.data?.data,
        // send objiect action
      });
    } else {
      dispatch({
        type: actionTypes.GET_ARTIST,
        artists: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_ARTIST,
      artists: null,
    });
  }
};

export const getComposer = () => async (dispatch) => {
  try {
    // console.log("dispatch", dispatch)
    const response = await apis.apiGetComposers();
    if (response?.data.code === 200) {
      // console.log('catch')
      dispatch({
        type: actionTypes.GET_COMPOSER,
        composers: response?.data?.data,
        // send objiect action
      });
    } else {
      dispatch({
        type: actionTypes.GET_COMPOSER,
        composers: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_COMPOSER,
      composers: null,
    });
  }
};

export const getPlaylistName = () => async (dispatch) => {
  try {
    // console.log("dispatch", dispatch)
    const response = await apis.apiGetPlaylist({
      limit: 40,
      orderBy: "createdAt",
    });
    if (response?.data.code === 200) {
      console.log(response);
      dispatch({
        type: actionTypes.GET_ALL_PLAYLIST_NAMES,
        myplaylist: response?.data?.data,
        // send objiect action
      });
    } else {
      dispatch({
        type: actionTypes.GET_ALL_PLAYLIST_NAMES,
        myplaylist: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_ALL_PLAYLIST_NAMES,
      myplaylist: null,
    });
  }
};

export const getAllSongs = () => async (dispatch) => {
  try {
    // console.log("dispatch", dispatch)
    const response = await apis.apiGetAllSongs({ limit: 99999 });
    if (response?.data.code === 200) {
      // console.log('catch')
      dispatch({
        type: actionTypes.GET_ALL_SONG,
        allsongs: response?.data?.data,
        // send objiect action
      });
    } else {
      dispatch({
        type: actionTypes.GET_ALL_SONG,
        allsongs: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionTypes.GET_ALL_SONG,
      allsongs: null,
    });
  }
};
