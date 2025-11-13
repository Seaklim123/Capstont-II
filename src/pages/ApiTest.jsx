import React, { useState } from 'react';
import { productApi, categoryApi } from '../services/api';

function ApiTest() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testProductsApi = async () => {
    setLoading(true);
    try {
      const response = await productApi.getAll();
      setTestResult({
        success: true,
        message: 'Products API Working!',
        data: response.data,
        count: response.data?.length || 0
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Products API Failed',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testCategoriesApi = async () => {
    setLoading(true);
    try {
      const response = await categoryApi.getAll();
      setTestResult({
        success: true,
        message: 'Categories API Working!',
        data: response.data,
        count: response.data?.length || 0
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Categories API Failed',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API Connection Test</h1>
      <p>Test your API connection to: <code>http://127.0.0.1:8000/api</code></p>
      
      <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
        <button 
          onClick={testProductsApi} 
          disabled={loading}
          style={{
            padding: '15px 30px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Products API
        </button>
        
        <button 
          onClick={testCategoriesApi} 
          disabled={loading}
          style={{
            padding: '15px 30px',
            fontSize: '16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Categories API
        </button>
      </div>

      {loading && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <p>Loading...</p>
        </div>
      )}

      {testResult && !loading && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: testResult.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${testResult.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px',
          color: testResult.success ? '#155724' : '#721c24'
        }}>
          <h3>{testResult.message}</h3>
          {testResult.success && (
            <p>Found {testResult.count} items</p>
          )}
          {testResult.error && (
            <p>Error: {testResult.error}</p>
          )}
          <details style={{ marginTop: '15px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Response Data</summary>
            <pre style={{ 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#fff', 
              borderRadius: '3px',
              overflow: 'auto',
              maxHeight: '400px'
            }}>
              {JSON.stringify(testResult.data, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
        <h3>Troubleshooting Steps:</h3>
        <ol style={{ lineHeight: '2' }}>
          <li>Make sure Laravel backend is running: <code>php artisan serve</code></li>
          <li>Check if API is accessible: Open <a href="http://127.0.0.1:8000/api/products" target="_blank">http://127.0.0.1:8000/api/products</a></li>
          <li>Check CORS settings in Laravel backend</li>
          <li>Check browser console for errors (F12)</li>
        </ol>
      </div>
    </div>
  );
}

export default ApiTest;
