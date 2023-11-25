import { ITEM_LIST_SUCCESS, ITEM_LIST_REQUEST, ITEM_LIST_FAIL,
    ITEM_DETAILS_SUCCESS, ITEM_DETAILS_REQUEST, ITEM_DETAILS_FAIL,
    ITEM_DELETE_FAIL, ITEM_DELETE_REQUEST, ITEM_DELETE_SUCCESS
} from "../Constants/ItemConstants"
import axios from "axios";

export const listItems = () => async(dispatch) =>{
    try{
        dispatch({type: ITEM_LIST_REQUEST});
        
        const {data} = await axios.get('/store/1/items/allitems');

        dispatch({
            type: ITEM_LIST_SUCCESS,
            payload: data.Item
        });

    }catch(error){
        dispatch({
            type: ITEM_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

export const listItemDetails = (id) => async(dispatch) =>{
    try{
        dispatch({type: ITEM_DETAILS_REQUEST});
        
        const {data} = await axios.get(`/store/1/items/item/${id}`);

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

export const deleteItem = (id) => async(dispatch) =>{
    try{
        dispatch({type: ITEM_DELETE_REQUEST});

        const config = {
            headers : {
                'X-CSRFToken': getCookie('csrftoken')
            },
            withCredentials: true
        }
        
        const {data} = await axios.delete(`/store/1/items/item/${id}`, config);

        dispatch({
            type: ITEM_DELETE_SUCCESS
        });

    }catch(error){
        dispatch({
            type: ITEM_DELETE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}