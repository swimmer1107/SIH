import React from 'react';

// FIX: Extend React.HTMLAttributes<HTMLDivElement> to allow passing standard div props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    // FIX: Spread the rest of the props onto the root div element.
    <div {...props} className={`bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-700 ${className}`}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
