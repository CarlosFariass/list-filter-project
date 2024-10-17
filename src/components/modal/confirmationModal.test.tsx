import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmationModal from './confirmation-modal'

describe('ConfirmationModal', () => {
  const title = 'Confirmação'
  const message = 'Tem certeza que deseja continuar?'
  const onConfirm = jest.fn()
  const onCancel = jest.fn()

  beforeEach(() => {
    render(
      <ConfirmationModal 
        title={title} 
        message={message} 
        onConfirm={onConfirm} 
        onCancel={onCancel} 
      />
    )
  })

  test('renders the modal with correct title and message', () => {
    expect(screen.getByText(title)).toBeInTheDocument()
    expect(screen.getByText(message)).toBeInTheDocument()
  })

  test('calls onCancel when the cancel button is clicked', () => {
    const cancelButton = screen.getByText(/Cancelar/i)
    fireEvent.click(cancelButton)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  test('calls onConfirm when the confirm button is clicked', () => {
    const confirmButton = screen.getByText(/Confirmar/i)
    fireEvent.click(confirmButton)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
