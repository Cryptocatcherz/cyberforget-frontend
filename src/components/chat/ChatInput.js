import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

const ChatInput = ({ value, onChange, onSend, disabled }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (!disabled && inputRef.current) {
            inputRef.current.focus();
        }
    }, [disabled]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value && value.trim() && !disabled) {
                onSend();
            }
        }
    };

    const handleSendClick = (e) => {
        e.preventDefault();
        if (value && value.trim() && !disabled) {
            onSend();
        }
    };

    return (
        <div className="input-area">
            <div className="input-area-content">
                <textarea
                    ref={inputRef}
                    className="input-focus"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about security..."
                    disabled={disabled}
                    rows={1}
                />
                <motion.button
                    className="send-button"
                    onClick={handleSendClick}
                    disabled={disabled || !value || !value.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <FiSend size={20} />
                </motion.button>
            </div>

            <style>{`
                .input-area {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(26, 26, 26, 0.95);
                    backdrop-filter: blur(10px);
                    border-top: 1px solid rgba(66, 255, 181, 0.2);
                    padding: 16px;
                    z-index: 100;
                }

                .input-area-content {
                    margin: 0 auto;
                    display: flex;
                    gap: 8px;
                    align-items: flex-end;
                }

                .input-focus {
                    flex-grow: 1;
                    flex-shrink: 1;
                    flex-basis: auto;
                    min-width: 0;
                    min-height: 45px;
                    padding: 10px 12px;
                    background: rgba(28, 28, 28, 0.95);
                    border: 1px solid rgba(66, 255, 181, 0.2);
                    border-radius: 8px;
                    color: #ffffff;
                    font-size: 0.85rem;
                    line-height: 1.4;
                    resize: none;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                }

                .input-focus:focus {
                    outline: none;
                    border-color: #42ffb5;
                    background: rgba(28, 28, 28, 0.98);
                }

                .input-focus::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.85rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .input-focus:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .send-button {
                    background: #42ffb5;
                    color: #000000;
                    border: none;
                    border-radius: 8px;
                    width: 45px;
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }

                .send-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .input-area {
                        padding: 10px 10px;
                    }

                    .input-area-content {
                        gap: 4px;
                    }

                    .input-focus {
                        font-size: 0.8rem;
                        padding: 10px 8px;
                    }

                    .input-focus::placeholder {
                        font-size: 0.75rem;
                    }

                    @supports (padding: max(0px)) {
                        .input-area {
                            padding-bottom: max(16px, env(safe-area-inset-bottom));
                        }
                    }
                }
            `}</style>
        </div>
    );
};

export default ChatInput; 