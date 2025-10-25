#  Restaurant Admin Dashboard

A modern, responsive admin dashboard for restaurant management built with React and Vite. This application provides comprehensive tools for managing menu items, categories, orders, and restaurant operations.

##  Features

###  Menu Management
- **Complete CRUD Operations** - Create, read, update, and delete menu items
- **Category Management** - Organize menu items by categories
- **Dual Image Support** - Upload image files or use image URLs
- **Real-time Preview** - Live image preview while adding/editing items
- **Status Toggle** - Enable/disable menu items availability
- **Smart Filtering** - Search and filter by category

###  Modern UI/UX
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Toast Notifications** - Beautiful real-time feedback using react-hot-toast
- **Lucide Icons** - Clean, modern icon system
- **Professional Design** - Clean and intuitive interface
- **Loading States** - Smooth loading indicators and states

###  Technical Features
- **API Integration** - Full Laravel backend integration
- **Error Handling** - Comprehensive error handling and validation
- **File Upload** - Support for image file uploads with FormData
- **URL Images** - Support for external image URLs
- **Data Transformation** - Smart data mapping between frontend and backend

##  Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Laravel backend server running on `http://localhost:8000`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Seaklim123/Capstont-II.git
   cd Capstont-II
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm install react-router-dom
   npm install react-hot-toast
   npm install lucide-react
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

##  Database Schema

### Products Table
- `id` - Primary key (bigint unsigned)
- `name` - Product name (varchar 255)
- `image_path` - Product image URL/path (varchar 255, nullable)
- `price` - Product price (decimal 8,2, default 0.00)
- `discount` - Discount percentage (decimal 8,2, default 0.00)
- `description` - Product description (text, nullable)
- `status` - Product status (enum: 'available', 'unavailable')
- `category_id` - Foreign key to categories (bigint unsigned)
- `created_at` & `updated_at` - Timestamps

### Categories Table
- `id` - Primary key (bigint unsigned)
- `name` - Category name (varchar 255)
- `image_path` - Category image URL/path (varchar 255, nullable)
- `created_at` & `updated_at` - Timestamps

##  Built With

### Frontend Stack
- **⚛️ React 18** - Modern React with hooks
- **⚡ Vite** - Lightning-fast build tool
- **🎨 CSS3** - Custom styling with CSS variables
- **🔗 React Router** - Client-side routing
- **🎯 Lucide React** - Beautiful icon library
- **🍞 React Hot Toast** - Elegant toast notifications

### Backend Integration
- **🔌 Laravel API** - RESTful API integration
- **🗄️ MySQL Database** - Relational database
- **📡 Fetch API** - Modern HTTP client
- **📁 FormData** - File upload support
- **🔄 CORS** - Cross-origin resource sharing



##  Project Structure

```
src/
├── components/
│   ├── AdminLayout.jsx          # Main layout wrapper
│   ├── common/                  # Reusable components
│   └── MenuManagement/          # Menu-specific components
│       ├── MenuItemsTable.jsx   # Display menu items
│       ├── MenuItemForm.jsx     # Add/edit menu items
│       ├── CategoriesTable.jsx  # Display categories
│       └── CategoryForm.jsx     # Add/edit categories
├── pages/
│   ├── Dashboard.jsx            # Dashboard overview
│   ├── MenuManagement.jsx       # Main menu management
│   ├── OrdersManagement.jsx     # Orders handling
│   └── ...                     # Other admin pages
├── services/
│   └── api.js                   # API service layer
├── App.jsx                      # Main app component
├── App.css                      # Global styles
└── main.jsx                     # Entry point
```

##  API Endpoints

The application integrates with these Laravel API endpoints:

### Products (Menu Items)
- `GET /api/products` - Fetch all menu items
- `POST /api/products` - Create new menu item
- `PUT /api/products/{id}` - Update menu item
- `DELETE /api/products/{id}` - Delete menu item
- `PATCH /api/products/{id}` - Toggle item status

### Categories
- `GET /api/categories` - Fetch all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

##  Key Features Explained

### Dual Image Upload System
The application supports two methods for adding images:
- **File Upload**: Upload image files directly from your device
- **URL Input**: Paste image URLs from external sources

### Smart Data Transformation
- Automatic mapping between frontend and backend field names
- Price fallback system (uses discount if price is missing)
- Status boolean conversion (available/unavailable)
- Category relationship handling

### Toast Notification System
- Loading states for all operations
- Success confirmations
- Error handling with detailed messages
- No duplicate notifications

## Styling

The project uses a modern CSS approach with:
- **CSS Variables** for consistent theming
- **Flexbox & Grid** for layouts
- **Responsive Design** principles
- **Custom Components** styling
- **Professional Color Palette**

##  Data Flow

1. **User Action** → Component handles user input
2. **API Call** → Service layer makes HTTP request
3. **Data Transform** → Convert data between frontend/backend formats
4. **State Update** → React state management
5. **UI Update** → Re-render with new data
6. **Toast Feedback** → User notification

##  Error Handling

- **Network Errors** - Connection issues with backend
- **Validation Errors** - Form validation and server validation
- **File Upload Errors** - File size, type, and upload failures
- **Image Loading Errors** - Broken image URLs and fallbacks

##  Responsive Design

The dashboard is fully responsive with breakpoints for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint


