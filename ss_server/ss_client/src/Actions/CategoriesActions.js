import {CATEGORIES_LIST_REQUEST, CATEGORIES_LIST_SUCCESS, CATEGORIES_LIST_FAIL, CATEGORY_DETAILS_REQUEST, CATEGORY_DETAILS_SUCCESS, CATEGORY_DETAILS_FAIL, CATEGORY_UPDATE_REQUEST, CATEGORY_UPDATE_SUCCESS, CATEGORY_UPDATE_FAIL} from "../Constants/CategoriesConstants";
import { CATEGORIES_CREATE_REQUEST, CATEGORIES_CREATE_SUCCESS, CATEGORIES_CREATE_FAIL } from "../Constants/CategoriesConstants";
import {CATEGORY_DELETE_FAIL, CATEGORY_DELETE_REQUEST, CATEGORY_DELETE_SUCCESS} from "../Constants/CategoriesConstants";
import axios from "axios";
import Notification from "../Components/Notification";

export const listCategories = () => async(dispatch, getState) =>{
    try{
        dispatch({type: CATEGORIES_LIST_REQUEST});
        
        const {data} = await axios.get(`/store/${getState().storeDetails.store.store_id}/categories/allcategories`);

        dispatch({
            type: CATEGORIES_LIST_SUCCESS,
            payload: data.Category
        });

    }catch(error){
        dispatch({
            type: CATEGORIES_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

export const createCategory = () => async(dispatch, getState) =>{
    try{
        dispatch({type: CATEGORIES_CREATE_REQUEST});

        const config = {
            headers : {
                'X-CSRFToken': getCookie('csrftoken')
            },
            withCredentials: true
        }

        const {data} = await axios.post(
            `/store/${getState().storeDetails.store.store_id}/categories/createcategory`,
            {},
            config
        );

        dispatch({
            type: CATEGORIES_CREATE_SUCCESS,
            payload: data.Category
        })

        Notification.success("Category created successfully");
    }catch(error){
        dispatch({
            type: CATEGORIES_CREATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
        if(error.response && error.response.data.detail){
            Notification.error(error.response.data.detail)
        }else{
            Notification.error("Sell Smart Internal Error")
        }
    }
}

export const listCategoryDetails = (id) => async(dispatch, getState) =>{
    try{
        dispatch({type: CATEGORY_DETAILS_REQUEST});

        const {data} = await axios.get(
            `/store/${getState().storeDetails.store.store_id}/categories/category/${id}`,
        );

        dispatch({
            type: CATEGORY_DETAILS_SUCCESS,
            payload: data.Category
        })
    }catch(error){
        dispatch({
            type: CATEGORY_DETAILS_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
    }
}

export const updateCategory = (category, id) => async(dispatch, getState) =>{
    try{
        dispatch({type: CATEGORY_UPDATE_REQUEST});

        const config = {
            headers : {
                'X-CSRFToken': getCookie('csrftoken')
            },
            withCredentials: true
        }

        if(category.category_picture){
            const formData = new FormData();
            formData.append('category_picture', category.category_picture);
            category = formData
        }

        const {data} = await axios.put(
            `/store/${getState().storeDetails.store.store_id}/categories/category/${id}`,
            category,
            config
        );

        dispatch({
            type: CATEGORY_UPDATE_SUCCESS,
            payload: data.Category
        })

        dispatch({
            type: CATEGORY_DETAILS_SUCCESS,
            payload: data.Category
        })

        Notification.success("Category updated successfully");
    }catch(error){
        dispatch({
            type: CATEGORY_UPDATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
        if(error.response && error.response.data.detail){
            Notification.error(error.response.data.detail)
        }else{
            Notification.error("Sell Smart Internal Error")
        }
    }
}

export const deleteCategory = (id) => async(dispatch, getState) =>{
    try{
        dispatch({type: CATEGORY_DELETE_REQUEST});

        const config = {
            headers : {
                'X-CSRFToken': getCookie('csrftoken')
            },
            withCredentials: true
        }

        const {data} = await axios.delete(
            `/store/${getState().storeDetails.store.store_id}/categories/category/${id}`,
            config
        );

        dispatch({
            type: CATEGORY_DELETE_SUCCESS
        })
        Notification.success("Category deleted successfully");
    }catch(error){
        dispatch({
            type: CATEGORY_DELETE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        })
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