import React from "react"

const Card = React.forwardRef(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    style={{
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      ...style
    }}
    className={className}
    {...props}
  />
))
Card.displayName = "Card"

const CardContent = React.forwardRef(({ className, style, ...props }, ref) => (
  <div 
    ref={ref} 
    style={{ 
      padding: '24px',
      paddingTop: '0',
      ...style 
    }} 
    className={className} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

export { Card, CardContent }