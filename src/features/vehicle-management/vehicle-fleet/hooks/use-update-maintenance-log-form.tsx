import { useNotification } from '@app/context/notification-context';
import { useUpdateMaintenanceLog } from '@app/features/vehicle-management/vehicle-fleet/api/update-maintenance-log.api';
import { MaintenanceLog } from '@app/features/vehicle-management/vehicle-fleet/types/maintenance-log.type';
import dayjs from '@app/lib/date-utils';
import { Form } from 'antd';

export const useUpdateMaintenanceLogForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const updateMaintenanceLogMutation = useUpdateMaintenanceLog({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Maintenance log updated successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to update maintenance log');
      }
    }
  });

  const handleSubmit = async (id: number) => {
    try {
      const formValues = await form.validateFields();
      updateMaintenanceLogMutation.mutate({ id, ...formValues });
    } catch (error) {
      console.error('Error updating maintenance log:', error);
    }
  };

  const handleSetFormValues = (values: MaintenanceLog) => {
    setTimeout(() => {
      form.setFieldsValue({
        vehicle_id: values.vehicle_id,
        maintenance_type: values.maintenance_type,
        schedule_date: values.schedule_date ? dayjs(values.schedule_date) : null,
        completion_date: values.completion_date ? dayjs(values.completion_date) : null,
        cost: values.cost,
        note: values.note,
        status: values.status
      });
    }, 0);
  };

  return {
    form,
    handleSubmit,
    isLoading: updateMaintenanceLogMutation.isPending,
    handleSetFormValues
  };
};
