import { STORE_DETAILS_REQUEST, STORE_DETAILS_SUCCESS, STORE_DETAILS_FAIL } from "../Constants/StoreConstants";

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