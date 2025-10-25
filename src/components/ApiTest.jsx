// Simple API test component
import { useState, useEffect } from 'react';
import ApiService from '../services/api';

const ApiTest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('Initializing...');

  useEffect(() => {
    const testApi = async () => {
      try {
        setStep('🔄 Starting API test...');
        console.log('🚀 Starting API test');
        
        setStep('📡 Testing products endpoint...');
        const products = await ApiService.getProducts();
        console.log('✅ Products loaded:', products);
        
        setStep('📡 Testing categories endpoint...');
        const categories = await ApiService.getCategories();
        console.log('✅ Categories loaded:', categories);
        
        setStep('✅ All tests completed successfully!');
        setData({
          products,
          categories,
          apiUrl: 'http://localhost:8000/api',
          envVar: import.meta.env.VITE_API_BASE_URL
        });
      } catch (err) {
        console.error('❌ API Test failed:', err);
        setError(err.message);
        setStep('❌ Test failed');
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  return (
    <div style={{padding: '20px', border: '2px solid #ddd', borderRadius: '8px', margin: '20px 0'}}>
      <h3>🔍 API Connection Test</h3>
      <p><strong>Current Step:</strong> {step}</p>
      
      {loading && (
        <div style={{color: 'blue'}}>
          <p>⏳ Testing in progress...</p>
          <p>Check browser console for detailed logs</p>
        </div>
      )}
      
      {error && (
        <div style={{color: 'red', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px'}}>
          <h4>❌ Error Details:</h4>
          <p>{error}</p>
          <p><strong>Troubleshooting:</strong></p>
          <ul>
            <li>Make sure Laravel backend is running on http://localhost:8000</li>
            <li>Check browser console for more details</li>
            <li>Try accessing http://localhost:8000/api/products directly in browser</li>
          </ul>
        </div>
      )}
      
      {data && (
        <div style={{color: 'green'}}>
          <h4>✅ Success!</h4>
          <p><strong>API URL:</strong> {data.apiUrl}</p>
          <p><strong>Env Variable:</strong> {data.envVar || 'Not loaded'}</p>
          <p><strong>Products Found:</strong> {data.products?.length || 0}</p>
          <p><strong>Categories Found:</strong> {data.categories?.length || 0}</p>
          
          {data.products?.length > 0 && (
            <details style={{marginTop: '10px'}}>
              <summary>View Products Data</summary>
              <pre style={{backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto'}}>
                {JSON.stringify(data.products, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiTest;