import React from "react"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      style={{
        display: 'flex',
        height: '40px',
        width: '100%',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        backgroundColor: 'white',
        padding: '8px 12px',
        fontSize: '14px',
        outline: 'none',
        ...props.style
      }}
      className={className}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }