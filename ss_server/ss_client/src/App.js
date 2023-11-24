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
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <Router>
      <Header />
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
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
