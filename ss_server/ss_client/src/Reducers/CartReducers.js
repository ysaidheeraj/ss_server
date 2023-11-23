import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../Constants/CartConstants";

export const CartReducer = (state = {cartItems:[]}, action) => {
    switch(action.type){
        case CART_ADD_ITEM:
            const cartItem = action.payload
            const isItemExist = state.cartItems.find(x => x.item === cartItem.item)
            if(isItemExist){
                return{
                    ...state,
                    cartItems: state.cartItems.map(x => 
                        x.item === isItemExist.item ? cartItem : x
                    )
                }
            }else{
                return{
                    ...state,
                    cartItems:[...state.cartItems, cartItem]
                }
            }
        case CART_REMOVE_ITEM:
            return{
                ...state,
                cartItems: state.cartItems.filter(x => x.item !== action.payload)
            }
        default:
            return state;
    }
}