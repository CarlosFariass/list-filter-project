import React, { useState, useEffect } from "react"
import { NewTask } from "../../types"

interface Task {
  id: number
  title: string
  body: string
  completed: boolean
  userId: number
}

interface ModalProps {
  task: Task
  onUpdateTask: (updatedTask: Task) => Promise<void>
  onAddTask: (newTask: NewTask) => Promise<void>;
  onClose: () => void
  isAdding?: boolean
}

const Modal: React.FC<ModalProps> = ({ task, onUpdateTask, onAddTask, onClose, isAdding }) => {
  const [title, setTitle] = useState(task.title)
  const [body, setBody] = useState(task.body)
  const [status, setStatus] = useState(task.completed)

  useEffect(() => {
    if (!isAdding) {
      setTitle(task.title)
      setBody(task.body)
      setStatus(task.completed)
    } else {
      setTitle('')
      setBody('')
      setStatus(false)
    }
  }, [task, isAdding])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isAdding) {
      await onAddTask({ title, body, userId: task.userId })
    } else {
      await onUpdateTask({ ...task, title, body, completed: status })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-[#44464a]">
          {isAdding ? 'Adicionar Tarefa' : 'Editar Tarefa'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-[#44464a] text-left">* Título:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border rounded-md p-2 w-full bg-[#fff] text-[#44464a]"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-[#44464a] text-left">* Descrição:</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              className="border rounded-md p-2 w-full bg-[#fff] text-[#44464a]"
            />
          </div>

          {!isAdding && (
            <div className="mb-4">
              <label className="block mb-2 text-[#44464a] text-left">* Status:</label>
              <select
                value={status ? "completed" : "pending"}
                onChange={(e) => setStatus(e.target.value === "completed")}
                className="border rounded-md p-2 w-full bg-[#fff] text-[#44464a]"
              >
                <option value="pending">Pendente</option>
                <option value="completed">Concluída</option>
              </select>
            </div>
          )}

          <div className="flex justify-between">
            <button type="submit" className="bg-[#18a558] text-white rounded-md px-4 py-2 mr-2">
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
