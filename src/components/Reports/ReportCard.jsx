import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ReportCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon, 
  color = 'primary',
  loading = false 
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={16} className="text-success" />;
    if (trend === 'down') return <TrendingDown size={16} className="text-danger" />;
    return <Minus size={16} className="text-gray" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-danger';
    return 'text-gray';
  };

  if (loading) {
    return (
      <div className="report-card loading">
        <div className="report-card-header">
          <div className="report-card-icon skeleton"></div>
          <div className="report-card-trend skeleton"></div>
        </div>
        <div className="report-card-content">
          <div className="report-card-value skeleton"></div>
          <div className="report-card-title skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`report-card report-card-${color}`}>
      <div className="report-card-header">
        {Icon && (
          <div className="report-card-icon">
            <Icon size={20} />
          </div>
        )}
        {trend && (
          <div className="report-card-trend">
            {getTrendIcon()}
            <span className={getTrendColor()}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
      
      <div className="report-card-content">
        <div className="report-card-value">
          {value}
        </div>
        <div className="report-card-title">
          {title}
        </div>
        {subtitle && (
          <div className="report-card-subtitle">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCard;