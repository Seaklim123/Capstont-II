# 🍽️ Restaurant Admin Dashboard
 React admin dashboard for complete restaurant management - menu items, categories, tables, and QR code generation.

## 🚀 Quick Start for Testing

### Prerequisites
- Node.js (v16+)
- Laravel backend running on `http://localhost:8000`

### Installation & Run
```bash
git clone https://github.com/Seaklim123/Capstont-II.git
cd Capstont-II
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## 🎯 What You Can Test

### ✅ **Menu Management** (Real API - Fully Functional)
- ➕ Add menu items with images (file upload or URL)
- ✏️ Edit existing items and categories
- 🗑️ Delete items with confirmation
- 🔍 Search and filter by category
- 🟢/🔴 Toggle item availability
- 💾 **Data persists** - Changes saved to database

### ⚠️ **Table Management** (Mock Data - UI Demo Only)
- 🪑 Create tables with capacity and location
- 📱 Generate QR codes for each table (downloadable)
- 📊 View table statistics dashboard
- 🔄 Change table status (Available/Occupied/Maintenance)
- 🔍 Search tables by name, number, or location
- ⚠️ **Data resets on refresh** - Backend not implemented yet

### 🎨 **UI Features**
- 📱 Fully responsive design
- 🔔 Toast notifications for all actions
- ⚡ Fast loading and smooth animations
- 🎯 Intuitive navigation and layout

## 🧪 Testing Notes

### 🔗 **Current API Status**
- **Menu Management**: ✅ Fully connected to Laravel API
- **Table Management**: ⚠️ Using mock data (backend not built yet)
- **Orders, Reports, Users**: ⚠️ UI only (backend not built yet)
- **QR Codes**: ✅ Working with external API service

### 🛠️ **For Developers**
**Required**: Laravel backend running on `http://localhost:8000` for menu features.
Environment setup:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 📋 **Test Scenarios**
1. **Menu Items** (Real Data): Add/edit items with images, test search/filter
2. **Categories** (Real Data): Create categories, assign items to categories  
3. **Tables** (Demo Only): Create tables, generate QR codes, change status
4. **Responsive**: Test on mobile/tablet/desktop
5. **Error Handling**: Try invalid data, test network issues with menu API

### ⚠️ **Important Notes**
- **Menu data persists** and requires Laravel backend
- **Table data resets** on page refresh (mock data only)
- Other management pages show UI designs only

## 🛠️ Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Custom CSS with design system
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Backend**: Laravel API (Menu/Categories)
- **QR Codes**: External API service

## 📁 Key Components
```
src/
├── pages/
│   ├── MenuManagement.jsx    # Menu & category management
│   └── TableManagement.jsx   # Table & QR code management
├── components/
│   ├── MenuManagement/       # Menu-related components
│   └── TableManagement/      # Table-related components
└── services/
    └── api.js               # API integration layer
```

## 📞 Need Help?
---
**Built with ❤️ for modern restaurant management**


