import { useNotification } from '@app/context/notification-context';
import { useCreateVehicle } from '@app/features/vehicle-management/vehicle-fleet/api/create-vehicle.api';
import { Form } from 'antd';

export const useCreateVehicleForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const createVehicleMutation = useCreateVehicle({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Vehicle created successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to create vehicle');
      }
    }
  });

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      createVehicleMutation.mutate(formValues);
    } catch (error) {
      console.error('Error creating vehicle:', error);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading: createVehicleMutation.isPending
  };
};
