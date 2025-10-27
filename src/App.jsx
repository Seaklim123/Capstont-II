import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import InputPage from "./pages/InputPage";
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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
