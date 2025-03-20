interface Props {
  handlePageChange: (page: number) => void;
  currentPage: number;
  totalPages?: number;
  disabled?: boolean;
}

export default function PaginationButtons({
  handlePageChange,
  currentPage,
  totalPages = 1,
  disabled = false,
}: Props) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t py-4 w-full mt-auto">
      <div className="flex justify-center items-center gap-4">
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="text-sm font-medium">
          Página {currentPage} de {totalPages}
        </span>

        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || disabled} 
          className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
