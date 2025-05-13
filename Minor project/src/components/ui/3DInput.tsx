import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface Input3DProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input3D = forwardRef<HTMLInputElement, Input3DProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    
    return (
      <div className="relative mb-4">
        <label className="block text-gray-700 mb-2 font-medium">
          {label}
        </label>
        
        <motion.div
          className={`
            relative rounded-lg overflow-hidden
            ${error ? 'shadow-[0_0_0_1px_#F44336]' : ''}
          `}
          animate={{
            y: focused ? -2 : 0,
            boxShadow: focused 
              ? '0 10px 25px -5px rgba(59, 76, 202, 0.4)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <input
            ref={ref}
            className={`
              w-full py-3 px-4 bg-white border rounded-lg
              focus:outline-none transition-all duration-200
              ${focused ? 'border-primary' : 'border-gray-300'}
              ${error ? 'border-error' : ''}
              ${className}
            `}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          
          {/* 3D bottom effect */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-100 transform translate-y-full"></div>
        </motion.div>
        
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input3D.displayName = 'Input3D';

export default Input3D;