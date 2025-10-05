import { useNotification } from '@app/context/notification-context';
import { useUpdateRoute } from '@app/features/route-management/api/update-route.api';
import { Route } from '@app/features/route-management/types/route.type';
import { Form } from 'antd';

export const useUpdateRouteForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const updateRouteMutation = useUpdateRoute({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Route updated successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to update route');
      }
    }
  });

  const handleSubmit = async (id: number) => {
    try {
      const formValues = await form.validateFields();
      updateRouteMutation.mutate({ id, ...formValues });
    } catch (error) {
      console.error('Error updating route:', error);
    }
  };

  const handleSetFormValues = (values: Route) => {
    setTimeout(() => {
      form.setFieldsValue({
        route_name: values.route_name,
        start_station_id: values.start_station_id,
        end_station_id: values.end_station_id,
        distance: values.distance,
        standard_duration: values.standard_duration
      });
    }, 0);
  };

  return {
    form,
    handleSubmit,
    isLoading: updateRouteMutation.isPending,
    handleSetFormValues
  };
};
