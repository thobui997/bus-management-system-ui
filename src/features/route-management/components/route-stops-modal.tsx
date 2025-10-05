import { useRouteDetail } from '@app/features/route-management/api/get-route-detail.api';
import { useUpdateRouteStops } from '@app/features/route-management/api/update-route-stops.api';
import RouteStopsTimeline from '@app/features/route-management/components/route-stops-timeline';
import { useNotification } from '@app/context/notification-context';
import { Modal, Spin } from 'antd';
import { useState, useEffect } from 'react';

interface RouteStopsModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  routeId: number;
}

const RouteStopsModal = ({ open, setOpen, routeId }: RouteStopsModalProps) => {
  const { showNotification } = useNotification();
  const [pendingStops, setPendingStops] = useState<Array<{ station_id: number; stop_order: number }>>([]);

  const routeDetailQuery = useRouteDetail({ id: routeId });
  const updateStopsMutation = useUpdateRouteStops({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Route stops updated successfully');
        setOpen(false);
      },
      onError: () => {
        showNotification('error', 'Failed to update route stops');
      }
    }
  });

  useEffect(() => {
    if (routeDetailQuery.data?.route_stops) {
      setPendingStops(
        routeDetailQuery.data.route_stops.map((stop) => ({
          station_id: stop.station_id,
          stop_order: stop.stop_order
        }))
      );
    }
  }, [routeDetailQuery.data]);

  const handleSave = () => {
    updateStopsMutation.mutate({
      routeId,
      stops: pendingStops
    });
  };

  return (
    <Modal
      open={open}
      title='Manage Route Stops'
      okText='Save'
      cancelText='Cancel'
      width={800}
      onOk={handleSave}
      onCancel={() => setOpen(false)}
      confirmLoading={updateStopsMutation.isPending}
    >
      {routeDetailQuery.isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      ) : (
        <RouteStopsTimeline
          routeStops={routeDetailQuery.data?.route_stops || []}
          startStation={routeDetailQuery.data?.start_station}
          endStation={routeDetailQuery.data?.end_station}
          onStopsChange={setPendingStops}
          isEditable
        />
      )}
    </Modal>
  );
};
export default RouteStopsModal;
