import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { isAuthenticated, user, loading, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{
            color: '#64748b',
            fontSize: '16px',
            margin: 0
          }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="access-denied" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'white',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '1rem'
          }}></div>
          <h2 style={{
            color: '#ef4444',
            fontSize: '24px',
            fontWeight: '600',
            margin: '0 0 1rem 0'
          }}>
            Access Denied
          </h2>
          <p style={{
            color: '#64748b',
            fontSize: '16px',
            margin: '0 0 2rem 0',
            lineHeight: 1.5
          }}>
            You don't have permission to access this page. Required role: <strong>{requiredRole}</strong>
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="access-denied" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'white',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '1rem'
          }}>🔒</div>
          <h2 style={{
            color: '#f59e0b',
            fontSize: '24px',
            fontWeight: '600',
            margin: '0 0 1rem 0'
          }}>
            Insufficient Permissions
          </h2>
          <p style={{
            color: '#64748b',
            fontSize: '16px',
            margin: '0 0 2rem 0',
            lineHeight: 1.5
          }}>
            You don't have the required permission: <strong>{requiredPermission}</strong>
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return children;
};

export default ProtectedRoute;