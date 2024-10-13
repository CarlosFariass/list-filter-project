import { useEffect, useState, useMemo } from "react"
import { Plus } from "lucide-react"
import Pagination from "../pagination"
import { ListType } from "../../types"
import Modal from "../modal"
import { addTask, updateTask, deleteTask } from "../../services/index"

const ITEMS_PER_PAGE = 10

const List = () => {
  const [tasks, setTasks] = useState<ListType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all")
  const [selectedTask, setSelectedTask] = useState<ListType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isAdding, setIsAdding] = useState<boolean>(false)

  const fetchTasks = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos")
      if (!response.ok) throw new Error("Deu erro ao buscar")
      const data: ListType[] = await response.json()
      setTasks(data)
      setLoading(false)
    } catch (error) {
      setError("Deu erro ao carregar")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "completed":
        return tasks.filter((task) => task.completed)
      case "pending":
        return tasks.filter((task) => !task.completed)
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

  const handleAddTask = async (task: { userId: number, title: string, body: string }) => {
    try {
      const newTask = await addTask(task)
      setTasks((prevTasks) => [newTask, ...prevTasks])
    } catch (error) {
      console.error(error)
    }
  }

  const handleEditTask = (task: ListType) => {
    setSelectedTask(task)
    setIsAdding(false)
    setIsModalOpen(true)
  }

  const handleUpdateTask = async (updatedTask: { title: string, body: string, userId: number }) => {
    if (selectedTask) {
      try {
        const updated = await updateTask(selectedTask.id, { ...updatedTask, userId: selectedTask.userId })
        setTasks((prevTasks) =>
          prevTasks.map(task => task.id === updated.id ? updated : task)
        )
        setIsModalOpen(false)
        setSelectedTask(null)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id)
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)) 
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error)
    }
  }

  return (
    <div className="mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#000]">Lista de Tarefas</h1>
        <button
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600"
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
      
      <div className="flex justify-center space-x-4 mb-4">
        <button className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-[#8474a1] text-white" : "bg-gray-200"}`} onClick={() => setFilter("all")}>
          Todas
        </button>
        <button className={`px-4 py-2 rounded-md ${filter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"}`} onClick={() => setFilter("pending")}>
          Pendentes
        </button>
        <button className={`px-4 py-2 rounded-md ${filter === "completed" ? "bg-green-500 text-white" : "bg-gray-200"}`} onClick={() => setFilter("completed")}>
          Concluídas
        </button>
      </div>

      <div className="flex justify-between items-center p-4 bg-gray-100 font-bold">
          <div className="flex-1 text-[#000]">Título / Descrição</div>
          <div className="w-32 text-center text-[#000]">Status</div>
          <div className="w-32 text-center text-[#000]">Ações</div>
        </div>
      <div className="h-72 overflow-y-auto border rounded-md shadow-sm p-2 bg-white scroll-smooth">
        <ul className="space-y-4">
          {paginatedTasks.map((task, index) => (
            <li
              key={task.id}
              className={`flex justify-between items-center p-4 rounded-md transition-opacity duration-300 shadow-sm ${
                task.completed ? "bg-white" : "bg-white"
              } ${index === paginatedTasks.length - 1 ? "opacity-50" : "opacity-100"}`}
            >
              {/* Título e Descrição */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[#000]">{task.title}</h2>
                <h4 className="text-md text-[#000]">{task.body}</h4>
              </div>

              {/* Status */}
              <div className="w-32 text-center">
                <p className="text-sm text-[#000]">
                  <span
                    className={task.completed ? "text-green-600 font-bold" : "text-yellow-600 font-bold"}
                  >
                    {task.completed ? "Concluída" : "Pendente"}
                  </span>
                </p>
              </div>

              {/* Ações */}
              <div className="w-32 flex justify-around">
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditTask(task)
                  }}
                >
                  Editar
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteTask(task.id)
                  }}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {isModalOpen && (
        <Modal
          task={selectedTask || { title: "", body: "", userId: 1, id: 0, completed: false }}
          onUpdateTask={handleUpdateTask}
          onAddTask={handleAddTask}
          onClose={() => setIsModalOpen(false)}
          isAdding={isAdding}
        />
      )}
    </div>
  )
}

export default List
