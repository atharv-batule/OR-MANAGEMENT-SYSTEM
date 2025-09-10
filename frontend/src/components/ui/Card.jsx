import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseStyles = 'bg-white rounded-lg shadow';
  const hoverStyles = hover ? 'hover:shadow-md transition-shadow duration-200' : '';
  const cardClass = `${baseStyles} ${hoverStyles} ${className}`;

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-lg font-medium text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Title = CardTitle;

export default Card;
