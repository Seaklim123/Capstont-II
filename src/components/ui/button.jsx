import React from "react"

const Button = React.forwardRef(({ className, variant = "default", size = "default", style, ...props }, ref) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s'
  }
  
  const variants = {
    default: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    destructive: {
      backgroundColor: '#dc2626',
      color: 'white'
    },
    outline: {
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      color: '#374151'
    },
    secondary: {
      backgroundColor: '#f3f4f6',
      color: '#111827'
    }
  }
  
  const sizes = {
    default: {
      height: '40px',
      padding: '8px 16px'
    },
    sm: {
      height: '36px',
      padding: '6px 12px'
    },
    lg: {
      height: '44px',
      padding: '10px 32px'
    }
  }

  return (
    <button
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
        ...style
      }}
      className={className}
      ref={ref}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button }