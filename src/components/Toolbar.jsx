// src/components/Toolbar.jsx
import React from 'react';

const Toolbar = ({ onClose }) => {
  return (
    <div className="toolbar">
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md shadow-lg rounded-full p-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
        >
          📕 Kapat
        </button>
      </div>
    </div>
  );
};

export default Toolbar;