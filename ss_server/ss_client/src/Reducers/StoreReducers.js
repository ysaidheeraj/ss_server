import { STORE_DETAILS_REQUEST, STORE_DETAILS_SUCCESS, STORE_DETAILS_FAIL } from "../Constants/StoreConstants";
import { STORE_CREATE_TICKET_REQUEST, STORE_CREATE_TICKET_SUCCESS, STORE_CREATE_TICKET_FAIL, STORE_CREATE_TICKET_RESET } from "../Constants/StoreConstants";
import { STORE_CREATE_REQUEST, STORE_CREATE_SUCCESS, STORE_CREATE_FAIL, STORE_CREATE_RESET } from "../Constants/StoreConstants";

export const storeDetailsReducer = (state = {}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case STORE_DETAILS_REQUEST:
            return {loading: true, store: {}}
        case STORE_DETAILS_SUCCESS:
            return {loading: false, store: action.payload}
        case STORE_DETAILS_FAIL:
            return {loading: false, error:action.payload}
        default:
            return state
    }
}

export const createStoreTicketReducer = (state = {}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case STORE_CREATE_TICKET_REQUEST:
            return {loading: true, ticket: {}}
        case STORE_CREATE_TICKET_SUCCESS:
            return {loading: false, success:true, ticket: action.payload}
        case STORE_CREATE_TICKET_FAIL:
            return {loading: false, error:action.payload}
        case STORE_CREATE_TICKET_RESET:
            return {}
        default:
            return state
    }
}

export const createStoreReducer = (state = {}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case STORE_CREATE_REQUEST:
            return {loading: true, store: {}}
        case STORE_CREATE_SUCCESS:
            return {loading: false, success:true, store: action.payload}
        case STORE_CREATE_FAIL:
            return {loading: false, error:action.payload}
        case STORE_CREATE_RESET:
            return {}
        default:
            return state
    }
}