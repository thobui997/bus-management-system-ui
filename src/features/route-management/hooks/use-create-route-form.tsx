import { useNotification } from '@app/context/notification-context';
import { useCreateRoute } from '@app/features/route-management/api/create-route.api';
import { Form } from 'antd';

export const useCreateRouteForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const createRouteMutation = useCreateRoute({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Route created successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to create route');
      }
    }
  });

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      createRouteMutation.mutate(formValues);
    } catch (error) {
      console.error('Error creating route:', error);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading: createRouteMutation.isPending
  };
};
