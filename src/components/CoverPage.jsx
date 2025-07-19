// src/components/CoverPage.jsx
import React from 'react';

const CoverPage = ({ onClick }) => {
  return (
    <div
      className="cover-bg-texture w-full h-full flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
      onClick={onClick}
    >
      <h1 className="text-5xl font-serif text-yellow-100/90 drop-shadow-md text-center px-4">
        Realistic Recipe Notebook
      </h1>
      <p className="text-yellow-100/70 mt-4">(Açmak için tıklayın)</p>
    </div>
  );
};

export default CoverPage;