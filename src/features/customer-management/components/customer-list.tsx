import { useNotification } from '@app/context/notification-context';
import { useDeleteCustomer } from '@app/features/customer-management/api/delete-customer.api';
import CustomerFormModal from '@app/features/customer-management/components/customer-form-modal';
import useColumn from '@app/features/customer-management/hooks/use-column';
import { useUpdateCustomerForm } from '@app/features/customer-management/hooks/use-update-customer-form';
import { Customer, CustomerResponse } from '@app/features/customer-management/types/customer.type';
import { AppTable } from '@app/shared/components';
import { UseQueryResult } from '@tanstack/react-query';
import { TablePaginationConfig } from 'antd';
import { useState } from 'react';

type CustomerListProps = {
  customersQuery: UseQueryResult<CustomerResponse, Error>;
  onPaginationChange: (page: number, pageSize: number) => void;
};

const CustomerList = ({ customersQuery, onPaginationChange }: CustomerListProps) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);

  const { showNotification } = useNotification();
  const { handleSubmit, form, handleSetFormValues } = useUpdateCustomerForm(setOpen);
  const deleteMutation = useDeleteCustomer({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Customer deleted successfully');
      },
      onError: () => {
        showNotification('error', 'Failed to delete customer');
      }
    }
  });

  const onEdit = (record: Customer) => {
    setOpen(true);
    handleSetFormValues(record);
    setId(record.id);
  };

  const onDelete = (record: Customer) => {
    deleteMutation.mutate(record.id);
  };

  const { columns } = useColumn({ onEdit, onDelete });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    onPaginationChange(pagination.current ?? 1, pagination.pageSize ?? 10);
  };

  const paginationConfig: TablePaginationConfig = {
    current: customersQuery.data?.page ?? 1,
    pageSize: customersQuery.data?.pageSize ?? 10,
    total: customersQuery.data?.total ?? 0,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    pageSizeOptions: ['10', '20', '50', '100']
  };

  return (
    <>
      <AppTable<Customer>
        loading={customersQuery.isLoading}
        columns={columns}
        dataSource={customersQuery.data?.data ?? []}
        rowKey={(record) => record.id}
        pagination={paginationConfig}
        onChange={handleTableChange}
      />

      {open && (
        <CustomerFormModal
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

export default CustomerList;
