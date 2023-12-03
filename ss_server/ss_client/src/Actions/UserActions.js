import { CUSTOMER_LOGIN_REQUEST, CUSTOMER_LOGIN_SUCCESS, CUSTOMER_LOGIN_FAIL, CUSTOMER_LOGOUT, CUSTOMER_REGISTER_REQUEST, CUSTOMER_REGISTER_SUCCESS, CUSTOMER_REGISTER_FAIL,
CUSTOMER_DETAILS_FAIL, CUSTOMER_DETAILS_SUCCESS, CUSTOMER_DETAILS_REQUEST, CUSTOMER_DETAILS_RESET, SELLER_LOGIN_REQUEST, SELLER_LOGIN_SUCCESS, SELLER_LOGIN_FAIL, SELLER_REGISTER_REQUEST, SELLER_REGISTER_FAIL, SELLER_REGISTER_SUCCESS, SELLER_LOGOUT, SELLER_DETAILS_RESET } from "../Constants/UserConstants";
import { CUSTOMER_UPDATE_REQUEST, CUSTOMER_UPDATE_SUCCESS, CUSTOMER_UPDATE_FAIL, CUSTOMER_UPDATE_RESET } from "../Constants/UserConstants";
import { CUSTOMER_LIST_FAIL, CUSTOMER_LIST_RESET, CUSTOMER_LIST_SUCCESS, CUSTOMER_LIST_REQUEST } from "../Constants/UserConstants";
import { ORDERS_LIST_RESET, SELLER_ORDERS_LIST_RESET } from "../Constants/OrderConstants";
import { SELLER_DETAILS_REQUEST, SELLER_DETAILS_SUCCESS, SELLER_DETAILS_FAIL } from "../Constants/UserConstants";
import axios from "axios";
import store_data from "./StoreActions";
import Notification from "../Components/Notification";


export const customer_login = (email, password) => async(dispatch, getState) =>{
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
            `/store/${getState().storeDetails.store.store_id}/storeuser/customer/login`,
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

export const seller_login = (email, password) => async(dispatch, getState) =>{
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
            `/storeusers/seller/login`,
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

        dispatch({
            type: SELLER_DETAILS_SUCCESS,
            payload: data.customer
        })

        localStorage.setItem('customerInfo', JSON.stringify(data.customer));
    }catch(error){
        dispatch({
            type: SELLER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

export const seller_register = (first_name, last_name, email, password) => async(dispatch, getState) =>{
    try{
        dispatch({
            type: SELLER_REGISTER_REQUEST
        })

        const config = {
            headers : {
                'Content-type' : 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        }
        const {data} = await axios.post(
            `/storeusers/seller/register`,
            {
                "email": email,
                "password": password,
                'first_name': first_name,
                "last_name": last_name
            },
            config
        )

        dispatch({
            type: SELLER_REGISTER_SUCCESS,
            payload: data.customer
        })

        //Customer is logged in on signup
        dispatch({
            type: SELLER_LOGIN_SUCCESS,
            payload: data.customer
        })

        dispatch({
            type: SELLER_DETAILS_SUCCESS,
            payload: data.customer
        })
        Notification.success("User registered successfully! Please check your email and confirm your account.")

        localStorage.setItem('customerInfo', JSON.stringify(data.customer));
    }catch(error){
        dispatch({
            type: SELLER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
        if(error.response && error.response.data.detail){
            Notification.error(error.response.data.detail)
        }else{
            Notification.error("Sell Smart Internal Error")
        }
    }
}

export const customer_register = (first_name, last_name, email, password, isSeller=false) => async(dispatch, getState) =>{
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
            `/store/${getState().storeDetails.store.store_id}/storeuser/customer/register`,
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

        dispatch({
            type: CUSTOMER_DETAILS_SUCCESS,
            payload: data.Store_User
        })

        Notification.success("User registered successfully! Please check your email and confirm your account.")

        localStorage.setItem('customerInfo', JSON.stringify(data.customer));
    }catch(error){
        dispatch({
            type: CUSTOMER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
        if(error.response && error.response.data.detail){
            Notification.error(error.response.data.detail)
        }else{
            Notification.error("Sell Smart Internal Error")
        }
    }
}

export const customer_details = () => async(dispatch, getState) =>{
    try{
        dispatch({
            type: CUSTOMER_DETAILS_REQUEST
        })

        const {data} = await axios.get(
            `/store/${getState().storeDetails.store.store_id}/storeuser/customer/customer`,
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

        if(customer.profile_picture){
            const formData = new FormData();
            formData.append('profile_picture', customer.profile_picture);
            customer = formData
        }

        const {data} = await axios.put(
            `/store/${getState().storeDetails.store.store_id}/storeuser/customer/update`,
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

        Notification.success("Details updated successfully!")

        localStorage.setItem('customerInfo', JSON.stringify(data.Store_User));

    }catch(error){
        dispatch({
            type: CUSTOMER_UPDATE_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
        if(error.response && error.response.data.detail){
            Notification.error(error.response.data.detail)
        }else{
            Notification.error("Sell Smart Internal Error")
        }
    }
}

export const list_store_customers = () => async(dispatch, getState) =>{
    try{
        dispatch({
            type: CUSTOMER_LIST_REQUEST
        })

        const config = {
            headers : {
                'X-CSRFToken': getCookie('csrftoken')
            },
            withCredentials: true
        }

        const {data} = await axios.get(
            `/store/${getState().storeDetails.store.store_id}/storeuser/seller/allcustomers`,
            config
        )

        dispatch({
            type: CUSTOMER_LIST_SUCCESS,
            payload: data.Store_User
        })

        localStorage.setItem('customerInfo', JSON.stringify(data.Store_User));

    }catch(error){
        dispatch({
            type: CUSTOMER_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}


export const customer_logout = () => async(dispatch, getState) =>{
    const config = {
        headers : {
            'X-CSRFToken': getCookie('csrftoken')
        }
    }
    const {data} = await axios.post(
        `/store/${getState().storeDetails.store.store_id}/storeuser/customer/logout`,
        { withCredentials: true },
        config
    )
    localStorage.removeItem('customerInfo');
    dispatch({
        type: CUSTOMER_LOGOUT
    })

    dispatch({
        type: CUSTOMER_DETAILS_RESET
    })

    //Reset the orders list on logout
    dispatch({
        type: ORDERS_LIST_RESET
    })

    //Removing customers list once seller logs out
    dispatch({
        type: CUSTOMER_LIST_RESET
    })

    //Removing store orders list once seller logs out
    dispatch({
        type: SELLER_ORDERS_LIST_RESET
    })
}

export const seller_logout = () => async(dispatch, getState) =>{
    const config = {
        headers : {
            'X-CSRFToken': getCookie('csrftoken')
        }
    }
    const {data} = await axios.post(
        `/storeusers/seller/logout`,
        { withCredentials: true },
        config
    )
    localStorage.removeItem('customerInfo');
    dispatch({
        type: SELLER_LOGOUT
    })

    dispatch({
        type: SELLER_DETAILS_RESET
    })
}

export const seller_details = () => async(dispatch, getState) =>{
    try{
        dispatch({
            type: SELLER_DETAILS_REQUEST
        })

        const {data} = await axios.get(
            `/storeusers/seller/details`,
            {withCredentials: true}
        )

        dispatch({
            type: SELLER_DETAILS_SUCCESS,
            payload: data.Store_User
        })

    }catch(error){
        
        dispatch({
            type: SELLER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
        });
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}