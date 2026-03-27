import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fx9Menu } from '../data/fx9Menu';

export default function FX9Menu({ onClose, values, setValues }) {
  const [activeCol, setActiveCol] = useState(1); // 1: Sidebar, 2: Items
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  
  const [path, setPath] = useState([]); // Array of selected indices tracing to current submenu
  const [cursorIndex, setCursorIndex] = useState(0); 
  
  const [editMode, setEditMode] = useState(false);
  const [tempValue, setTempValue] = useState(null);

  const dropdownListRef = useRef(null);

  const getCurrentContext = useCallback(() => {
    let current = fx9Menu[activeCategoryIndex].items || [];
    let breadcrumb = [fx9Menu[activeCategoryIndex].category];

    for (const index of path) {
      if (current[index] && current[index].children) {
        breadcrumb.push(current[index].name);
        current = current[index].children;
      }
    }
    return { items: current, breadcrumb };
  }, [activeCategoryIndex, path]);

  const { items: currentItems, breadcrumb } = getCurrentContext();

  const getValue = useCallback((item) => {
    if (values[item.name] !== undefined) return values[item.name];
    if (item.options) return item.options[0];
    if (item.value !== undefined) return item.value;
    return '';
  }, [values]);

  const handleKeyDown = useCallback((e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'Backspace'].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === 'm' || e.key === 'M') {
      onClose();
      return;
    }

    if (editMode) {
      const item = currentItems[cursorIndex];
      
      if (item.options) {
        const currentIndexInOptions = item.options.indexOf(tempValue);
        if (e.key === 'Escape' || e.key === 'ArrowLeft' || e.key === 'Backspace') {
          setEditMode(false);
        } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
          setValues(prev => ({ ...prev, [item.name]: tempValue }));
          setEditMode(false);
        } else if (e.key === 'ArrowUp') {
          if (currentIndexInOptions > 0) {
            setTempValue(item.options[currentIndexInOptions - 1]);
            const el = document.getElementById(`fx9-dropdown-option-${currentIndexInOptions - 1}`);
            if(el) el.scrollIntoView({ block: 'nearest' });
          }
        } else if (e.key === 'ArrowDown') {
          if (currentIndexInOptions < item.options.length - 1) {
            setTempValue(item.options[currentIndexInOptions + 1]);
            const el = document.getElementById(`fx9-dropdown-option-${currentIndexInOptions + 1}`);
            if(el) el.scrollIntoView({ block: 'nearest' });
          }
        }
      } else if (item.type === 'slider' || item.type === 'number') {
        if (e.key === 'Escape' || e.key === 'Backspace') {
          setEditMode(false);
        } else if (e.key === 'Enter') {
          setValues(prev => ({ ...prev, [item.name]: tempValue }));
          setEditMode(false);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
          const step = item.type === 'number' ? 100 : 1;
          const max = item.max !== undefined ? item.max : 10000;
          if (tempValue + step <= max) setTempValue(tempValue + step);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
          const step = item.type === 'number' ? 100 : 1;
          const min = item.min !== undefined ? item.min : 0;
          if (tempValue - step >= min) setTempValue(tempValue - step);
        }
      }
      return;
    }

    // Navigation mode
    if (activeCol === 1) {
      if (e.key === 'ArrowUp') {
        setActiveCategoryIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        setActiveCategoryIndex(prev => Math.min(fx9Menu.length - 1, prev + 1));
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        setActiveCol(2);
        setCursorIndex(0);
        setPath([]);
      }
    } else if (activeCol === 2) {
      if (e.key === 'ArrowUp') {
        setCursorIndex(prev => Math.max(0, prev - 1));
        const el = document.getElementById(`fx9-item-${Math.max(0, cursorIndex - 1)}`);
        if (el) el.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowDown') {
        setCursorIndex(prev => Math.min(currentItems.length - 1, prev + 1));
        const el = document.getElementById(`fx9-item-${Math.min(currentItems.length - 1, cursorIndex + 1)}`);
        if (el) el.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowLeft' || e.key === 'Escape' || e.key === 'Backspace') {
        if (path.length > 0) {
          const newPath = [...path];
          const lastIdx = newPath.pop();
          setPath(newPath);
          setCursorIndex(lastIdx);
        } else {
          setActiveCol(1);
          setCursorIndex(-1);
        }
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        const selectedItem = currentItems[cursorIndex];
        if (selectedItem?.type === 'submenu') {
          if (selectedItem.children && selectedItem.children.length > 0) {
            setPath(prev => [...prev, cursorIndex]);
            setCursorIndex(0);
          }
        } else if (selectedItem?.type === 'select' || selectedItem?.type === 'slider' || selectedItem?.type === 'number') {
          setTempValue(getValue(selectedItem));
          setEditMode(true);
        } else if (selectedItem?.type === 'action') {
          const el = document.getElementById(`fx9-item-${cursorIndex}`);
          if(el) {
             el.style.backgroundColor = 'white';
             el.style.color = 'black';
             setTimeout(() => {
                el.style.backgroundColor = '';
                el.style.color = '';
             }, 150);
          }
        }
      }
    }
  }, [editMode, path, cursorIndex, activeCol, activeCategoryIndex, currentItems, tempValue, getValue, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const activeItem = currentItems[cursorIndex];

  return (
    <div className="menu-container fx9-mode">
      <div className="menu-header" style={{borderBottomColor: 'var(--fx9-accent)'}}>
        FX9 MENU
      </div>
      <div className="menu-body">
        
        {/* Sidebar */}
        <div className="fx9-sidebar">
          {fx9Menu.map((cat, idx) => (
            <div 
              key={idx} 
              className={`fx9-cat-item ${activeCategoryIndex === idx ? 'active' : ''} ${activeCol === 1 && activeCategoryIndex === idx ? 'fx9-cat-active-indicator' : ''}`}
              style={{
                color: activeCategoryIndex === idx ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
              onClick={() => {
                setActiveCategoryIndex(idx);
                setCursorIndex(-1);
                setPath([]);
                setEditMode(false);
                setActiveCol(1);
              }}
            >
              <span>{cat.icon}</span> {cat.category}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="menu-col-3">
          {path.length > 0 && (
            <div className="submenu-path">
              {breadcrumb.join(' > ')}
            </div>
          )}
          
          {currentItems && currentItems.map((item, idx) => (
            <div 
              id={`fx9-item-${idx}`}
              key={idx} 
              className={`setting-item ${activeCol === 2 && cursorIndex === idx ? 'selected' : ''}`}
              onClick={() => {
                setActiveCol(2);
                setCursorIndex(idx);
                if (item.type === 'submenu' && item.children) {
                  setPath(prev => [...prev, idx]);
                  setCursorIndex(0);
                } else if (item.type === 'select' || item.type === 'slider' || item.type === 'number') {
                  setTempValue(getValue(item));
                  setEditMode(true);
                }
              }}
            >
              <div className="setting-name">{item.name}</div>
              <div className="setting-value">
                {item.type === 'submenu' ? 'ᐳ' : 
                 item.type === 'action' ? 'Execute' : 
                 getValue(item)}
              </div>
            </div>
          ))}
          {(!currentItems || currentItems.length === 0) && (
            <div style={{padding: '20px 30px', color: '#888'}}>Empty</div>
          )}
        </div>

        {/* Overlays for Edit Mode */}
        {editMode && activeItem?.type === 'select' && (
          <div className="dropdown-overlay">
            <div className="dropdown-container">
              <div className="dropdown-header">
                {activeItem.name}
              </div>
              <div className="dropdown-list" ref={dropdownListRef}>
                {activeItem.options.map((opt, idx) => (
                  <div 
                    key={idx} 
                    id={`fx9-dropdown-option-${idx}`}
                    className={`dropdown-item ${tempValue === opt ? 'active' : ''}`}
                    onClick={() => {
                        setTempValue(opt);
                        setValues(prev => ({ ...prev, [activeItem.name]: opt }));
                        setEditMode(false);
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {editMode && (activeItem?.type === 'slider' || activeItem?.type === 'number') && (
          <div className="editor-overlay">
            <div className="editor-box">
              <div className="editor-title">{activeItem.name}</div>
              <div className="editor-value">
                <span className="editor-arrows">◄ </span>
                {tempValue}
                <span className="editor-arrows"> ►</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
