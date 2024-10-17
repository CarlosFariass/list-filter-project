import { useState, useMemo } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import Pagination from "../pagination/pagination"
import { ListType } from "../../types"
import Modal from "../modal/modal"
import ConfirmationModal from "../modal/confirmation-modal"
import { useTaskContext } from '../../contexts/taskContext'

const ITEMS_PER_PAGE = 10

const List = () => {
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTaskContext()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all")
  const [selectedTask, setSelectedTask] = useState<ListType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false)
  const [taskToDelete, setTaskToDelete] = useState<ListType | null>(null)
  const [isConfirmingToggle, setIsConfirmingToggle] = useState<boolean>(false)
  const [taskToToggle, setTaskToToggle] = useState<ListType | null>(null)

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "completed":
        return tasks.filter(task => task.completed)
      case "pending":
        return tasks.filter(task => !task.completed)
      default:
        return tasks
    }
  }, [tasks, filter])

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredTasks.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredTasks, currentPage])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  if (loading) return <p className="text-center">Carregando...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  const handleAddTask = async (task: Omit<ListType, "id" | "completed">) => {
    await addTask({ ...task, id: 0, completed: false })
    setIsModalOpen(false)
  }

  const handleEditTask = (task: ListType) => {
    setSelectedTask(task)
    setIsAdding(false)
    setIsModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id)
      setIsConfirmingDelete(false)
      setTaskToDelete(null)
    }
  }

  const handleConfirmToggle = async () => {
    if (taskToToggle) {
      await updateTask({ ...taskToToggle, completed: !taskToToggle.completed })
      setIsConfirmingToggle(false)
      setTaskToToggle(null)
    }
  }

  return (
    <div className="mx-auto p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl text-[#44464a]">Tarefas</h1>
        <button
          className="flex items-center px-4 py-3 bg-[#675a99] text-white rounded-md text-base md:text-lg"
          onClick={() => {
            setSelectedTask({ title: "", body: "", userId: 1, id: 0, completed: false })
            setIsAdding(true)
            setIsModalOpen(true)
          }}
        >
          <Plus className="mr-2" size={20} />
          Adicionar
        </button>
      </div>

      <div className="flex justify-center space-x-4 mb-4 border border-gray-300 rounded-[10px] p-4">
        <button className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-[#a49393] text-white" : "bg-gray-200"}`} onClick={() => setFilter("all")}>
          Todas
        </button>
        <button className={`px-4 py-2 rounded-md ${filter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"}`} onClick={() => setFilter("pending")}>
          Pendentes
        </button>
        <button className={`px-4 py-2 rounded-md ${filter === "completed" ? "bg-green-500 text-white" : "bg-gray-200"}`} onClick={() => setFilter("completed")}>
          Concluídas
        </button>
      </div>

      <div className="block justify-between items-center p-4 font-bold border border-gray-300 rounded-[10px]">
        <div className="overflow-y-auto h-screen md:h-[300px]">
         <table className="w-full">
            <thead className="border-b border-gray-300">
              <tr>
                <th className="text-left w-82 text-[#44464a]">Título / Descrição</th>
                <th className="text-left w-32 text-[#44464a]">Status</th>
                <th className="text-left w-41 text-[#44464a]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.map((task) => (
                <tr key={task.id} className="border-b border-gray-300 hover:bg-gray-100">
                  <td className="pt-4 pb-4 pr-4 pl-0 text-left">
                    <h2 className="text-lg font-semibold text-[#44464a] max-w-[400px] truncate">{task.title}</h2>
                    <h4 className="font-light text-[#44464a]">{task.body}</h4>
                  </td>
                  <td className="pt-4 pb-4 pr-4 pl-0 text-left">
                    <p className="text-sm text-[#44464a]">
                      <span className={task.completed ? "text-[#116530] font-bold" : "text-yellow-600 font-bold"}>
                        {task.completed ? "Concluída" : "Pendente"}
                      </span>
                    </p>
                  </td>
                  <td className="p-4 pl-0 flex justify-around">
                    <button
                      className={`px-2 py-1 ${task.completed ? "bg-gray-400" : "bg-[#116530]"} text-white rounded-md hover:bg-green-600 mr-2`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsConfirmingToggle(true)
                        setTaskToToggle(task)
                      }}
                    >
                      {task.completed ? "Pendente" : "Concluir"}
                    </button>
                    <button
                      className="px-2 py-1 bg-transparent text-[#675a99] mr-2 flex items-center hover:border-[#675a99]"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditTask(task)
                      }}
                      title="Editar tarefa"
                    >
                      <Edit className="mr-1" size={16} /> 
                    </button>
                    <button
                      className="px-2 py-1 bg-transparent text-[#675a99] flex items-center hover:border-[#675a99]"
                      onClick={(e) => {
                        e.stopPropagation()
                        setTaskToDelete(task)
                        setIsConfirmingDelete(true) 
                      }}
                      title="Excluir tarefa"
                    >
                      <Trash2 className="mr-1" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isConfirmingDelete && (
        <ConfirmationModal
          title="Confirmação"
          message="Tem certeza que deseja excluir esta tarefa?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}

      {isConfirmingToggle && (
        <ConfirmationModal
          title="Confirmação"
          message={`Tem certeza que deseja ${taskToToggle?.completed ? "marcar como pendente" : "concluir"} esta tarefa?`}
          onConfirm={handleConfirmToggle}
          onCancel={() => setIsConfirmingToggle(false)}
        />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {isModalOpen && (
        <Modal
          task={selectedTask || { title: "", body: "", userId: 1, id: 0, completed: false }}
          onUpdateTask={updateTask}
          onAddTask={handleAddTask}
          onClose={() => setIsModalOpen(false)}
          isAdding={isAdding}
        />
      )}
    </div>
  )
}


export default List
