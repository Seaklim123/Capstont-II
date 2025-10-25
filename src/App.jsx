import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import OrdersManagement from "./pages/OrdersManagement";
import MenuManagement from "./pages/MenuManagement";
import TableManagement from "./pages/TableManagement";
import UsersStaff from "./pages/UsersStaff";
import Reports from "./pages/Reports";
import "./styles/globals.css";
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
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              fontSize: '14px',
              fontWeight: '500',
              maxWidth: '400px',
            },
            success: {
              duration: 2000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
            loading: {
              iconTheme: {
                primary: '#6366f1',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
