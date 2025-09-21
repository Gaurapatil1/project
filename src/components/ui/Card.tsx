import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ 
  children, 
  className, 
  hoverable = false, 
  padding = 'md' 
}: CardProps) {
  return (
    <motion.div
      initial={hoverable ? { scale: 1 } : false}
      whileHover={hoverable ? { scale: 1.02, y: -2 } : false}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'bg-white rounded-xl border border-gray-200 shadow-sm',
        hoverable && 'cursor-pointer hover:shadow-md',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </motion.div>
  );
}