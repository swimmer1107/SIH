import React from 'react';

// FIX: Extend React.HTMLAttributes<HTMLDivElement> to allow passing standard div props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    // FIX: Spread the rest of the props onto the root div element.
    <div {...props} className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-none dark:border dark:border-gray-800 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;