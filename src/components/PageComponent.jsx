// src/components/PageComponent.jsx
import React, { useEffect } from 'react';

const MAX_CHARS = 4000;

const PageComponent = ({
  initialHtml,
  isActive,
  editorRef,
  paperType,
  showFormat,
  onMouseDown // App.jsx'ten gelen sürükleme fonksiyonu
}) => {
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== initialHtml) {
      editorRef.current.innerHTML = initialHtml;
    }
  }, [initialHtml, editorRef]);

  useEffect(() => {
    if (!isActive || !editorRef.current) return;
    const editor = editorRef.current;

    const handleBeforeInput = (e) => {
      const textLength = editor.innerText.replace(/\n/g, '').length;
      if (textLength >= MAX_CHARS && e.inputType.includes('insert')) {
        e.preventDefault();
        alert(`Karakter limitine ulaşıldı (${MAX_CHARS}).`);
      }
    };
    editor.addEventListener('beforeinput', handleBeforeInput);
    return () => editor.removeEventListener('beforeinput', handleBeforeInput);
  }, [isActive, editorRef]);

  const exec = (cmd, arg = false, val = null) => document.execCommand(cmd, arg, val);

  const paperClass = paperType === 'plain' ? 'bg-plain' : paperType === 'grid' ? 'bg-grid' : 'bg-lines';

  return (
    <div className="page-wrapper">
      <div className={`page-bg ${paperClass}`} />
      
      {showFormat && (
        <div className="format-menu side">
          <button onClick={() => exec('bold')}><b>B</b></button>
          <button onClick={() => exec('italic')}><i>I</i></button>
          <input type="color" onChange={(e) => exec('foreColor', false, e.target.value)} defaultValue="#000000" />
          <input type="range" min="1" max="7" defaultValue="3" onChange={(e) => exec('fontSize', false, e.target.value)} />
          <select onChange={(e) => exec('fontName', false, e.target.value)}>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times</option>
            <option value="Comic Sans MS">Comic Sans</option>
          </select>
        </div>
      )}

      <div
        id="page"
        ref={editorRef}
        contentEditable={isActive}
        className="editable-content"
        style={{ lineHeight: '24px' }}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: initialHtml }}
        onMouseDown={onMouseDown}
      />
    </div>
  );
};

export default PageComponent;