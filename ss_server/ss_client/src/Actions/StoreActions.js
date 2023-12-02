import { STORE_DETAILS_REQUEST, STORE_DETAILS_SUCCESS, STORE_DETAILS_FAIL } from "../Constants/StoreConstants";
import axios from "axios";

export const listStoreDetails = (id) => async(dispatch) =>{
    try{
        dispatch({type: STORE_DETAILS_REQUEST});

    
        const {data} = await axios.get(
            `/stores/${id}`
        )

        dispatch({
            type: STORE_DETAILS_SUCCESS,
            payload: data.Store
        })
    }catch(error){
        dispatch({
            type: STORE_DETAILS_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}