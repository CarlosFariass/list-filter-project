import React from 'react'

interface ConfirmationModalProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-gray-600 font-bold">{message}</p>
        <div className="modal-actions flex justify-center mt-4">
          <button 
            onClick={onCancel} 
            className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-[#0076EC]"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
