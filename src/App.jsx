import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import OrdersManagement from "./pages/OrdersManagement";
import MenuManagement from "./pages/MenuManagement";
import TableManagement from "./pages/TableManagement";
import UsersStaff from "./pages/UsersStaff";
import Reports from "./pages/Reports";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="admin-layout">
        <AdminLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<OrdersManagement />} />
            <Route path="/menu" element={<MenuManagement />} />
            <Route path="/tables" element={<TableManagement />} />
            <Route path="/users" element={<UsersStaff />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </AdminLayout>
      </div>
    </BrowserRouter>
  );
}

export default App;
