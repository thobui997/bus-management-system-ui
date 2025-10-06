import { useCustomers } from '@app/features/customer-management/api/get-customers.api';
import CustomerFormModal from '@app/features/customer-management/components/customer-form-modal';
import CustomerList from '@app/features/customer-management/components/customer-list';
import { useCreateCustomerForm } from '@app/features/customer-management/hooks/use-create-customer-form';
import { useTableState } from '@app/hooks';
import { PageTitle, SearchInput } from '@app/shared/components';
import BoxLayout from '@app/shared/layouts/box-layout';
import Container from '@app/shared/layouts/container';
import { Button } from 'antd';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const CustomerRoute = () => {
  const [open, setOpen] = useState(false);
  const { handleSubmit, form } = useCreateCustomerForm(setOpen);

  const { tableState, setSearch, setPage, setPageSize } = useTableState();

  const customersQuery = useCustomers({
    params: {
      search: tableState.search,
      page: tableState.page,
      pageSize: tableState.pageSize
    }
  });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    if (pageSize !== tableState.pageSize) {
      setPageSize(pageSize);
    }
  };

  return (
    <Container>
      <div className='flex items-center justify-between'>
        <PageTitle title='Customer Management' subTitle='Manage customer information and loyalty points' />
        <Button type='primary' size='large' icon={<Plus size={18} />} onClick={() => setOpen(true)}>
          Add Customer
        </Button>
      </div>

      <BoxLayout className='flex flex-col gap-6'>
        <SearchInput placeholder='Search customers...' handleSearch={(e) => handleSearch(e.target.value)} />
        <CustomerList customersQuery={customersQuery} onPaginationChange={handlePaginationChange} />
      </BoxLayout>

      {open && <CustomerFormModal open={open} setOpen={setOpen} form={form} handleSubmit={handleSubmit} />}
    </Container>
  );
};

export default CustomerRoute;
