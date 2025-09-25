import React from 'react'

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md', 
    lg: 'loading-lg'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <span className={`loading loading-spinner ${sizeClasses[size]} text-primary`}></span>
      {text && (
        <p className="text-base text-base-content/70 font-medium animate-pulse">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner