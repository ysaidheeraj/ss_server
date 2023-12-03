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
import {SSHomePage} from "./pages/SSHomePage";
import { ToastContainer } from "react-toastify";
import { ContactPage } from "./pages/ContactPage";
import { SellerRegisterPage } from "./pages/SellerRegisterPage";
import { SellerLoginPage } from "./pages/SellerLoginPage";
import { StoreCreatePage } from "./pages/StoreCreatePage";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  
  return (
    <div>
      
      (
        <Router>
          {/* <Header /> */}
          <main className="py-3">
            <Container>
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
              <Routes>
                <Route path="/" Component={SSHomePage} exact/>
                <Route path="register" Component={SellerRegisterPage} />
                <Route path="login" Component={SellerLoginPage} />
                <Route path="createstore" Component={StoreCreatePage} />
                <Route path="/store/:storeId" Component={Header}>
                  <Route path="" Component={HomePage} exact />
                  <Route path="product/:id" Component={ProductPage} />
                  <Route path="cart/:id?" Component={CartPage} />
                  <Route path="login" Component={LoginPage} />
                  <Route path="contact" Component={ContactPage} />
                  <Route path="register" Component={RegisterPage} />
                  <Route path="profile" Component={ProfilePage} />
                  <Route path="shipping" Component={ShippingPage} />
                  <Route path="payment" Component={PaymentPage} />
                  <Route path="placeorder" Component={PlaceOrderPage} />
                  <Route path="order/:id" Component={OrderDetailsPage} />
                  <Route path="myorders" Component={CustomerOrdersPage} />
                  <Route path="seller/customers" Component={CustomerListPage} />
                  <Route path="seller/products" Component={SellerProductList} />
                  <Route path="seller/product/:id/edit" Component={ProductEditPage} />
                  <Route path="seller/orders" Component={StoreOrdersPage} />
                  <Route path="seller/categories" Component={SellerCategoryList} />
                  <Route path="seller/category/:id/edit" Component={CategoryEditPage} />
                </Route>
              </Routes>
            </Container>
          </main>
          <Footer />
        </Router>
    </div>
    
  );
}

export default App;
