import { CUSTOMER_LOGIN_REQUEST, CUSTOMER_LOGIN_SUCCESS, CUSTOMER_LOGIN_FAIL, CUSTOMER_LOGOUT } from "../Constants/UserConstants";
import { CUSTOMER_REGISTER_REQUEST, CUSTOMER_REGISTER_SUCCESS, CUSTOMER_REGISTER_FAIL } from "../Constants/UserConstants";
import { CUSTOMER_UPDATE_REQUEST, CUSTOMER_UPDATE_SUCCESS, CUSTOMER_UPDATE_FAIL, CUSTOMER_UPDATE_RESET } from "../Constants/UserConstants";
import { CUSTOMER_DETAILS_REQUEST, CUSTOMER_DETAILS_SUCCESS, CUSTOMER_DETAILS_FAIL, CUSTOMER_DETAILS_RESET } from "../Constants/UserConstants";
import { SELLER_LOGIN_REQUEST, SELLER_LOGIN_SUCCESS, SELLER_LOGIN_FAIL, SELLER_LOGOUT } from "../Constants/UserConstants";

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

export const customerDetailsReducer = (state = {}, action) =>{
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
            return {customer:null}
        default:
            return state
    }
}

export const customerUpdateReducer = (state = {}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case CUSTOMER_UPDATE_REQUEST:
            return {loading: true, items: []}
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

export const sellerLoginReducer = (state = {}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case SELLER_LOGIN_REQUEST:
            return {loading: true, sellerInfo: {}}
        case SELLER_LOGIN_SUCCESS:
            return {loading: false, sellerInfo: action.payload}
        case SELLER_LOGIN_FAIL:
            return {loading: false, error:action.payload}
        case SELLER_LOGOUT:
            return {};
        default:
            return state
    }
}