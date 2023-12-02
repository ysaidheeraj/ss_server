import { STORE_DETAILS_REQUEST, STORE_DETAILS_SUCCESS, STORE_DETAILS_FAIL } from "../Constants/StoreConstants";
import { STORE_CREATE_TICKET_REQUEST, STORE_CREATE_TICKET_SUCCESS, STORE_CREATE_TICKET_FAIL, STORE_CREATE_TICKET_RESET } from "../Constants/StoreConstants";
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

export const createStoreTicket = (subject, mailBody) => async(dispatch, getState) =>{
    try{
        dispatch({
            type: STORE_CREATE_TICKET_REQUEST
        })

        const config = {
            headers : {
                'Content-type' : 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        }
        const {data} = await axios.post(
            `/stores/${getState().storeDetails.store.store_id}/createticket`,
            {
                "subject": subject,
                "body": mailBody
            },
            config
        )

        dispatch({
            type: STORE_CREATE_TICKET_SUCCESS,
            payload: data.Message
        })

    }catch(error){
        dispatch({
            type: STORE_CREATE_TICKET_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}