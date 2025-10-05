// src/app/pages/app/station-route.tsx
import { useStations } from '@app/features/station-management/api/get-stations.api';
import StationFormModal from '@app/features/station-management/components/station-form-modal';
import StationList from '@app/features/station-management/components/station-list';
import { useCreateStationForm } from '@app/features/station-management/hooks/use-create-station-form';
import { useTableState } from '@app/hooks';
import { PageTitle, SearchInput } from '@app/shared/components';
import BoxLayout from '@app/shared/layouts/box-layout';
import Container from '@app/shared/layouts/container';
import { Button } from 'antd';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const StationRoute = () => {
  const [open, setOpen] = useState(false);
  const { handleSubmit, form } = useCreateStationForm(setOpen);

  const { tableState, setSearch, setPage, setPageSize } = useTableState();

  const stationsQuery = useStations({
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
        <PageTitle title='Station Management' subTitle='Manage bus stations and terminals' />
        <Button type='primary' size='large' icon={<Plus size={18} />} onClick={() => setOpen(true)}>
          Add Station
        </Button>
        {open && <StationFormModal open={open} setOpen={setOpen} form={form} handleSubmit={handleSubmit} />}
      </div>

      <BoxLayout className='flex flex-col gap-6'>
        <SearchInput placeholder='Search stations...' handleSearch={(e) => handleSearch(e.target.value)} />
        <StationList stationsQuery={stationsQuery} onPaginationChange={handlePaginationChange} />
      </BoxLayout>
    </Container>
  );
};

export default StationRoute;
