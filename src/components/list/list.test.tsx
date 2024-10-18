import { render, screen } from '@testing-library/react'
import List from './list'
import { TaskProvider } from '../../contexts/taskContext'
import { ReactNode } from 'react'

test('renders loading state', () => {
  render(<TaskProvider><List /></TaskProvider>)
  expect(screen.getByText(/Carregando.../i)).toBeInTheDocument()
})

test('renders task list after loading', async () => {
  const mockTasks = [
    { id: 1, title: 'Task 1', body: 'Description for task 1', completed: false, userId: 1 },
    { id: 2, title: 'Task 2', body: 'Description for task 2', completed: true, userId: 1 },
  ]

  const MockTaskProvider = ({ children }: { children: ReactNode }) => {
    const mockValue = {
      tasks: mockTasks,
      loading: false,
      error: null,
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    }

    return (
      <TaskProvider value={mockValue}>
        {children}
      </TaskProvider>
    )
  }

  render(<MockTaskProvider><List /></MockTaskProvider>)
})
