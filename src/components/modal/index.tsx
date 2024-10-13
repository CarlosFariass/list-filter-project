import React, { useState, useEffect } from "react"

interface ModalProps {
  task: {
    title: string
    body: string
    id: number
  }
  onUpdateTask: (updatedTask: { title: string, body: string }) => void
  onAddTask: (newTask: { title: string, body: string }) => void
  onDeleteTask: (deleteTask: { title: string, body: string }) => void
  onClose: () => void
  isAdding?: boolean
}

const Modal: React.FC<ModalProps> = ({ task, onUpdateTask, onAddTask, onDeleteTask, onClose, isAdding }) => {
  const [title, setTitle] = useState(task.title)
  const [body, setBody] = useState(task.body)

  useEffect(() => {
    if (!isAdding) {
      setTitle(task.title)
      setBody(task.body)
    } else {
      setTitle('')
      setBody('')
    }
  }, [task, isAdding])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAdding) {
      onAddTask({ title, body })
    } else {
      onUpdateTask({ title, body }) 
      onDeleteTask ({ title, body }) 
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-[#000]">{isAdding ? 'Adicionar Tarefa' : 'Editar Tarefa'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-[#000]">Título:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border rounded-md p-2 w-full bg-[#fff] text-[#000]"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-[#000]">Descrição:</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              className="border rounded-md p-2 w-full bg-[#fff] text-[#000]"
            />
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 mr-2">
              {isAdding ? 'Adicionar' : 'Salvar'}
            </button>
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-700 rounded-md px-4 py-2">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Modal
