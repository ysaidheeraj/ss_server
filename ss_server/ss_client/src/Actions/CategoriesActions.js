import {CATEGORIES_LIST_REQUEST, CATEGORIES_LIST_SUCCESS, CATEGORIES_LIST_FAIL} from "../Constants/CategoriesConstants";
import axios from "axios";

export const listCategories = () => async(dispatch) =>{
    try{
        dispatch({type: CATEGORIES_LIST_REQUEST});
        
        const {data} = await axios.get(`/store/1/categories/allcategories`);

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