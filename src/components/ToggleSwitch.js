// ToggleSwitch.js

import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ id, isOn, handleToggle }) => {
    return (
        <div className="toggle-switch">
            <input
                checked={isOn}
                onChange={handleToggle}
                className="toggle-switch-checkbox"
                id={id}
                type="checkbox"
            />
            <label className="toggle-switch-label" htmlFor={id}>
                <span className="toggle-switch-inner" />
                <span className="toggle-switch-switch" />
            </label>
        </div>
    );
};

export default ToggleSwitch;
