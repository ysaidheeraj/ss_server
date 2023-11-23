import { CUSTOMER_LOGIN_REQUEST, CUSTOMER_LOGIN_SUCCESS, CUSTOMER_LOGIN_FAIL, CUSTOMER_LOGOUT, CUSTOMER_REGISTER_REQUEST, CUSTOMER_REGISTER_SUCCESS, CUSTOMER_REGISTER_FAIL,
CUSTOMER_DETAILS_FAIL, CUSTOMER_DETAILS_SUCCESS, CUSTOMER_DETAILS_REQUEST, CUSTOMER_DETAILS_RESET } from "../Constants/UserConstants";
import { CUSTOMER_UPDATE_REQUEST, CUSTOMER_UPDATE_SUCCESS, CUSTOMER_UPDATE_FAIL, CUSTOMER_UPDATE_RESET } from "../Constants/UserConstants";
import { SELLER_LOGIN_REQUEST, SELLER_LOGIN_SUCCESS, SELLER_LOGIN_FAIL, SELLER_LOGOUT } from "../Constants/UserConstants";
import axios from "axios";


export const customer_login = (email, password) => async(dispatch) =>{
    try{
        dispatch({
            type: CUSTOMER_LOGIN_REQUEST
        })

        const config = {
            headers : {
                'Content-type' : 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        }
        const {data} = await axios.post(
            '/store/1/storeuser/customer/login',
            {
                "email": email,
                "password": password
            },
            config
        )

        dispatch({
            type: CUSTOMER_LOGIN_SUCCESS,
            payload: data.customer
        })

        dispatch({
            type: CUSTOMER_DETAILS_SUCCESS,
            payload: data.customer
        })

        localStorage.setItem('customerInfo', JSON.stringify(data.customer));
    }catch(error){
        dispatch({
            type: CUSTOMER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

export const customer_register = (first_name, last_name, email, password) => async(dispatch) =>{
    try{
        dispatch({
            type: CUSTOMER_REGISTER_REQUEST
        })

        const config = {
            headers : {
                'Content-type' : 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        }
        const {data} = await axios.post(
            '/store/1/storeuser/customer/register',
            {
                "email": email,
                "password": password,
                'first_name': first_name,
                "last_name": last_name
            },
            config
        )

        dispatch({
            type: CUSTOMER_REGISTER_SUCCESS,
            payload: data.customer
        })

        //Customer is logged in on signup
        dispatch({
            type: CUSTOMER_LOGIN_SUCCESS,
            payload: data.customer
        })

        localStorage.setItem('customerInfo', JSON.stringify(data.customer));
    }catch(error){
        dispatch({
            type: CUSTOMER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

export const customer_details = () => async(dispatch) =>{
    try{
        dispatch({
            type: CUSTOMER_DETAILS_REQUEST
        })

        const {data} = await axios.get(
            '/store/1/storeuser/customer/customer',
            {withCredentials: true}
        )

        dispatch({
            type: CUSTOMER_DETAILS_SUCCESS,
            payload: data.Store_User
        })

        localStorage.setItem('customerInfo', JSON.stringify(data.Store_User));

    }catch(error){
        localStorage.removeItem('customerInfo');
        dispatch({
            type: CUSTOMER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

export const update_customer_details = (customer) => async(dispatch, getState) =>{
    try{
        dispatch({
            type: CUSTOMER_UPDATE_REQUEST
        })

        const config = {
            headers : {
                'X-CSRFToken': getCookie('csrftoken')
            },
            withCredentials: true
        }

        const {data} = await axios.put(
            '/store/1/storeuser/customer/update',
            customer,
            config
        )

        dispatch({
            type: CUSTOMER_UPDATE_SUCCESS,
            payload: data.Store_User
        })

        dispatch({
            type: CUSTOMER_LOGIN_SUCCESS,
            payload: data.Store_User
        })

        localStorage.setItem('customerInfo', JSON.stringify(data.Store_User));

    }catch(error){
        dispatch({
            type: CUSTOMER_UPDATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

export const seller_login = (email, password) => async(dispatch) =>{
    try{
        dispatch({
            type: SELLER_LOGIN_REQUEST
        })

        const config = {
            headers : {
                'Content-type' : 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        }
        const {data} = await axios.post(
            '/store/1/storeuser/seller/login',
            {
                "email": email,
                "password": password
            },
            config
        )

        dispatch({
            type: SELLER_LOGIN_SUCCESS,
            payload: data.customer
        })

        localStorage.setItem('sellerInfo', JSON.stringify(data.customer));
    }catch(error){
        dispatch({
            type: SELLER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

export const customer_logout = () => async(dispatch) =>{
    const config = {
        headers : {
            'X-CSRFToken': getCookie('csrftoken')
        }
    }
    const {data} = await axios.post(
        '/store/1/storeuser/customer/logout',
        { withCredentials: true },
        config
    )
    // localStorage.removeItem('customerInfo');
    dispatch({
        type: CUSTOMER_LOGOUT
    })

    dispatch({
        type: CUSTOMER_DETAILS_RESET
    })
}

export const seller_logout = () => async(dispatch) =>{
    const config = {
        headers : {
            'X-CSRFToken': getCookie('csrftoken')
        }
    }
    const {data} = await axios.post(
        '/store/1/storeuser/seller/logout',
        { withCredentials: true }
    )
    localStorage.removeItem('sellerInfo');
    dispatch({
        type: SELLER_LOGOUT
    })
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }