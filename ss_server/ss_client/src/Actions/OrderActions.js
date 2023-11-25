import { CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAIL } from "../Constants/OrderConstants";
import { CART_RESET } from "../Constants/CartConstants";
import { ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL } from "../Constants/OrderConstants";
import axios from "axios";

export const create_order = (order) => async(dispatch, getState) =>{
    try{
        dispatch({
            type: CREATE_ORDER_REQUEST
        })

        const config = {
            headers : {
                'Content-type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            withCredentials: true
        }

        const {data} = await axios.post(
            'store/1/orders/customer/createorder',
            order,
            config
        )

        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data.Order
        })

        dispatch({
            type: CART_RESET,
            payload: data.Order
        })

        localStorage.removeItem('cartItems');

    }catch(error){
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

export const getOrderDetails = (id) => async(dispatch, getState) =>{
    try{
        dispatch({
            type: ORDER_DETAILS_REQUEST
        })

        const config = {
            headers : {
                'Content-type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            withCredentials: true
        }

        const {data} = await axios.get(
            `/store/1/orders/customer/order/${id}`,
            config
        )

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data.Order
        })

    }catch(error){
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}