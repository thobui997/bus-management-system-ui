import { useNotification } from '@app/context/notification-context';
import { useCreateVehicleType } from '@app/features/vehicle-management/api/create-vehicle-type.api';
import { VehicleType } from '@app/features/vehicle-management/types/vehicle-type.type';
import { Form } from 'antd';

export const useUpdateVehicleTypeForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
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
    isLoading: createVehicleTypeMutation.isPending,
    handleSetFormValues
  };
};
