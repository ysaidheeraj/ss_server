import axios from "axios";
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD } from "../Constants/CartConstants";

export const addToCart = (id, quantity) => async(dispatch, getState) =>{
    const {data} = await axios.get(`/store/${getState().storeDetails.store.store_id}/items/item/${id}`)
    const Item = data.Item;

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            item: Item.item_id,
            name: Item.item_name,
            image: Item.item_image,
            price: Item.item_price,
            available_count: Item.item_available_count,
            quantity
        }
    })

    // localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    });

    // localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

export const saveShippingAddress = (data) =>(dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data
    })

    // localStorage.setItem('shippingAddress', JSON.stringify(data));
}

export const savePaymentMethod = (data) =>(dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data
    })

    // localStorage.setItem('paymentMethod', JSON.stringify(data));
}