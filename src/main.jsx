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
  // Accept both ?table=, ?table_id=, ?tableNumber=, ?tableId=
  const tableNumberParam = params.get('tableNumber') || params.get('table');
  const tableIdParam = params.get('table_id') || params.get('tableId');
  if (tableNumberParam) {
    // If QR code provides the actual table number (for display only)
    localStorage.setItem('tableNumber', String(tableNumberParam));
    localStorage.removeItem('tableId');
    localStorage.removeItem('tableDisplayNumber');
  } else if (tableIdParam) {
    // If QR code provides the table id, store it for order API calls
    localStorage.setItem('tableId', String(tableIdParam));
    localStorage.removeItem('tableNumber');
    localStorage.removeItem('tableDisplayNumber');
  }
} catch (e) {
  // ignore
}
