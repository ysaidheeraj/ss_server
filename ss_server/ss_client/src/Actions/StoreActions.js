import { STORE_DETAILS_REQUEST, STORE_DETAILS_SUCCESS, STORE_DETAILS_FAIL, STORE_CREATE_REQUEST, STORE_CREATE_SUCCESS, STORE_CREATE_FAIL } from "../Constants/StoreConstants";
import { STORE_CREATE_TICKET_REQUEST, STORE_CREATE_TICKET_SUCCESS, STORE_CREATE_TICKET_FAIL } from "../Constants/StoreConstants";
import { STORE_UPDATE_REQUEST, STORE_UPDATE_SUCCESS, STORE_UPDATE_FAIL } from "../Constants/StoreConstants";
import axios from "axios";
import { SELLER_DETAILS_SUCCESS } from "../Constants/UserConstants";
import Notification from "../Components/Notification";

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

export const create_store = (storeName, storeDescription) => async(dispatch, getState) =>{
    try{
        dispatch({
            type: STORE_CREATE_REQUEST
        })

        const config = {
            headers : {
                'Content-type' : 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        }
        const {data} = await axios.post(
            `/stores/createstore`,
            {
                "store_name": storeName,
                "store_description": storeDescription
            },
            config
        )

        dispatch({
            type: STORE_CREATE_SUCCESS,
            payload: data.Store
        })

        dispatch({
            type: STORE_DETAILS_SUCCESS,
            payload: data.Store
        })

        dispatch({
            type: SELLER_DETAILS_SUCCESS,
            payload: data.seller
        })
        Notification.success("Store created successfully");

    }catch(error){
        dispatch({
            type: STORE_CREATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
        if(error.response && error.response.data.detail){
            Notification.error(error.response.data.detail)
        }else{
            Notification.error("Sell Smart Internal Error")
        }
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
        Notification.success("Query submitted successfully");

    }catch(error){
        dispatch({
            type: STORE_CREATE_TICKET_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
        if(error.response && error.response.data.detail){
            Notification.error(error.response.data.detail)
        }else{
            Notification.error("Sell Smart Internal Error")
        }
    }
}

export const update_store = (store) => async(dispatch, getState) =>{
    try{
        dispatch({
            type: STORE_UPDATE_REQUEST
        })

        const config = {
            headers : {
                'Content-type' : 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        }
        const {data} = await axios.put(
            `/stores/${getState().storeDetails.store.store_id}/update`,
            store,
            config
        )

        dispatch({
            type: STORE_UPDATE_SUCCESS,
            payload: data.Store
        })

        dispatch({
            type: STORE_DETAILS_SUCCESS,
            payload: data.Store
        })
        Notification.success("Store details updated successfully");

    }catch(error){
        dispatch({
            type: STORE_UPDATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
        if(error.response && error.response.data.detail){
            Notification.error(error.response.data.detail)
        }else{
            Notification.error("Sell Smart Internal Error")
        }
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}