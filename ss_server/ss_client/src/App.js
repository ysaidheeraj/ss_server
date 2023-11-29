import { Header } from "./Components/Header";
import { Footer } from "./Components/Footer";
import { Container } from "react-bootstrap";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ShippingPage } from "./pages/ShippingPage";
import { PaymentPage } from "./pages/PaymentPage";
import { PlaceOrderPage } from "./pages/PlaceOrderPage";
import { OrderDetailsPage } from "./pages/OrderDetailsPage";
import { CustomerOrdersPage } from "./pages/CustomerOrdersPage";
import { CustomerListPage } from "./pages/CustomerListPage";
import { SellerProductList } from "./pages/SellerProductList";
import { ProductEditPage } from "./pages/ProductEditPage";
import { StoreOrdersPage } from "./pages/StoreOrdersPage";
import { SellerCategoryList } from "./pages/SellerCategoryList";
import { CategoryEditPage } from "./pages/CategoryEditPage";
import { customer_details, customer_logout } from "./Actions/UserActions";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Loader } from "./Components/Loader";
import { useEffect } from "react";
import { Message } from "./Components/Message";
function App() {
  const dispatch = useDispatch();

  const customerDetails = useSelector((state) => state.customerDetails);
  const { error, loading, customer } = customerDetails;
  if(!customer && !loading && !error){
    dispatch(customer_details());
  }

  useEffect(() => {
    if(error === "Login Expired"){
      // If the login expires, we need to relogin
      dispatch(customer_logout());
    }
  }, [error]);
  return (
    <div>
      {!customer && loading ? (<Loader />):
      (
        <Router>
          <Header />
          {customer && !customer.isConfirmed && (
            <Message variant='warning'>Your account is not confirmed. Please check your email and confirm your account!</Message>
          )}
          <main className="py-3">
            <Container>
              <Routes>
                <Route path="/" Component={HomePage} exact />
                <Route path="/product/:id" Component={ProductPage} />
                <Route path="/cart/:id?" Component={CartPage} />
                <Route path="/login" Component={LoginPage} />
                <Route path="/register" Component={RegisterPage} />
                <Route path="/profile" Component={ProfilePage} />
                <Route path="/shipping" Component={ShippingPage} />
                <Route path="/payment" Component={PaymentPage} />
                <Route path="/placeorder" Component={PlaceOrderPage} />
                <Route path="/order/:id" Component={OrderDetailsPage} />
                <Route path="/myorders" Component={CustomerOrdersPage} />
                <Route path="/seller/customers" Component={CustomerListPage} />
                <Route path="/seller/products" Component={SellerProductList} />
                <Route path="/seller/product/:id/edit" Component={ProductEditPage} />
                <Route path="/seller/orders" Component={StoreOrdersPage} />
                <Route path="/seller/categories" Component={SellerCategoryList} />
                <Route path="/seller/category/:id/edit" Component={CategoryEditPage} />
              </Routes>
            </Container>
          </main>
          <Footer />
        </Router>
      )}
    </div>
    
  );
}

export default App;
