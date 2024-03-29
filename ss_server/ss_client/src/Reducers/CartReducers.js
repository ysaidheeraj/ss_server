import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD, CART_RESET } from "../Constants/CartConstants";
import { RESET_ALL_DATA } from "../Constants/StoreConstants";

export const CartReducer = (state = {cartItems:[], shippingAddress: {}}, action) => {
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
        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload
            }
        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            }
        case CART_RESET:
            return {
                ...state,
                cartItems: []
            }
        case RESET_ALL_DATA:
            return {
                ...state,
                cartItems: []
            }
        default:
            return state;
    }
}