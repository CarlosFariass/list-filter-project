import React, { createContext, useContext, useState, useEffect } from "react"
import { ListType } from "../types/index"
import { addTask, updateTask, deleteTask } from "../services/index"

interface TaskContextType {
  tasks: ListType[]
  loading: boolean
  error: string | null
  addTask: (task: ListType) => Promise<void>
  updateTask: (task: ListType) => Promise<void>
  deleteTask: (id: number) => Promise<void>
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<ListType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos")
        if (!response.ok) throw new Error("Deu erro ao buscar")
        const data: ListType[] = await response.json()
        setTasks(data)
      } catch (error) {
        setError("Deu erro ao carregar")
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleAddTask = async (task: ListType) => {
    try {
      const newTask = await addTask(task)
      setTasks((prevTasks) => [newTask, ...prevTasks])
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateTask = async (updatedTask: ListType) => {
    try {
      const updated = await updateTask(updatedTask.id, updatedTask)
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updated.id ? updated : task))
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id)
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <TaskContext.Provider value={{ tasks, loading, error, addTask: handleAddTask, updateTask: handleUpdateTask, deleteTask: handleDeleteTask }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTaskContext = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}
