import actionTypes from "./actionTypes";
import * as apis from "../../apis";
export const getHome = () => async (dispatch) => {
    try {
        // console.log("dispatch", dispatch)
        const response = await apis.getHome()
        console.log(response.data)
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
