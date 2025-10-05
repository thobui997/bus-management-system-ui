import { useNotification } from '@app/context/notification-context';
import { useCreateMaintenanceLog } from '@app/features/vehicle-management/vehicle-fleet/api/create-maintenance-log.api';
import { Form } from 'antd';

export const useCreateMaintenanceLogForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const createMaintenanceLogMutation = useCreateMaintenanceLog({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Maintenance log created successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to create maintenance log');
      }
    }
  });

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      createMaintenanceLogMutation.mutate(formValues);
    } catch (error) {
      console.error('Error creating maintenance log:', error);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading: createMaintenanceLogMutation.isPending
  };
};
