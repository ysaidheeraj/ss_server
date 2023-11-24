import { ITEM_LIST_SUCCESS, ITEM_LIST_REQUEST, ITEM_LIST_FAIL,
    ITEM_DETAILS_SUCCESS, ITEM_DETAILS_REQUEST, ITEM_DETAILS_FAIL
} from "../Constants/ItemConstants"

export const itemListReducer = (state = {items:[]}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case ITEM_LIST_REQUEST:
            return {loading: true, items: []}
        case ITEM_LIST_SUCCESS:
            return {loading: false, items: action.payload}
        case ITEM_LIST_FAIL:
            return {loading: false, error:action.payload}
        default:
            return state
    }
}

export const itemDetailsReducer = (state = {item:{reviews:[]}}, action) =>{
    //Switch statement to determine the action type
    switch(action.type){
        //When the item list is loading
        case ITEM_DETAILS_REQUEST:
            return {loading: true, ...state}
        case ITEM_DETAILS_SUCCESS:
            return {loading: false, item: action.payload}
        case ITEM_DETAILS_FAIL:
            return {loading: false, error:action.payload}
        default:
            return state
    }
}