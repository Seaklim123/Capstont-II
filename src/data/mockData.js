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
    name: 'Main Dishes',
    value: '1', 
    label: 'Main Dishes',
    created_at: '2024-10-19T08:00:00Z',
    updated_at: '2024-10-19T08:00:00Z'
  },
  { 
    id: 2,
    name: 'Appetizers',
    value: '2', 
    label: 'Appetizers',
    created_at: '2024-10-19T08:00:00Z',
    updated_at: '2024-10-19T08:00:00Z'
  },
  { 
    id: 3,
    name: 'Sides',
    value: '3', 
    label: 'Sides',
    created_at: '2024-10-19T08:00:00Z',
    updated_at: '2024-10-19T08:00:00Z'
  },
  { 
    id: 4,
    name: 'Beverages',
    value: '4', 
    label: 'Beverages',
    created_at: '2024-10-19T08:00:00Z',
    updated_at: '2024-10-19T08:00:00Z'
  },
  { 
    id: 5,
    name: 'Desserts',
    value: '5', 
    label: 'Desserts',
    created_at: '2024-10-19T08:00:00Z',
    updated_at: '2024-10-19T08:00:00Z'
  }
];
