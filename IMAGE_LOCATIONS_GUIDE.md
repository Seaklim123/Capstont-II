# 🖼️ Image Display Locations in Your Frontend

## Summary
Your frontend displays product images in **4 main locations**. All images come from your backend API.

---

## 📍 Location 1: HOME PAGE - "Best Discount" Section

**File:** `src/pages/Home.jsx`  
**URL:** `http://localhost:5173/`

### What displays:
- Products with `discount > 0`
- Grid of 4 products per page (carousel)
- Shows: Image, Name, Price, Discount badge

### Code location (Line ~186):
```jsx
<div className="discount-item-image">
  <img 
    src={getImageUrl(item.image || item.image_path)} 
    alt={item.name}
    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
  />
</div>
```

### Image size: 
- **Width:** Full card width
- **Height:** 200px
- **Style:** `object-fit: cover` (fills area, maintains aspect ratio)

---

## 📍 Location 2: HOME PAGE - "New Food" Section

**File:** `src/pages/Home.jsx`  
**URL:** `http://localhost:5173/`

### What displays:
- Last 16 products (newest)
- Grid of 4 products per page (carousel)
- Shows: Image, Name, Price, Optional discount

### Code location (Line ~238):
```jsx
<div className="new-food-item-image">
  <img 
    src={getImageUrl(item.image || item.image_path)} 
    alt={item.name}
    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
  />
</div>
```

### Image size: 
- **Width:** Full card width
- **Height:** 200px
- **Style:** `object-fit: cover`

---

## 📍 Location 3: DISCOUNT PAGE - All Products Grid

**File:** `src/pages/Discount.jsx`  
**URL:** `http://localhost:5173/discount`

### What displays:
- ALL products from database
- Filter by category
- Grid layout showing all available products

### Code location (Line ~129):
```jsx
<img 
  src={getImageUrl(product.image || product.image_path)} 
  alt={product.name}
  onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
/>
```

### Image size:
- Set by `.dish-card img` CSS class
- Default: Responsive card width

---

## 📍 Location 4: PRODUCT DETAIL PAGE - Individual Product

**File:** `src/pages/ProductDetail.jsx`  
**URL:** `http://localhost:5173/product/{id}`

### What displays:
- Single product full details
- Large product image
- Product info, price, add to cart

### Code location (Line ~166):
```jsx
<img 
  src={getProductImageUrl(product.image || product.image_path)} 
  alt={product.name}
  onError={(e) => {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'block';
  }}
/>
```

### Image size:
- Large display area for product showcase
- Responsive to container

---

## 🔧 How Images Work

### Backend provides full URLs:
```json
{
  "id": 1,
  "name": "Spring Rolls",
  "image": "http://127.0.0.1:8000/Image/spring-rolls.jpg"
}
```

### Frontend processes in `getImageUrl()`:
```javascript
const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/150";  // No image → placeholder
  if (imagePath.startsWith('http')) return imagePath;        // Full URL → use as-is
  // ... other path handling
};
```

### Error handling:
- If image fails to load → Shows placeholder
- If no image path → Shows placeholder
- Placeholder: `https://via.placeholder.com/150`

---

## 📂 Where Backend Images Should Be

Your Laravel backend should have images in:
```
your-laravel-project/
  └── public/
      └── Image/
          ├── spring-rolls.jpg
          ├── chicken-wings.jpg
          ├── beef-steak.jpg
          └── ... (more images)
```

### Backend serves them at:
```
http://127.0.0.1:8000/Image/spring-rolls.jpg
http://127.0.0.1:8000/Image/chicken-wings.jpg
```

---

## ✅ Quick Test Checklist

To see images in each location:

1. ✅ **Home page "Best Discount"**
   - Visit: `http://localhost:5173/`
   - Scroll to "Our Dish" section
   - Products with discounts show here

2. ✅ **Home page "New Food"**
   - Visit: `http://localhost:5173/`
   - Scroll to "Our New Food" section
   - Latest products show here

3. ✅ **Discount page**
   - Visit: `http://localhost:5173/discount`
   - All products display in grid

4. ✅ **Product detail page**
   - Visit: `http://localhost:5173/product/1`
   - Large product image displays

---

## 🐛 If Images Don't Show

**Check in browser console (F12):**
1. Network tab → Look for 404 errors on images
2. Check image URLs being requested
3. Verify backend is serving images correctly

**Common issues:**
- ❌ Backend not running → `php artisan serve`
- ❌ Images don't exist in `public/Image/` folder
- ❌ Wrong file names in database
- ❌ CORS blocking requests

---

## 🎨 CSS Classes for Images

### Home page - Best Discount:
```css
.discount-item-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.discount-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### Home page - New Food:
```css
.new-food-item-image {
  height: 200px;
  overflow: hidden;
}

.new-food-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### Discount page:
```css
.dish-card img {
  /* Defined in Discount.css */
}
```

### Product detail page:
```css
.product-image {
  /* Defined in ProductDetail.css */
}
```

---

## 📊 Image Data Flow

```
Backend API (Laravel)
    ↓
http://127.0.0.1:8000/api/products
    ↓
Returns JSON with image URLs
    ↓
Frontend fetches with productApi.getAll()
    ↓
Processes through getImageUrl()
    ↓
Displays in <img> tags
    ↓
User sees images in interface
```

---

**Last Updated:** November 13, 2025
