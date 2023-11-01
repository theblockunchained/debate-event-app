import React from 'react';

function Toast({ message, type, onClose }) {
    const bgColor = type === 'success' ? 'green' : 'red';
    const icon = type === 'success' 
        ? <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
        : <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5"><path d="M18 8A10 10 0 118 18a10 10 0 0110-10zm0 2a8 8 0 10-8 8 8 8 0 008-8zm-9 3a1 1 0 012 0v3a1 1 0 01-2 0v-3zm0 5a1 1 0 012 0v1a1 1 0 01-2 0v-1z"/></svg>;

    return (
        <div className={`flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800`} role="alert">
            <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-${bgColor}-500 bg-${bgColor}-100 rounded-lg dark:text-${bgColor}-100 dark:bg-${bgColor}-500`}>
                {icon}
            </div>
            <div className="ml-3 text-sm font-normal">{message}</div>
            <button onClick={onClose} className="ml-auto">X</button>
        </div>
    );
} 

export default Toast;
