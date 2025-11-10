import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import InputPage from "./pages/InputPage";
import CategoryManagement from "./pages/CategoryManagement";
import AboutUs from "./pages/AboutUs";
import Discount from "./pages/Discount";
import ProductDetail from "./pages/ProductDetail";
// import Order from "./pages/Order";
import { Header } from "./components/header";
import "./styles/App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/input" element={<InputPage />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/discount" element={<Discount />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
