import { useState } from "react";

export function usePagination(totalItems: number, itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const goTo = (page: number) => {
    setCurrentPage(page);
  };

  const paginateFront = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const paginateBack = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return {
    goTo,
    currentPage,
    paginateFront,
    paginateBack,
    totalItems,
    itemsPerPage,
  };
}
