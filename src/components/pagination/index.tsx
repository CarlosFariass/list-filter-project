import React from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        disabled={currentPage === 1}
        className="px-3 py-1 bg-[#a49393] rounded-md disabled:opacity-50 text-[#44464a]"
        onClick={() => onPageChange(currentPage - 1)}
      >
        {'<'}
      </button>
      <span className="px-3 py-1 text-[#44464a]">
        {currentPage} - {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-[#a49393] rounded-md disabled:opacity-50 text-[#44464a]"
        onClick={() => onPageChange(currentPage + 1)}
      >
        {'>'}
      </button>
    </div>
  )
}

export default Pagination
