// Mock data for table management
export const mockTables = [
  {
    id: 1,
    table_number: 'T001',
    table_name: 'Table 1',
    capacity: 4,
    location: 'Main Hall',
    status: 'available',
    qr_code: 'QR-T001-2024',
    description: 'Near the window, good for couples',
    created_at: '2024-10-20T10:00:00Z',
    current_order_id: null
  },
  {
    id: 2,
    table_number: 'T002',
    table_name: 'Table 2',
    capacity: 6,
    location: 'Main Hall',
    status: 'occupied',
    qr_code: 'QR-T002-2024',
    description: 'Large table for families',
    created_at: '2024-10-20T10:00:00Z',
    current_order_id: 1025
  },
  {
    id: 3,
    table_number: 'T003',
    table_name: 'Table 3',
    capacity: 2,
    location: 'Terrace',
    status: 'reserved',
    qr_code: 'QR-T003-2024',
    description: 'Outdoor seating with garden view',
    created_at: '2024-10-20T10:00:00Z',
    current_order_id: null
  },
  {
    id: 4,
    table_number: 'T004',
    table_name: 'VIP Table',
    capacity: 8,
    location: 'VIP Section',
    status: 'available',
    qr_code: 'QR-T004-2024',
    description: 'Premium table with privacy',
    created_at: '2024-10-20T10:00:00Z',
    current_order_id: null
  },
  {
    id: 5,
    table_number: 'T005',
    table_name: 'Table 5',
    capacity: 4,
    location: 'Main Hall',
    status: 'maintenance',
    qr_code: 'QR-T005-2024',
    description: 'Under maintenance',
    created_at: '2024-10-20T10:00:00Z',
    current_order_id: null
  }
];