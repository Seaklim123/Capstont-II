# Copilot Instructions - QR Restaurant Frontend

## Project Overview
This is a React-based QR restaurant ordering system with table-based ordering, built with Vite. Customers scan QR codes to access the menu, add items to cart, and place orders linked to their table number. Features both guest (localStorage) and authenticated (Laravel backend API) modes.

## Architecture

### Dual-Mode Cart System (Critical)
The app supports **two cart modes** that must be handled consistently:
1. **Guest mode**: Cart stored in `localStorage.getItem('cart')` as JSON array
2. **Authenticated mode**: Cart synced to Laravel backend via `/v1/auth/cart` endpoints

Cart operations (`addToCart`, `updateQuantity`, `removeFromCart`) must check both `localStorage.getItem('token')` AND `localStorage.getItem('tableNumber')` to decide which mode to use. See `src/pages/Cart.jsx` lines 54-85 and `src/pages/Menu.jsx` lines 174-317 for reference implementation.

### Table Number Flow
- Table numbers are captured via `TableNumberModal` (auto-generates 1-20)
- Stored in `localStorage.setItem('tableNumber', value)`
- URL params (`?table=5`) are captured in `src/main.jsx` on load
- Required for checkout but not for browsing/adding to cart

### API Service Layer (`src/services/api.js`)
All backend communication goes through exported API objects:
- `categoryApi`, `productApi` - Public endpoints (no auth)
- `authCartApi`, `authOrdersApi`, `authPaymentApi` - Authenticated endpoints requiring token
- `adminProductApi`, `adminCategoryApi`, `adminOrderApi` - Admin endpoints
- `tableApi` - Table validation
- `cashierProductApi`, `cashierCategoryApi` - Cashier role endpoints

**Image URL transformation**: Backend returns paths like `storage/products/image.jpg`. Use `getImageUrl()` helper (lines 6-12) to convert to full URLs: `http://localhost:8000/storage/products/image.jpg`

## Key Development Patterns

### Environment Variables
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000';
```
Default backend: `http://localhost:8000` (Laravel backend expected)

### Import Aliases
Use `@/` prefix for src imports (configured in `vite.config.mjs`):
```javascript
import { Button } from "@/components/ui/button"
```

### UI Components
- Uses shadcn/ui components in `src/components/ui/` (button, card, input)
- Custom styling in `src/styles/*.css` (component-specific CSS files)
- Header cart count auto-updates via `window.addEventListener('cartUpdated')` custom event

### Cart Context (`src/contexts/CartContext.jsx`)
Global cart state using React Context. Provides:
- `cartItems`, `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
- `getCartTotal()`, `getCartCount()`
- Automatically syncs to localStorage on changes

**Important**: This context is used for UI state only. Cart persistence logic (localStorage vs backend) is handled in individual page components based on auth status.

## Development Workflow

### Running the App
```bash
npm install              # Install dependencies
npm run dev             # Start Vite dev server (port 5173)
npm run build           # Production build
npm run start           # Preview production build
npm run lint            # Run ESLint
```

### Upload Server (Separate Service)
Image uploads handled by separate Express server in `upload-server/`:
```bash
cd upload-server
npm install
node server.js          # Runs on port 3001
```
Uploads saved to `public/uploads/` in main project.

### Backend Dependencies
Laravel backend must be running on `http://localhost:8000` for full functionality:
- Products/categories: `/api/v1/auth/products`, `/api/v1/auth/categories`
- Cart operations: `/api/v1/auth/cart`
- Orders: `/api/v1/auth/orders`
- Admin: `/api/v1/admin/products`, `/api/v1/admin/categories`

Check backend connection in browser console - components log connection errors.

## Common Pitfalls

1. **Image URLs**: Always use `getImageUrl()` helper from `api.js` - don't hardcode paths
2. **Cart sync**: When modifying cart logic, update BOTH localStorage and API paths
3. **Table number validation**: Check `tableNumber` exists before calling authenticated cart endpoints
4. **Token storage**: Check both `localStorage.getItem('token')` and `localStorage.getItem('authToken')`
5. **Product data structure**: Backend may return `price` or `product.price` depending on endpoint - handle both

## File Organization
- `/src/pages/` - Route components (Home, Menu, Cart, Payment, etc.)
- `/src/components/` - Reusable components (header, footer, modals)
- `/src/components/ui/` - shadcn/ui primitive components
- `/src/contexts/` - React Context providers
- `/src/services/` - API integration layer
- `/src/styles/` - Component-specific CSS files
- `/upload-server/` - Standalone Express image upload service

## Admin Routes
- `/admin/menu-management` - CRUD for products & categories
- `/orders` - View all orders (admin/cashier view)

Uses `adminProductApi`, `adminCategoryApi`, `adminOrderApi` from `api.js`.
