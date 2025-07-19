// src/components/MainToolbar.jsx
import React from 'react';
import { Camera, Type } from 'lucide-react';

const MainToolbar = ({
  onImageClick,
  paperType,
  setPaperType,
  toggleFormatMenu
}) => (
  <div className="main-toolbar side">
    {/* Resim */}
    <button onClick={onImageClick} title="Resim Ekle">
      <Camera className="icon" />
    </button>

    {/* Kâğıt Seçimi */}
    <select
      value={paperType}
      onChange={(e) => setPaperType(e.target.value)}
      title="Kâğıt Tipi"
    >
      <option value="lined">Çizgili</option>
      <option value="grid">Kareli</option>
      <option value="plain">Düz</option>
    </select>

    {/* Format Menüsü Aç/Kapa */}
    <button onClick={toggleFormatMenu} title="Biçimlendirme">
      <Type className="icon" />
    </button>
  </div>
);

export default MainToolbar;