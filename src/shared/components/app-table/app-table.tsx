import Table, { TablePaginationConfig, TableProps } from 'antd/es/table';
import './app-table.scss';

interface AppTableProps<T extends object> extends TableProps<T> {
  height?: string;
}

const AppTable = <T extends object = object>({ height = '100%', pagination, ...rest }: AppTableProps<T>) => {
  const defaultPagination = {
    size: 'default',
    showQuickJumper: false,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    defaultPageSize: 10
  };

  const combinedPagination = { ...defaultPagination, ...pagination } as false | TablePaginationConfig | undefined;

  return (
    <div className='table'>
      <Table<T> {...rest} scroll={{ x: 'max-content', y: '100%' }} pagination={combinedPagination} size='large' />
    </div>
  );
};

export default AppTable;
