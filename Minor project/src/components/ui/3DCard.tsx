import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  glassEffect?: boolean;
}

const Card3D = ({ children, className = '', glassEffect = false }: Card3DProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();

    // Calculate the position of the mouse relative to the card 
    // (from -0.5 to 0.5 for both X and Y)
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;

    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className={`
        relative perspective-1000 transform-style-3d
        ${glassEffect ? 'glass-effect' : 'bg-white'}
        rounded-xl shadow-xl overflow-hidden
        ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        rotateY: isHovered ? mousePosition.x * 10 : 0,
        rotateX: isHovered ? -mousePosition.y * 10 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative z-10 p-6">
        {children}
      </div>
      
      {/* 3D lighting effect */}
      {isHovered && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0"
          style={{
            background: `radial-gradient(
              circle at ${(mousePosition.x + 0.5) * 100}% ${(mousePosition.y + 0.5) * 100}%,
              rgba(255, 255, 255, 0.3) 0%,
              rgba(255, 255, 255, 0) 70%
            )`
          }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default Card3D;