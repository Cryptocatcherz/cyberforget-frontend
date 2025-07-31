import React from 'react';
import './GalaxyButton.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const GalaxyButton = ({
    children,
    onClick,
    as: Component = 'button',
    to,
    href,
    className = '',
    variant = 'default', // 'default' or 'login'
    ...props
}) => {
    const componentProps = {};
    if (Component === Link && to) {
        componentProps.to = to;
    } else if (Component === 'a' && href) {
        componentProps.href = href;
        componentProps.target = '_blank';
        componentProps.rel = 'noopener noreferrer';
    }

    return (
        <div className={`galaxy-button ${variant} ${className}`}>
            <Component onClick={onClick} {...componentProps} {...props}>
                <span className="backdrop"></span>
                <span className="shine"></span>
                <span className="text">{children}</span>
            </Component>
        </div>
    );
};

GalaxyButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    as: PropTypes.elementType,
    to: PropTypes.string,
    href: PropTypes.string,
    className: PropTypes.string,
    variant: PropTypes.oneOf(['default', 'login']),
};

export default GalaxyButton;
