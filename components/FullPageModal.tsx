import React from 'react';

interface FullPageModalProps {
    isOpen: boolean;
    onClose: () => void;
    htmlContent: string;
}

const FullPageModal: React.FC<FullPageModalProps> = ({ isOpen, onClose, htmlContent }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-lg w-full max-w-3xl">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    Close
                </button>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        </div>
    );
};

export default FullPageModal;