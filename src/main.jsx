import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './contexts/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
)

// Read QR/table param from URL (e.g. ?table=5) and store for Cart/ordering
try {
  const params = new URLSearchParams(window.location.search);
  const tableId = params.get('table') || params.get('table_id') || params.get('tableId');
  if (tableId) {
    localStorage.setItem('tableId', String(tableId));
  }
} catch (e) {
  // ignore
}
