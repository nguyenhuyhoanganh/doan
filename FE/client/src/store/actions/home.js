import actionTypes from "./actionTypes";
import * as apis from "../../apis";
export const getHome = () => async (dispatch) => {
    try {
        // console.log("dispatch", dispatch)
        const response = await apis.getHome()
        const responseRelease = await apis.getNewRelease()
        if(response?.data.code === 200){
            // console.log('catch')
            dispatch({
                type: actionTypes.GET_HOME,
                homeData: response?.data?.data
                // send objiect action 
            })
        }else {
            dispatch({
                type: actionTypes.GET_HOME,
                homeData: null
            })
        }
    } catch (error) {
        dispatch({ 
            type: actionTypes.GET_HOME,
            homeData: null
        })
    }
} 
export const getNewRelease = () => async (dispatch) => {
    try {
        // console.log("dispatch", dispatch)
        const response = await apis.getNewRelease()
        if(response?.data.code === 200){
            // console.log('catch')
            dispatch({
                type: actionTypes.GET_NEW_RELEASE,
                newReleaseData: response?.data?.data
                // send objiect action 
            })
        }else {
            dispatch({
                type: actionTypes.GET_NEW_RELEASE,
                newReleaseData: null
            })
        }
    } catch (error) {
        dispatch({ 
            type: actionTypes.GET_NEW_RELEASE,
            newReleaseData: null
        })
    }
} 

export const getTop10 = () => async (dispatch) => {
    try {
        // console.log("dispatch", dispatch)
        const response = await apis.getTop10()
        if(response?.data.code === 200){
            // console.log('catch')
            dispatch({
                type: actionTypes.GET_TOP_10,
                top10: response?.data?.data
                // send objiect action 
            })
        }else {
            dispatch({
                type: actionTypes.GET_TOP_10,
                top10: null
            })
        }
    } catch (error) {
        dispatch({ 
            type: actionTypes.GET_TOP_10,
            top10: null
        })
    }
} 