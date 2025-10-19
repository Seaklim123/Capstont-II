// Enhanced mock data for menu CRUD operations with images and category management
export const menuItems = [
  {
    id: 1,
    name: 'Grilled Chicken Breast',
    category: 'main',
    price: 18.00,
    description: 'Tender grilled chicken breast with herbs and spices',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop',
    available: true,
    createdAt: '2024-10-19T09:00:00Z'
  },
  {
    id: 2,
    name: 'Caesar Salad',
    category: 'appetizer',
    price: 9.50,
    description: 'Fresh romaine lettuce with caesar dressing and croutons',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&h=300&fit=crop',
    available: true,
    createdAt: '2024-10-19T09:00:00Z'
  },
  {
    id: 3,
    name: 'Beef Burger',
    category: 'main',
    price: 15.00,
    description: 'Juicy beef patty with lettuce, tomato, and cheese',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    available: true,
    createdAt: '2024-10-19T09:00:00Z'
  },
  {
    id: 4,
    name: 'French Fries',
    category: 'side',
    price: 6.00,
    description: 'Crispy golden french fries',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&h=300&fit=crop',
    available: true,
    createdAt: '2024-10-19T09:00:00Z'
  },
  {
    id: 5,
    name: 'Coca Cola',
    category: 'beverage',
    price: 3.50,
    description: 'Classic cola soft drink',
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop',
    available: true,
    createdAt: '2024-10-19T09:00:00Z'
  }
];

export const categories = [
  { 
    id: 1,
    value: 'main', 
    label: 'Main Dishes',
    description: 'Primary course items',
    createdAt: '2024-10-19T08:00:00Z'
  },
  { 
    id: 2,
    value: 'appetizer', 
    label: 'Appetizers',
    description: 'Starter dishes and snacks',
    createdAt: '2024-10-19T08:00:00Z'
  },
  { 
    id: 3,
    value: 'side', 
    label: 'Sides',
    description: 'Side dishes and accompaniments',
    createdAt: '2024-10-19T08:00:00Z'
  },
  { 
    id: 4,
    value: 'beverage', 
    label: 'Beverages',
    description: 'Drinks and refreshments',
    createdAt: '2024-10-19T08:00:00Z'
  },
  { 
    id: 5,
    value: 'dessert', 
    label: 'Desserts',
    description: 'Sweet treats and desserts',
    createdAt: '2024-10-19T08:00:00Z'
  }
];
