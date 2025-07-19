import React, { useRef, useEffect, useState } from 'react';
import PageComponent from './components/PageComponent';
import CoverPage from './components/CoverPage';
import MainToolbar from './components/MainToolbar';
import { ChevronLeft, ChevronRight, Plus, Save } from 'lucide-react';


function App() {
  const [view, setView] = useState('cover');
  const [pages, setPages] = useState(['']); // Boş bir sayfa ile başla
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [paperType, setPaperType] = useState('lined'); // plain / lined / grid
  const [showFormat, setShowFormat] = useState(false);
  const editorRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fileInputRef = useRef(null);

  // Başlangıçta veriyi yükle
  useEffect(() => {
    const savedData = localStorage.getItem('notebook');
    if (savedData) {
      try {
        const parsedPages = JSON.parse(savedData);
        if (Array.isArray(parsedPages) && parsedPages.length > 0) {
          setPages(parsedPages);
        }
      } catch {
        setPages(['']);
      }
    }
    if (localStorage.getItem('view') === 'pages') {
      setView('pages');
    }
    const savedPaperType = localStorage.getItem('paperType');
    if (savedPaperType) {
      setPaperType(savedPaperType);
    }
  }, []);

  const handlePaperTypeChange = (value) => {
    setPaperType(value);
    localStorage.setItem('paperType', value);
  };

  // Geçişli görünüm değiştirme fonksiyonu
  const changeView = (newView) => {
    if (view === newView) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setView(newView);
      localStorage.setItem('view', newView);
      setIsTransitioning(false);
    }, 500); // CSS geçiş süresiyle eşleşmeli
  };

  // DOM'daki içeriği state'e kaydet
  const updateStateFromDOM = () => {
    if (!editorRef.current) return pages;
    const newPages = [...pages];
    newPages[activePageIndex] = editorRef.current.innerHTML;
    setPages(newPages);
    return newPages;
  };

  // Tüm defteri localStorage'a kaydet
  const handleSave = () => {
    const updatedPages = updateStateFromDOM();
    localStorage.setItem('notebook', JSON.stringify(updatedPages));
    alert('Defter kaydedildi!');
  };

  // Yeni boş sayfa ekle
  const addPage = () => {
    const updatedPages = updateStateFromDOM();
    const newPages = [...updatedPages, '']; // Boş sayfa ekle
    setPages(newPages);
    setActivePageIndex(updatedPages.length);
  };

  // Sayfalar arası gezin
  const changePage = (newIndex) => {
    if (newIndex === activePageIndex || newIndex < 0 || newIndex >= pages.length) return;
    updateStateFromDOM();
    setActivePageIndex(newIndex);
  };

  // Sürükleme mantığı artık App bileşeninde
  const handleMouseDown = (e) => {
    const target = e.target.closest('.image-wrapper');
    if (!target || e.target.closest('.delete-btn')) return;

    const editor = editorRef.current;
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = target.offsetLeft;
    const startTop = target.offsetTop;

    const move = (ev) => {
      ev.preventDefault();
      const newLeft = startLeft + (ev.clientX - startX);
      const newTop = startTop + (ev.clientY - startY);
      const maxX = editor.clientWidth - target.offsetWidth;
      const maxY = editor.clientHeight - target.offsetHeight;
      target.style.left = `${Math.max(0, Math.min(newLeft, maxX))}px`;
      target.style.top = `${Math.max(0, Math.min(newTop, maxY))}px`;
    };

    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  // Resim ekleme fonksiyonu güncellendi
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    
    const addImage = (src) => {
      if (!editorRef.current) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'image-wrapper group';
      wrapper.contentEditable = false;
      wrapper.style.top = `${editorRef.current.scrollTop + 20}px`;
      wrapper.style.left = '20px';
      wrapper.addEventListener('mousedown', handleMouseDown); // Sürükleme fonksiyonu doğrudan bağlanıyor

      const img = new Image();
      img.className = "w-full h-full block pointer-events-none";
      img.src = src;
      wrapper.appendChild(img);
      
      const deleteBtn = document.createElement('div');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = '✖';
      deleteBtn.onclick = (e) => { e.stopPropagation(); wrapper.remove(); };
      wrapper.appendChild(deleteBtn);
      
      editorRef.current.appendChild(wrapper);
    };

    reader.onload = () => {
      addImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file?.type.startsWith('image/')) handleImageUpload(file);
    event.target.value = null;
  };

  const handleImageClick = () => fileInputRef.current.click();

  const viewClasses = `w-full h-full transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`;

  return (
    <div className="h-full w-full pt-4">
      <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      {view === 'cover' ? (
        <div className={viewClasses}>
          <CoverPage onClick={() => changeView('pages')} />
        </div>
      ) : (
        <div className={viewClasses}>
          <MainToolbar
            onImageClick={handleImageClick}
            paperType={paperType}
            setPaperType={handlePaperTypeChange}
            toggleFormatMenu={() => setShowFormat(!showFormat)}
          />
          <div className="notebook-container">
            <button onClick={() => changePage(activePageIndex - 1)} disabled={activePageIndex === 0} className="nav-arrow left"><ChevronLeft size={24} /></button>
            <button onClick={() => changePage(activePageIndex + 1)} disabled={activePageIndex >= pages.length - 1} className="nav-arrow right"><ChevronRight size={24} /></button>
            
            <PageComponent
              key={activePageIndex}
              initialHtml={pages[activePageIndex]}
              isActive={true}
              editorRef={editorRef}
              paperType={paperType}
              showFormat={showFormat}
              onMouseDown={handleMouseDown} // Mevcut resimler için delegasyon
            />
          </div>
          
          <div className="global-actions">
            <button onClick={addPage} className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2 shadow-lg"><Plus size={16} /> Sayfa</button>
            <div className="page-indicator">{activePageIndex + 1} / {pages.length}</div>
            <button onClick={handleSave} className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center gap-2 shadow-lg"><Save size={16} /> Kaydet</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
