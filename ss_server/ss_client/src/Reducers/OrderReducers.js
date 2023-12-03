import { CREATE_ORDER_FAIL, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, CREATE_ORDER_RESET } from "../Constants/OrderConstants";
import { ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL } from "../Constants/OrderConstants";
import { ORDER_UPDATE_REQUEST, ORDER_UPDATE_SUCCESS, ORDER_UPDATE_FAIL, ORDER_UPDATE_RESET } from "../Constants/OrderConstants";
import { ORDERS_LIST_FAIL, ORDERS_LIST_REQUEST, ORDERS_LIST_SUCCESS, ORDERS_LIST_RESET } from "../Constants/OrderConstants";
import { SELLER_ORDERS_LIST_FAIL, SELLER_ORDERS_LIST_REQUEST, SELLER_ORDERS_LIST_SUCCESS, SELLER_ORDERS_LIST_RESET } from "../Constants/OrderConstants";
import { RESET_ALL_DATA } from "../Constants/StoreConstants";

export const createOrderReducer = (state={}, action) =>{
    switch(action.type){
        case CREATE_ORDER_REQUEST:
            return {
                loading: true
            }
        case CREATE_ORDER_SUCCESS:
            return {
                loading: false,
                success: true,
                order: action.payload
            }
        case CREATE_ORDER_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case CREATE_ORDER_RESET:
            return {}
        default:
            return state
    }
}

export const orderDetailsReducer = (state={loading: true, orderItems:[], shippingAddress:{}}, action) =>{
    switch(action.type){
        case ORDER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case ORDER_DETAILS_SUCCESS:
            return {
                loading: false,
                order: action.payload
            }
        case ORDER_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case RESET_ALL_DATA:
            return {loading: true, orderItems:[], shippingAddress:{}}
        default:
            return state
    }
}

export const orderUpdateReducer = (state={}, action) =>{
    switch(action.type){
        case ORDER_UPDATE_REQUEST:
            return {
                loading: true
            }
        case ORDER_UPDATE_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case ORDER_UPDATE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ORDER_UPDATE_RESET:
            return {}
        default:
            return state
    }
}

export const ordersListReducer = (state={orders:[]}, action) =>{
    switch(action.type){
        case ORDERS_LIST_REQUEST:
            return {
                loading: true
            }
        case ORDERS_LIST_SUCCESS:
            return {
                loading: false,
                orders: action.payload
            }
        case ORDERS_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ORDERS_LIST_RESET:
            return {
                orders:[]
            }
        case RESET_ALL_DATA:
            return {orders:[]}
        default:
            return state
    }
}

export const sellerOrdersListReducer = (state={orders:[]}, action) =>{
    switch(action.type){
        case SELLER_ORDERS_LIST_REQUEST:
            return {
                loading: true
            }
        case SELLER_ORDERS_LIST_SUCCESS:
            return {
                loading: false,
                orders: action.payload
            }
        case SELLER_ORDERS_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case SELLER_ORDERS_LIST_RESET:
            return {
                orders:[]
            }
        case RESET_ALL_DATA:
            return {orders:[]}
        default:
            return state
    }
}