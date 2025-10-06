import { useEmployees } from '@app/features/employee-management/api/get-employees.api';
import EmployeeFormModal from '@app/features/employee-management/components/employee-form-modal';
import EmployeeList from '@app/features/employee-management/components/employee-list';
import { useCreateEmployeeForm } from '@app/features/employee-management/hooks/use-create-employee-form';
import { useTableState } from '@app/hooks';
import { PageTitle, SearchInput } from '@app/shared/components';
import BoxLayout from '@app/shared/layouts/box-layout';
import Container from '@app/shared/layouts/container';
import { Button } from 'antd';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const EmployeeRoute = () => {
  const [open, setOpen] = useState(false);
  const { handleSubmit, form } = useCreateEmployeeForm(setOpen);

  const { tableState, setSearch, setPage, setPageSize } = useTableState();

  const employeesQuery = useEmployees({
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
        <PageTitle title='Employee Management' subTitle='Manage employee information and licenses' />
        <Button type='primary' size='large' icon={<Plus size={18} />} onClick={() => setOpen(true)}>
          Add Employee
        </Button>
      </div>

      <BoxLayout className='flex flex-col gap-6 overflow-hidden'>
        <SearchInput placeholder='Search employees...' handleSearch={(e) => handleSearch(e.target.value)} />
        <EmployeeList employeesQuery={employeesQuery} onPaginationChange={handlePaginationChange} />
      </BoxLayout>

      {open && <EmployeeFormModal open={open} setOpen={setOpen} form={form} handleSubmit={handleSubmit} />}
    </Container>
  );
};

export default EmployeeRoute;
