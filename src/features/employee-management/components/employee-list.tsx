import { useNotification } from '@app/context/notification-context';
import { useDeleteEmployee } from '@app/features/employee-management/api/delete-employee.api';
import EmployeeFormModal from '@app/features/employee-management/components/employee-form-modal';
import useColumn from '@app/features/employee-management/hooks/use-column';
import { useUpdateEmployeeForm } from '@app/features/employee-management/hooks/use-update-employee-form';
import { Employee, EmployeeResponse } from '@app/features/employee-management/types/employee.type';
import { AppTable } from '@app/shared/components';
import { UseQueryResult } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd';
import { useState } from 'react';

type EmployeeListProps = {
  employeesQuery: UseQueryResult<EmployeeResponse, Error>;
  onPaginationChange: (page: number, pageSize: number) => void;
};

const EmployeeList = ({ employeesQuery, onPaginationChange }: EmployeeListProps) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);

  const { showNotification } = useNotification();
  const { handleSubmit, form, handleSetFormValues } = useUpdateEmployeeForm(setOpen);
  const deleteMutation = useDeleteEmployee({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Employee deleted successfully');
      },
      onError: () => {
        showNotification('error', 'Failed to delete employee');
      }
    }
  });

  const onEdit = (record: Employee) => {
    setOpen(true);
    handleSetFormValues(record);
    setId(record.id);
  };

  const onDelete = (record: Employee) => {
    deleteMutation.mutate(record.id);
  };

  const { columns } = useColumn({ onEdit, onDelete });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    onPaginationChange(pagination.current ?? 1, pagination.pageSize ?? 10);
  };

  const paginationConfig: TablePaginationConfig = {
    current: employeesQuery.data?.page ?? 1,
    pageSize: employeesQuery.data?.pageSize ?? 10,
    total: employeesQuery.data?.total ?? 0,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    pageSizeOptions: ['10', '20', '50', '100']
  };

  return (
    <>
      <AppTable<Employee>
        loading={employeesQuery.isLoading}
        columns={columns}
        dataSource={employeesQuery.data?.data ?? []}
        rowKey={(record) => record.id}
        pagination={paginationConfig}
        onChange={handleTableChange}
      />

      {open && (
        <EmployeeFormModal
          open={open}
          setOpen={setOpen}
          form={form}
          handleSubmit={async () => {
            await handleSubmit(id);
          }}
          mode='edit'
        />
      )}
    </>
  );
};

export default EmployeeList;
