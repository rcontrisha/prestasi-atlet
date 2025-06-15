import React from 'react';

interface CardGridProps {
  image: string;
  title: string;
  description: string;
}

const CardGrid: React.FC<CardGridProps> = ({ image, title, description }) => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-1 bg-white shadow-md rounded-xl p-4 w-72 sm:w-80 hover:shadow-lg transition-shadow duration-300">
      <div className="row-span-2 flex items-center justify-center">
        <img src={image} alt={title} className="w-16 h-16 object-contain" />
      </div>
      <div className="font-bold text-base text-gray-700 truncate">{title}</div>
      <div className="col-start-2 row-start-2 font-bold text-2xl text-gray-700">{description}</div>
    </div>
  );
};

export default CardGrid;
