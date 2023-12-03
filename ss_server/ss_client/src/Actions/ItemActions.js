import { ITEM_LIST_SUCCESS, ITEM_LIST_REQUEST, ITEM_LIST_FAIL,
    ITEM_DETAILS_SUCCESS, ITEM_DETAILS_REQUEST, ITEM_DETAILS_FAIL,
    ITEM_DELETE_FAIL, ITEM_DELETE_REQUEST, ITEM_DELETE_SUCCESS,
    ITEM_CREATE_FAIL, ITEM_CREATE_REQUEST, ITEM_CREATE_SUCCESS,
    ITEM_UPDATE_REQUEST, ITEM_UPDATE_FAIL, ITEM_UPDATE_SUCCESS,
    ITEM_CREATE_REVIEW_FAIL, ITEM_CREATE_REVIEW_REQUEST, ITEM_CREATE_REVIEW_SUCCESS
} from "../Constants/ItemConstants"
import Notification from "../Components/Notification";
import axios from "axios";

export const listItems = (searchQuery = '') => async(dispatch, getState) =>{
    try{
        dispatch({type: ITEM_LIST_REQUEST});
        
        const {data} = await axios.get(`/store/${getState().storeDetails.store.store_id}/items/allitems${searchQuery}`);

        dispatch({
            type: ITEM_LIST_SUCCESS,
            payload: data
        });

    }catch(error){
        dispatch({
            type: ITEM_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

export const listItemDetails = (id) => async(dispatch, getState) =>{
    try{
        dispatch({type: ITEM_DETAILS_REQUEST});
        
        const {data} = await axios.get(`/store/${getState().storeDetails.store.store_id}/items/item/${id}`);

        dispatch({
            type: ITEM_DETAILS_SUCCESS,
            payload: data.Item
        });

    }catch(error){
        dispatch({
            type: ITEM_DETAILS_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

export const deleteItem = (id) => async(dispatch, getState) =>{
    try{
        dispatch({type: ITEM_DELETE_REQUEST});

        const config = {
            headers : {
                'X-CSRFToken': getCookie('csrftoken')
            },
            withCredentials: true
        }
        
        const {data} = await axios.delete(`/store/${getState().storeDetails.store.store_id}/items/item/${id}`, config);

        dispatch({
            type: ITEM_DELETE_SUCCESS
        });

        Notification.success("Item deleted successfully")

    }catch(error){
        dispatch({
            type: ITEM_DELETE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
        if(error.response && error.response.data.detail){
            Notification.error(error.response.data.detail)
        }else{
            Notification.error("Sell Smart Internal Error")
        }
    }
}

export const createItem = () => async(dispatch, getState) =>{
    try{
        dispatch({type: ITEM_CREATE_REQUEST});

        const config = {
            headers : {
                'X-CSRFToken': getCookie('csrftoken')
            },
            withCredentials: true
        }
        
        const {data} = await axios.post(`/store/${getState().storeDetails.store.store_id}/items/createitem`, {}, config);

        dispatch({
            type: ITEM_CREATE_SUCCESS,
            payload: data.Item
        });

        Notification.success("Item created successfully")

    }catch(error){
        dispatch({
            type: ITEM_CREATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
        if(error.response && error.response.data.detail){
            Notification.error(error.response.data.detail)
        }else{
            Notification.error("Sell Smart Internal Error")
        }
    }
}

export const update_item_details = (item, id) => async(dispatch, getState) =>{
    try{
        dispatch({
            type: ITEM_UPDATE_REQUEST
        })

        const config = {
            headers : {
                'X-CSRFToken': getCookie('csrftoken')
            },
            withCredentials: true
        }

        if(item.item_image){
            const formData = new FormData();
            formData.append('item_image', item.item_image);
            item = formData
        }

        const {data} = await axios.put(
            `/store/${getState().storeDetails.store.store_id}/items/item/${id}`,
            item,
            config
        )

        dispatch({
            type: ITEM_UPDATE_SUCCESS,
            payload: data.Item
        })

        dispatch({
            type: ITEM_DETAILS_SUCCESS,
            payload: data.Item
        })

        Notification.success("Item details updated successfully");

    }catch(error){
        dispatch({
            type: ITEM_UPDATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
        if(error.response && error.response.data.detail){
            Notification.error(error.response.data.detail)
        }else{
            Notification.error("Sell Smart Internal Error")
        }
    }
}

export const create_item_review = (review, id) => async(dispatch, getState) =>{
    try{
        dispatch({
            type: ITEM_CREATE_REVIEW_REQUEST
        })

        const config = {
            headers : {
                'X-CSRFToken': getCookie('csrftoken')
            },
            withCredentials: true
        }

        const {data} = await axios.post(
            `/store/${getState().storeDetails.store.store_id}/reviews/item/${id}/createreview`,
            review,
            config
        )

        dispatch({
            type: ITEM_CREATE_REVIEW_SUCCESS,
            payload: data.Reviews
        })

        Notification.success("Review submitted successfully");

    }catch(error){
        dispatch({
            type: ITEM_CREATE_REVIEW_FAIL,
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