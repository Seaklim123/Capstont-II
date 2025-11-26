import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PermissionGuard = ({ 
  permission, 
  requiredRole,
  fallbackMessage, 
  children,
  showIcon = true,
  className = "" 
}) => {
  const { hasPermission, hasRole } = useAuth();

  // Check permission or role
  const hasAccess = permission ? hasPermission(permission) : (requiredRole ? hasRole(requiredRole) : false);

  if (hasAccess && children) {
    return children;
  }

  if (!hasAccess) {
    return (
      <div className={`permission-denied-container ${className}`}>
        <div className="permission-denied-card">
          {showIcon && (
            <div className="permission-denied-icon">
              <Shield size={64} className="text-red-500" />
            </div>
          )}
          
          <div className="permission-denied-content">
            <h2 className="permission-denied-title">
              <AlertTriangle size={24} className="text-red-500 mr-2" />
              Access Denied
            </h2>
            
            <p className="permission-denied-message">
              {fallbackMessage || `You don't have permission to access this page. Required: ${permission || requiredRole}`}
            </p>
            
            <div className="permission-denied-help">
              <p className="text-sm text-gray-600">
                Contact your administrator if you believe you should have access to this area.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PermissionGuard;