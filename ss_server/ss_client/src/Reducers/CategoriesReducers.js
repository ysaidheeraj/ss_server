import {CATEGORIES_LIST_REQUEST, CATEGORIES_LIST_SUCCESS, CATEGORIES_LIST_FAIL} from "../Constants/CategoriesConstants";

export const categoriesListReducer = (state = {categories:[]}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case CATEGORIES_LIST_REQUEST:
            return {loading: true, categories: []}
        case CATEGORIES_LIST_SUCCESS:
            return {loading: false, categories: action.payload}
        case CATEGORIES_LIST_FAIL:
            return {loading: false, error:action.payload}
        default:
            return state
    }
}