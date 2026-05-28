// Card component for LegalPro v1.0.1 - WCAG 2.1 AA Compliant
import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick,
  role,
  tabIndex,
  ...props
}) => {
  const baseClasses = "rounded-lg transition-all duration-200 focus:outline-none";

  const variantClasses = {
    default: "bg-white shadow-md border border-gray-200",
    elevated: "bg-white shadow-lg border border-gray-100",
    outlined: "bg-white border-2 border-gray-300",
    filled: "bg-gray-50 border border-gray-200"
  };

  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  const hoverClasses = hover ? "hover:shadow-lg transition-shadow duration-200" : "";
  const clickableClasses = clickable
    ? "cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
    : "";

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    hoverClasses,
    clickableClasses,
    className
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  if (clickable || onClick) {
    return (
      <motion.div
        whileHover={hover ? { y: -2 } : {}}
        whileTap={clickable ? { y: 0 } : {}}
        className={classes}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={role || "button"}
        tabIndex={tabIndex ?? 0}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      className={classes}
      role={role}
      tabIndex={tabIndex}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;