import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './ModelSelector.css';

const MODELS = [
  { label: 'Vault Flash V1.5', value: 'flash' },
  { label: 'Vault Pro 1.5', value: 'pro' },
  { label: 'Vault V2 (Beta)', value: 'v2' },
];

const LOCAL_KEY = 'cyberforget_selected_model';

const ModelSelector = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(MODELS[0]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      const found = MODELS.find(m => m.value === saved);
      if (found) setSelected(found);
    }
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleSelect = (model) => {
    setSelected(model);
    localStorage.setItem(LOCAL_KEY, model.value);
    setOpen(false);
  };

  return (
    <div className="model-selector" ref={dropdownRef}>
      <button className="model-selector-btn" onClick={() => setOpen(o => !o)}>
        <span className="model-selector-label">{selected.label}</span>
        <FaChevronDown className={`chevron ${open ? 'open' : ''}`} />
      </button>
      {open && (
        <div className="model-selector-dropdown">
          {MODELS.map(model => (
            <button
              key={model.value}
              className={`model-selector-option${model.value === selected.value ? ' selected' : ''}`}
              onClick={() => handleSelect(model)}
            >
              {model.label}
              {model.value === selected.value && <span className="model-selector-new">Selected</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector; 