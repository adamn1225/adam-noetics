import React from 'react';
import Modal from 'react-modal';

interface FullPageModalProps {
    isOpen: boolean;
    onClose: () => void;
    htmlContent: string;
}

const FullPageModal: React.FC<FullPageModalProps> = ({ isOpen, onClose, htmlContent }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            overlayClassName="fixed inset-0"
            ariaHideApp={false}
        >
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
                    &times;
                </button>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        </Modal>
    );
};

export default FullPageModal;