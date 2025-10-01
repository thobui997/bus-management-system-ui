import { useNotification } from '@app/context/notification-context';
import { useCreateVehicleType } from '@app/features/vehicle-management/api/create-vehicle-type.api';
import { Form } from 'antd';

export const useCreateVehicleTypeForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const createVehicleTypeMutation = useCreateVehicleType({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Vehicle type created successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to create blog');
      }
    }
  });

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();

      createVehicleTypeMutation.mutate(formValues);
    } catch (error) {
      console.error('Error adding destination:', error);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading: createVehicleTypeMutation.isPending
  };
};
