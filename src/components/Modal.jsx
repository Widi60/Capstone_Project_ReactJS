import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ message, color, onClose }) => (
    <div 
        className="modal-overlay" 
        style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 1000,
        }}
    >
        <div 
            className="modal-content" 
            style={{
                backgroundColor: color === 'red' ? '#f8d7da' : '#d4edda', 
                padding: '20px', 
                borderRadius: '8px', 
                textAlign: 'center',
                width: '300px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                border: color === 'red' ? '1px solid #f5c6cb' : '1px solid #c3e6cb',
            }}
        >
            <p style={{ color: color === 'red' ? '#721c24' : '#155724', fontWeight: 'bold' }}>{message}</p>
            <button 
                onClick={onClose} 
                style={{ 
                    marginTop: '10px', 
                    backgroundColor: color === 'red' ? '#e63946' : '#2a9d8f', 
                    color: 'white', 
                    padding: '10px 20px', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer' 
                }}
            >
                OK
            </button>
        </div>
    </div>
);

Modal.propTypes = {
    message: PropTypes.string.isRequired,
    color: PropTypes.oneOf(['red', 'green']).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Modal;
