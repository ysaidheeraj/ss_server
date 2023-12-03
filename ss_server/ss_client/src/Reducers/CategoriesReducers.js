import {CATEGORIES_LIST_REQUEST, CATEGORIES_LIST_SUCCESS, CATEGORIES_LIST_FAIL} from "../Constants/CategoriesConstants";
import { CATEGORIES_CREATE_REQUEST, CATEGORIES_CREATE_RESET, CATEGORIES_CREATE_SUCCESS, CATEGORIES_CREATE_FAIL } from "../Constants/CategoriesConstants";
import { CATEGORY_DETAILS_REQUEST, CATEGORY_DETAILS_FAIL, CATEGORY_DETAILS_SUCCESS } from "../Constants/CategoriesConstants";
import { CATEGORY_UPDATE_REQUEST, CATEGORY_UPDATE_RESET, CATEGORY_UPDATE_SUCCESS, CATEGORY_UPDATE_FAIL } from "../Constants/CategoriesConstants";
import {CATEGORY_DELETE_FAIL, CATEGORY_DELETE_REQUEST, CATEGORY_DELETE_SUCCESS} from "../Constants/CategoriesConstants";
import { RESET_ALL_DATA } from "../Constants/StoreConstants";

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
        case RESET_ALL_DATA:
            return {categories: []}
        default:
            return state
    }
}

export const categoriesCreateReducer = (state = {}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case CATEGORIES_CREATE_REQUEST:
            return {loading: true}
        case CATEGORIES_CREATE_SUCCESS:
            return {loading: false, success: true, category: action.payload}
        case CATEGORIES_CREATE_FAIL:
            return {loading: false, error:action.payload}
        case CATEGORIES_CREATE_RESET:
            return {};
        case RESET_ALL_DATA:
            return {}
        default:
            return state;
    }
}

export const categoryDetailsReducer = (state = {category:{}}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case CATEGORY_DETAILS_REQUEST:
            return {loading: true, ...state}
        case CATEGORY_DETAILS_SUCCESS:
            return {loading: false, success: true, category: action.payload}
        case CATEGORY_DETAILS_FAIL:
            return {loading: false, error:action.payload}
        case RESET_ALL_DATA:
            return {category:{}}
        default:
            return state;
    }
}

export const categoryUpdateReducer = (state = {category:{}}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case CATEGORY_UPDATE_REQUEST:
            return {loading: true, ...state}
        case CATEGORY_UPDATE_SUCCESS:
            return {loading: false, success: true, category: action.payload}
        case CATEGORY_UPDATE_FAIL:
            return {loading: false, error:action.payload}
        case CATEGORY_UPDATE_RESET:
            return {category:{}};
        default:
            return state;
    }
}

export const categoryDeleteReducer = (state = {}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case CATEGORY_DELETE_REQUEST:
            return {loading: true}
        case CATEGORY_DELETE_SUCCESS:
            return {loading: false, success: true}
        case CATEGORY_DELETE_FAIL:
            return {loading: false, error:action.payload}
        default:
            return state
    }
}