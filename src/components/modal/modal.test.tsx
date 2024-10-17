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


  it('should call onClose when cancel button is clicked', () => {
    render(<Modal task={task} onUpdateTask={mockOnUpdateTask} onAddTask={mockOnAddTask} onClose={mockOnClose} />)

    fireEvent.click(screen.getByText('Cancelar'))

    expect(mockOnClose).toHaveBeenCalled()
  })
})
