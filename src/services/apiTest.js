// Test API Integration
// You can use this file to test your API functions manually in the browser console

import { categoryApi } from './api.js';

// Test functions - copy these to browser console to test

// 1. Test fetching all categories
const testGetAllCategories = async () => {
  try {
    console.log('Testing: Get All Categories');
    const result = await categoryApi.getAll();
    console.log('Success:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

// 2. Test creating a new category (text only)
const testCreateCategory = async () => {
  try {
    console.log('Testing: Create Category');
    const newCategory = {
      name: 'Test Category ' + Date.now()
    };
    const result = await categoryApi.create(newCategory);
    console.log('Success:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

// 3. Test updating a category (replace ID with actual category ID)
const testUpdateCategory = async (categoryId) => {
  try {
    console.log('Testing: Update Category');
    const updateData = {
      name: 'Updated Category ' + Date.now()
    };
    const result = await categoryApi.update(categoryId, updateData);
    console.log('Success:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

// 4. Test getting category by ID
const testGetCategoryById = async (categoryId) => {
  try {
    console.log('Testing: Get Category By ID');
    const result = await categoryApi.getById(categoryId);
    console.log('Success:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

// 5. Test deleting a category (replace ID with actual category ID)
const testDeleteCategory = async (categoryId) => {
  try {
    console.log('Testing: Delete Category');
    const result = await categoryApi.delete(categoryId);
    console.log('Success:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Export test functions
export {
  testGetAllCategories,
  testCreateCategory,
  testUpdateCategory,
  testGetCategoryById,
  testDeleteCategory
};

/* 
INSTRUCTIONS FOR TESTING:

1. Make sure your Laravel backend is running on http://127.0.0.1:8000
2. Open your browser's developer console
3. Navigate to /categories page in your app
4. In the console, run these commands one by one:

// Test fetching categories
testGetAllCategories()

// Test creating a category
testCreateCategory()

// Test getting specific category (replace 1 with actual ID)
testGetCategoryById(1)

// Test updating a category (replace 1 with actual ID)
testUpdateCategory(1)

// Test deleting a category (replace 1 with actual ID - BE CAREFUL!)
testDeleteCategory(1)

5. Check the network tab to see the actual HTTP requests being made
6. Verify the responses match your API documentation
*/