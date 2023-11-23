import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { itemListReducer, itemDetailsReducer } from "./Reducers/ItemReducers";
import { CartReducer } from "./Reducers/CartReducers";
import { customerLoginReducer, sellerLoginReducer, customerSignupReducer, customerDetailsReducer } from "./Reducers/UserReducer";

const appReducer = combineReducers({
    itemList: itemListReducer,
    itemDetails: itemDetailsReducer,
    cart: CartReducer,
    customerLogin: customerLoginReducer,
    sellerLogin: sellerLoginReducer,
    customerRegister: customerSignupReducer,
    customerDetails: customerDetailsReducer
});

const cartItemsFromStorage = localStorage.getItem('cartItems') ? 
        JSON.parse(localStorage.getItem('cartItems')) : [];

const customerInfoFromStorage = localStorage.getItem('customerInfo') ? 
        JSON.parse(localStorage.getItem('customerInfo')) : null;

const sellerInfoFromStorage = localStorage.getItem('sellerInfo') ? 
        JSON.parse(localStorage.getItem('sellerInfo')) : null;


const initState = {
    cart: {cartItems: cartItemsFromStorage},
    customerLogin: {customerInfo: customerInfoFromStorage},
    sellerLogin: {sellerInfo: sellerInfoFromStorage}
};

const middleWare = [thunk]

const store = createStore(appReducer, initState, composeWithDevTools(applyMiddleware(...middleWare)));

export default store;
