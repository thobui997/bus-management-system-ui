import { useNotification } from '@app/context/notification-context';
import { useUpdateVehicle } from '@app/features/vehicle-management/vehicle-fleet/api/update-vehicle.api';
import { Vehicle } from '@app/features/vehicle-management/vehicle-fleet/types/vehicle.type';
import { Form } from 'antd';

export const useUpdateVehicleForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const updateVehicleMutation = useUpdateVehicle({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Vehicle updated successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to update vehicle');
      }
    }
  });

  const handleSubmit = async (id: number) => {
    try {
      const formValues = await form.validateFields();
      updateVehicleMutation.mutate({ id, ...formValues });
    } catch (error) {
      console.error('Error updating vehicle:', error);
    }
  };

  const handleSetFormValues = (values: Vehicle) => {
    setTimeout(() => {
      form.setFieldsValue({
        license_plate: values.license_plate,
        vehicle_type_id: values.vehicle_type_id,
        brand: values.brand,
        model: values.model,
        year_manufactured: values.year_manufactured,
        seat_capacity: values.seat_capacity,
        manufacturer: values.manufacturer,
        status: values.status
      });
    }, 0);
  };

  return {
    form,
    handleSubmit,
    isLoading: updateVehicleMutation.isPending,
    handleSetFormValues
  };
};
