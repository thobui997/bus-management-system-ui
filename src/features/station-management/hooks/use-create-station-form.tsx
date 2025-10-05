import { useNotification } from '@app/context/notification-context';
import { useCreateStation } from '@app/features/station-management/api/create-station.api';
import { Form } from 'antd';

export const useCreateStationForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const createStationMutation = useCreateStation({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Station created successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to create station');
      }
    }
  });

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      createStationMutation.mutate(formValues);
    } catch (error) {
      console.error('Error creating station:', error);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading: createStationMutation.isPending
  };
};
