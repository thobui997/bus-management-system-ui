import { useDebounce } from '@app/hooks';
import { useState } from 'react';

export type TableState = {
  search: string;
  page: number;
  pageSize: number;
};

export type UseTableStateOptions = {
  initialPageSize?: number;
  debounceTime?: number;
};

export const useTableState = (options: UseTableStateOptions = {}) => {
  const { initialPageSize = 10, debounceTime = 300 } = options;
  const [tableState, setTableState] = useState<TableState>({
    search: '',
    page: 1,
    pageSize: initialPageSize
  });

  const debouncedSearch = useDebounce(tableState.search, debounceTime);

  const setSearch = (search: string) => {
    setTableState((prev) => ({ ...prev, search, page: 1 }));
  };

  const setPage = (page: number) => {
    setTableState((prev) => ({ ...prev, page }));
  };

  const setPageSize = (pageSize: number) => {
    setTableState((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  return {
    tableState: {
      ...tableState,
      search: debouncedSearch
    },
    rawTableState: tableState,
    setSearch,
    setPage,
    setPageSize,
    setTableState
  };
};
