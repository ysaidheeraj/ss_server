import { CUSTOMER_LOGIN_REQUEST, CUSTOMER_LOGIN_SUCCESS, CUSTOMER_LOGIN_FAIL, CUSTOMER_LOGOUT, SELLER_LOGOUT } from "../Constants/UserConstants";
import { CUSTOMER_REGISTER_REQUEST, CUSTOMER_REGISTER_SUCCESS, CUSTOMER_REGISTER_FAIL } from "../Constants/UserConstants";
import { CUSTOMER_UPDATE_REQUEST, CUSTOMER_UPDATE_SUCCESS, CUSTOMER_UPDATE_FAIL, CUSTOMER_UPDATE_RESET } from "../Constants/UserConstants";
import { CUSTOMER_DETAILS_REQUEST, CUSTOMER_DETAILS_SUCCESS, CUSTOMER_DETAILS_FAIL, CUSTOMER_DETAILS_RESET } from "../Constants/UserConstants";
import { SELLER_LOGIN_REQUEST, SELLER_LOGIN_SUCCESS, SELLER_LOGIN_FAIL, SELLER_LOGIN_RESET } from "../Constants/UserConstants";
import { SELLER_REGISTER_REQUEST, SELLER_REGISTER_SUCCESS, SELLER_REGISTER_FAIL } from "../Constants/UserConstants";
import { CUSTOMER_LIST_FAIL, CUSTOMER_LIST_RESET, CUSTOMER_LIST_SUCCESS, CUSTOMER_LIST_REQUEST } from "../Constants/UserConstants";
import { SELLER_DETAILS_REQUEST, SELLER_DETAILS_SUCCESS, SELLER_DETAILS_FAIL, SELLER_DETAILS_RESET } from "../Constants/UserConstants";
import { RESET_ALL_DATA } from "../Constants/StoreConstants";

export const customerLoginReducer = (state = {}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case CUSTOMER_LOGIN_REQUEST:
            return {loading: true, customerInfo: {}}
        case CUSTOMER_LOGIN_SUCCESS:
            return {loading: false, customerInfo: action.payload}
        case CUSTOMER_LOGIN_FAIL:
            return {loading: false, error:action.payload}
        case CUSTOMER_LOGOUT:
            return {};
        default:
            return state
    }
}

export const customerSignupReducer = (state = {}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case CUSTOMER_REGISTER_REQUEST:
            return {loading: true, customerInfo: {}}
        case CUSTOMER_REGISTER_SUCCESS:
            return {loading: false, customerInfo: action.payload}
        case CUSTOMER_REGISTER_FAIL:
            return {loading: false, error:action.payload}
        default:
            return state
    }
}

export const customerDetailsReducer = (state = {customer:{}}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case CUSTOMER_DETAILS_REQUEST:
            return {loading: true, customer: {}}
        case CUSTOMER_DETAILS_SUCCESS:
            return {loading: false, customer: action.payload}
        case CUSTOMER_DETAILS_FAIL:
            return {loading: false, error:action.payload}
        case CUSTOMER_DETAILS_RESET:
            return {customer:{}}
        case RESET_ALL_DATA:
            return {customer:{}}
        default:
            return state
    }
}

export const customerUpdateReducer = (state = {}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case CUSTOMER_UPDATE_REQUEST:
            return {loading: true}
        case CUSTOMER_UPDATE_SUCCESS:
            return {loading: false, success:true, customerInfo: action.payload}
        case CUSTOMER_UPDATE_FAIL:
            return {loading: false, error:action.payload}
        case CUSTOMER_UPDATE_RESET:
            return {};
        default:
            return state
    }
}

export const customerListReducer = (state = {customers:[]}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case CUSTOMER_LIST_REQUEST:
            return {loading: true}
        case CUSTOMER_LIST_SUCCESS:
            return {loading: false, customers: action.payload}
        case CUSTOMER_LIST_FAIL:
            return {loading: false, error:action.payload}
        case CUSTOMER_LIST_RESET:
            return {customers:[]};
        default:
            return state
    }
}

export const sellerDetailsReducer = (state = {}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case SELLER_DETAILS_REQUEST:
            return {loading: true, seller: {}}
        case SELLER_DETAILS_SUCCESS:
            return {loading: false, seller: action.payload}
        case SELLER_DETAILS_FAIL:
            return {loading: false, error:action.payload}
        case SELLER_DETAILS_RESET:
            return {seller:null}
        default:
            return state
    }
}

export const sellerLoginReducer = (state = {}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case SELLER_LOGIN_REQUEST:
            return {loading: true, seller: {}}
        case SELLER_LOGIN_SUCCESS:
            return {loading: false, seller: action.payload}
        case SELLER_LOGIN_FAIL:
            return {loading: false, error:action.payload}
        case SELLER_LOGOUT:
            return {};
        default:
            return state
    }
}

export const sellerSignupReducer = (state = {}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case SELLER_REGISTER_REQUEST:
            return {loading: true, seller: {}}
        case SELLER_REGISTER_SUCCESS:
            return {loading: false, seller: action.payload}
        case SELLER_REGISTER_FAIL:
            return {loading: false, error:action.payload}
        default:
            return state
    }
}