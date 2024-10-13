const headers = { 'Content-Type': 'application/json' }

type Task = {
  userId?: number
  title: string
  body: string
}

export const addTask = async (task: Task) => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: 'POST',
    headers,
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erro ao adicionar tarefa: ${errorText}`)
  }

  return response.json()
}

export const updateTask = async (id: number, updatedTask: Task) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ ...updatedTask, id }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erro ao atualizar tarefa: ${errorText}`)
  }

  return response.json()
}

export const deleteTask = async (id: number) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erro ao deletar tarefa: ${errorText}`)
  }

  return response.json()
}
