import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { itemListReducer, itemDetailsReducer, itemDeleteReducer, itemCreateReducer, itemUpdateReducer, itemReviewCreate } from "./Reducers/ItemReducers";
import { CartReducer } from "./Reducers/CartReducers";
import { customerLoginReducer, customerSignupReducer, customerDetailsReducer, customerUpdateReducer, customerListReducer } from "./Reducers/UserReducer";
import { createOrderReducer, orderDetailsReducer, orderUpdateReducer, ordersListReducer, sellerOrdersListReducer } from "./Reducers/OrderReducers";
import { categoriesListReducer, categoriesCreateReducer, categoryDetailsReducer, categoryUpdateReducer, categoryDeleteReducer } from "./Reducers/CategoriesReducers";

const appReducer = combineReducers({
    itemList: itemListReducer,
    itemDetails: itemDetailsReducer,
    itemDelete: itemDeleteReducer,
    itemCreate: itemCreateReducer,
    itemUpdate: itemUpdateReducer,
    itemCreateReview: itemReviewCreate,
    
    cart: CartReducer,
    customerLogin: customerLoginReducer,
    customerRegister: customerSignupReducer,
    customerDetails: customerDetailsReducer,
    customerUpdateProfile: customerUpdateReducer,

    createOrder: createOrderReducer,
    orderDetails: orderDetailsReducer,
    orderUpdate: orderUpdateReducer,
    ordersList: ordersListReducer,
    sellerOrdersList: sellerOrdersListReducer,
    customerList: customerListReducer,

    categoriesList: categoriesListReducer,
    categoryCreate: categoriesCreateReducer,
    categoryDetails: categoryDetailsReducer,
    categoryUpdate: categoryUpdateReducer,
    categoryDelete: categoryDeleteReducer
});

const cartItemsFromStorage = localStorage.getItem('cartItems') ? 
        JSON.parse(localStorage.getItem('cartItems')) : [];

const customerInfoFromStorage = localStorage.getItem('customerInfo') ? 
        JSON.parse(localStorage.getItem('customerInfo')) : null;


const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? 
        JSON.parse(localStorage.getItem('shippingAddress')) : null;


const initState = {
    cart: {
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage
    },
    customerLogin: {customerInfo: customerInfoFromStorage},
};

const middleWare = [thunk]

const store = createStore(appReducer, initState, composeWithDevTools(applyMiddleware(...middleWare)));

export default store;
