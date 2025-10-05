import { useRoutes } from '@app/features/route-management/api/get-routes.api';
import RouteFormModal from '@app/features/route-management/components/route-form-modal';
import RouteList from '@app/features/route-management/components/route-list';
import RouteStopsModal from '@app/features/route-management/components/route-stops-modal';
import { useCreateRouteForm } from '@app/features/route-management/hooks/use-create-route-form';
import { Route } from '@app/features/route-management/types/route.type';
import { useTableState } from '@app/hooks';
import { PageTitle, SearchInput } from '@app/shared/components';
import BoxLayout from '@app/shared/layouts/box-layout';
import Container from '@app/shared/layouts/container';
import { Button } from 'antd';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const RouteManagementRoute = () => {
  const [open, setOpen] = useState(false);
  const [stopsModalOpen, setStopsModalOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<number>(0);
  const { handleSubmit, form } = useCreateRouteForm(setOpen);

  const { tableState, setSearch, setPage, setPageSize } = useTableState();

  const routesQuery = useRoutes({
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

  const handleManageStops = (route: Route) => {
    setSelectedRouteId(route.id);
    setStopsModalOpen(true);
  };

  return (
    <Container>
      <div className='flex items-center justify-between'>
        <PageTitle title='Route Management' subTitle='Manage bus routes and stops' />
        <Button type='primary' size='large' icon={<Plus size={18} />} onClick={() => setOpen(true)}>
          Add Route
        </Button>
      </div>

      <BoxLayout className='flex flex-col gap-6'>
        <SearchInput placeholder='Search routes...' handleSearch={(e) => handleSearch(e.target.value)} />
        <RouteList
          routesQuery={routesQuery}
          onPaginationChange={handlePaginationChange}
          onManageStops={handleManageStops}
        />
      </BoxLayout>

      {open && <RouteFormModal open={open} setOpen={setOpen} form={form} handleSubmit={handleSubmit} />}

      {stopsModalOpen && (
        <RouteStopsModal open={stopsModalOpen} setOpen={setStopsModalOpen} routeId={selectedRouteId} />
      )}
    </Container>
  );
};

export default RouteManagementRoute;
