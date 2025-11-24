import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Read QR/table param from URL (e.g. ?table=5) and store for Cart/ordering
try {
  const params = new URLSearchParams(window.location.search);
  const table = params.get('table') || params.get('table_number') || params.get('tableNumber');
  if (table) {
    localStorage.setItem('tableNumber', String(table));
  }
} catch (e) {
  // ignore
}
