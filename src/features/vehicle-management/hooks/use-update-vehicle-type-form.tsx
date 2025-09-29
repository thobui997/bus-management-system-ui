import { useNotification } from '@app/context/notification-context';
import { useUpdateVehicleType } from '@app/features/vehicle-management/api/update-vehicle-type.api';
import { VehicleType } from '@app/features/vehicle-management/types/vehicle-type.type';
import { Form } from 'antd';

export const useUpdateVehicleTypeForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const updateVehicleTypeMutation = useUpdateVehicleType({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Vehicle type updated successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to create blog');
      }
    }
  });

  const handleSubmit = async (id: number) => {
    try {
      const formValues = await form.validateFields();

      updateVehicleTypeMutation.mutate({ id, ...formValues });
    } catch (error) {
      console.error('Error adding destination:', error);
    }
  };

  const handleSetFormValues = (values: VehicleType) => {
    setTimeout(() => {
      form.setFieldsValue({
        type_name: values.type_name,
        description: values.description
      });
    }, 0);
  };

  return {
    form,
    handleSubmit,
    isLoading: updateVehicleTypeMutation.isPending,
    handleSetFormValues
  };
};
