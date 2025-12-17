import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// import Home from "./pages/Home";
import Menu from "./pages/Menu";
import InputPage from "./pages/InputPage";
import MenuManagement from "./pages/MenuManagement";
import AboutUs from "./pages/AboutUs";
import Discount from "./pages/Discount";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import ApiTest from "./pages/ApiTest";
// import Order from "./pages/Order";
import { Header } from "./components/header";
import SiteFooter from "./components/site-footer";
import "./styles/App.css";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/menu" element={<Menu />} />
            <Route path="/input" element={<InputPage />} />
            <Route path="/admin/menu-management" element={<MenuManagement />} />
            <Route path="/discount" element={<Discount />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/api-test" element={<ApiTest />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;
