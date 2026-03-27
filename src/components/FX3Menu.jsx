import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fx3Menu } from '../data/fx3Menu';

export default function FX3Menu({ onClose, values, setValues }) {
  const [activeCol, setActiveCol] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSub, setSelectedSub] = useState(0);
  
  const [path, setPath] = useState([]);
  const [cursorIndex, setCursorIndex] = useState(0);
  
  const [editMode, setEditMode] = useState(false);
  const [tempValue, setTempValue] = useState(null);

  const dropdownListRef = useRef(null);

  const getCurrentContext = useCallback(() => {
    let current = fx3Menu[selectedTab].subCategories[selectedSub]?.items || [];
    let breadcrumb = [];
    for (const index of path) {
      if (current[index] && current[index].children) {
        breadcrumb.push(current[index].name);
        current = current[index].children;
      }
    }
    return { items: current, breadcrumb };
  }, [selectedTab, selectedSub, path]);

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
      onClose(); // Exit back to selector
      return;
    }

    // --- EDIT MODE ---
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
            const selectedElement = document.getElementById(`dropdown-option-${currentIndexInOptions - 1}`);
            if(selectedElement) selectedElement.scrollIntoView({ block: 'nearest' });
          }
        } else if (e.key === 'ArrowDown') {
          if (currentIndexInOptions < item.options.length - 1) {
            setTempValue(item.options[currentIndexInOptions + 1]);
            const selectedElement = document.getElementById(`dropdown-option-${currentIndexInOptions + 1}`);
            if(selectedElement) selectedElement.scrollIntoView({ block: 'nearest' });
          }
        }
      } else if (item.type === 'slider' || item.type === 'number') {
        if (e.key === 'Escape' || e.key === 'Backspace') {
          setEditMode(false);
        } else if (e.key === 'Enter') {
          setValues(prev => ({ ...prev, [item.name]: tempValue }));
          setEditMode(false);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
          const step = item.type === 'number' ? 10 : 1;
          const max = item.max !== undefined ? item.max : 1000;
          if (tempValue + step <= max) setTempValue(tempValue + step);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
          const step = item.type === 'number' ? 10 : 1;
          const min = item.min !== undefined ? item.min : 0;
          if (tempValue - step >= min) setTempValue(tempValue - step);
        }
      }
      return;
    }

    // --- NAVIGATION MODE ---
    if (activeCol === 1) {
      if (e.key === 'ArrowUp') {
        setSelectedTab(prev => Math.max(0, prev - 1));
        setSelectedSub(0); 
      } else if (e.key === 'ArrowDown') {
        setSelectedTab(prev => Math.min(fx3Menu.length - 1, prev + 1));
        setSelectedSub(0);
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        setActiveCol(2);
      }
    } 
    else if (activeCol === 2) {
      const subcats = fx3Menu[selectedTab].subCategories;
      if (e.key === 'ArrowLeft' || e.key === 'Escape') {
        setActiveCol(1);
      } else if (e.key === 'ArrowUp') {
        setSelectedSub(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        setSelectedSub(prev => Math.min(subcats.length - 1, prev + 1));
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        setActiveCol(3);
        setPath([]);
        setCursorIndex(0);
      }
    } 
    else if (activeCol === 3) {
      if (e.key === 'ArrowUp') {
        setCursorIndex(prev => Math.max(0, prev - 1));
        const el = document.getElementById(`item-${Math.max(0, cursorIndex - 1)}`);
        if (el) el.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowDown') {
        setCursorIndex(prev => Math.min(currentItems.length - 1, prev + 1));
        const el = document.getElementById(`item-${Math.min(currentItems.length - 1, cursorIndex + 1)}`);
        if (el) el.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowLeft' || e.key === 'Escape' || e.key === 'Backspace') {
        if (path.length > 0) {
          const newPath = [...path];
          const lastIdx = newPath.pop();
          setPath(newPath);
          setCursorIndex(lastIdx);
        } else {
          setActiveCol(2);
          setCursorIndex(-1);
        }
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        const item = currentItems[cursorIndex];
        if (item?.type === 'submenu') {
          if (item.children && item.children.length > 0) {
            setPath(prev => [...prev, cursorIndex]);
            setCursorIndex(0);
          }
        } else if (item?.type === 'select' || item?.type === 'slider' || item?.type === 'number') {
          setTempValue(getValue(item));
          setEditMode(true);
        } else if (item?.type === 'action') {
          const el = document.getElementById(`item-${cursorIndex}`);
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

  }, [editMode, currentItems, cursorIndex, getValue, tempValue, activeCol, selectedTab, selectedSub, path, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const activeTabColor = fx3Menu[selectedTab].color;
  const activeItem = currentItems[cursorIndex];

  return (
    <div className="menu-container">
      <div className="menu-header">
        <span>MENU</span> FX3
      </div>
      <div className="menu-body">
        
        {/* Column 1: Tabs */}
        <div className="menu-col-1">
          {fx3Menu.map((tab, idx) => (
            <div 
              key={idx}
              className={`tab-item ${selectedTab === idx ? 'active' : ''} ${activeCol === 1 && selectedTab === idx ? 'col1-active-indicator' : ''}`}
              style={{ color: selectedTab === idx ? tab.color : 'var(--text-muted)' }}
              onClick={() => {
                setSelectedTab(idx);
                setSelectedSub(0);
                setActiveCol(2);
                setPath([]);
                setCursorIndex(-1);
                setEditMode(false);
              }}
            >
              {tab.icon}
            </div>
          ))}
        </div>

        {/* Column 2: Sub-categories */}
        <div className={`menu-col-2 ${activeCol === 2 ? 'col2-active' : ''}`}>
          {fx3Menu[selectedTab].subCategories.map((sub, idx) => (
            <div
              key={idx}
              className={`subcat-item ${selectedSub === idx ? 'active' : ''} ${activeCol === 2 && selectedSub === idx ? 'col2-active-indicator' : ''}`}
              style={{ color: selectedSub === idx ? activeTabColor : 'inherit' }}
              onClick={() => {
                setSelectedSub(idx);
                setActiveCol(3);
                setPath([]);
                setCursorIndex(0);
                setEditMode(false);
              }}
            >
              <div>{sub.title}</div>
              <div style={{opacity: 0.5}}>▶</div>
            </div>
          ))}
        </div>

        {/* Column 3: Items */}
        <div className="menu-col-3">
            {/* Deep Submenu Breadcrumbs */}
            {path.length > 0 && (
            <div className="submenu-path">
              {fx3Menu[selectedTab].subCategories[selectedSub].title.split('.')[1]?.trim() || fx3Menu[selectedTab].subCategories[selectedSub].title}  
              {' > '} 
              {breadcrumb.join(' > ')}
            </div>
          )}

          {/* Items List */}
          {currentItems.map((item, idx) => (
            <div 
              id={`item-${idx}`}
              key={idx} 
              className={`setting-item ${activeCol === 3 && cursorIndex === idx ? 'selected' : ''}`}
              onClick={() => {
                setActiveCol(3);
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

          {currentItems.length === 0 && (
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
                    id={`dropdown-option-${idx}`}
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
