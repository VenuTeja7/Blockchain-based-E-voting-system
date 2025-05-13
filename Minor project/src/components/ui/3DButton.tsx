import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

const Button3D = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  type = 'button',
  loading = false
}: ButtonProps) => {
  // Define variant styles
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-light text-white',
    secondary: 'bg-secondary hover:bg-secondary-light text-white',
    accent: 'bg-accent hover:bg-accent-light text-text-primary',
    success: 'bg-success hover:bg-success/90 text-white',
    warning: 'bg-warning hover:bg-warning/90 text-text-primary',
    error: 'bg-error hover:bg-error/90 text-white',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative py-3 px-6 rounded-lg font-medium shadow-3d transform 
        transition-all duration-200 active:scale-95
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 active:translate-y-0'}
        ${className}
      `}
      whileHover={{ y: -4, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
      whileTap={{ y: 0, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)" }}
    >
      <span className={`flex items-center justify-center ${loading ? 'opacity-0' : ''}`}>
        {children}
      </span>
      
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      
      {/* 3D effect elements */}
      <div className="absolute inset-0 rounded-lg bg-black/5 transform translate-z-[-1px]"></div>
      <div className="absolute inset-0 rounded-lg bg-black/10 transform translate-z-[-2px]"></div>
    </motion.button>
  );
};

export default Button3D;