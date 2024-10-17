import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './modal'

const mockOnUpdateTask = vi.fn()
const mockOnAddTask = vi.fn()
const mockOnClose = vi.fn()

const task = {
  id: 1,
  title: 'Tarefa de Teste',
  body: 'Descrição da tarefa de teste',
  completed: false,
  userId: 1,
}

describe('Modal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render modal with existing task data', () => {
    render(<Modal task={task} onUpdateTask={mockOnUpdateTask} onAddTask={mockOnAddTask} onClose={mockOnClose} />)

    expect(screen.getByText('Editar Tarefa')).toBeInTheDocument()
    expect(screen.getByLabelText('* Título:')).toHaveValue(task.title)
    expect(screen.getByLabelText('* Descrição:')).toHaveValue(task.body)
    expect(screen.getByLabelText('* Status:')).toHaveValue('pending')
  })

  it('should allow editing an existing task', () => {
    render(<Modal task={task} onUpdateTask={mockOnUpdateTask} onAddTask={mockOnAddTask} onClose={mockOnClose} />)

    fireEvent.change(screen.getByLabelText('* Título:'), { target: { value: 'Novo Título' } })
    fireEvent.change(screen.getByLabelText('* Descrição:'), { target: { value: 'Nova Descrição' } })
    fireEvent.change(screen.getByLabelText('* Status:'), { target: { value: 'completed' } })

    fireEvent.click(screen.getByText('Salvar'))

    expect(mockOnUpdateTask).toHaveBeenCalledWith({
      ...task,
      title: 'Novo Título',
      body: 'Nova Descrição',
      completed: true,
    })
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should add a new task', async () => {
    render(<Modal task={task} onUpdateTask={mockOnUpdateTask} onAddTask={mockOnAddTask} onClose={mockOnClose} isAdding />)

    fireEvent.change(screen.getByLabelText('* Título:'), { target: { value: 'Nova Tarefa' } })
    fireEvent.change(screen.getByLabelText('* Descrição:'), { target: { value: 'Descrição da nova tarefa' } })

    fireEvent.click(screen.getByText('Adicionar'))

    expect(mockOnAddTask).toHaveBeenCalledWith({
      title: 'Nova Tarefa',
      body: 'Descrição da nova tarefa',
      userId: task.userId,
    })
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should call onClose when cancel button is clicked', () => {
    render(<Modal task={task} onUpdateTask={mockOnUpdateTask} onAddTask={mockOnAddTask} onClose={mockOnClose} />)

    fireEvent.click(screen.getByText('Cancelar'))

    expect(mockOnClose).toHaveBeenCalled()
  })
})
