import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { itemListReducer, itemDetailsReducer } from "./Reducers/ItemReducers";
import { CartReducer } from "./Reducers/CartReducers";
import { customerLoginReducer, sellerLoginReducer, customerSignupReducer, customerDetailsReducer, customerUpdateReducer } from "./Reducers/UserReducer";
import { createOrderReducer, orderDetailsReducer, orderUpdateReducer, ordersListReducer } from "./Reducers/OrderReducers";

const appReducer = combineReducers({
    itemList: itemListReducer,
    itemDetails: itemDetailsReducer,
    cart: CartReducer,
    customerLogin: customerLoginReducer,
    sellerLogin: sellerLoginReducer,
    customerRegister: customerSignupReducer,
    customerDetails: customerDetailsReducer,
    customerUpdateProfile: customerUpdateReducer,
    createOrder: createOrderReducer,
    orderDetails: orderDetailsReducer,
    orderUpdate: orderUpdateReducer,
    ordersList: ordersListReducer
});

const cartItemsFromStorage = localStorage.getItem('cartItems') ? 
        JSON.parse(localStorage.getItem('cartItems')) : [];

const customerInfoFromStorage = localStorage.getItem('customerInfo') ? 
        JSON.parse(localStorage.getItem('customerInfo')) : null;

const sellerInfoFromStorage = localStorage.getItem('sellerInfo') ? 
        JSON.parse(localStorage.getItem('sellerInfo')) : null;

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? 
        JSON.parse(localStorage.getItem('shippingAddress')) : null;


const initState = {
    cart: {
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage
    },
    customerLogin: {customerInfo: customerInfoFromStorage},
    sellerLogin: {sellerInfo: sellerInfoFromStorage}
};

const middleWare = [thunk]

const store = createStore(appReducer, initState, composeWithDevTools(applyMiddleware(...middleWare)));

export default store;
