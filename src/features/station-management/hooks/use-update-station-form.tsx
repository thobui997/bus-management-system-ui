import { useNotification } from '@app/context/notification-context';
import { useUpdateStation } from '@app/features/station-management/api/update-station.api';
import { Station } from '@app/features/station-management/types/station.type';
import { Form } from 'antd';

export const useUpdateStationForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const updateStationMutation = useUpdateStation({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Station updated successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to update station');
      }
    }
  });

  const handleSubmit = async (id: number) => {
    try {
      const formValues = await form.validateFields();
      updateStationMutation.mutate({ id, ...formValues });
    } catch (error) {
      console.error('Error updating station:', error);
    }
  };

  const handleSetFormValues = (values: Station) => {
    setTimeout(() => {
      form.setFieldsValue({
        station_name: values.station_name,
        address: values.address
      });
    }, 0);
  };

  return {
    form,
    handleSubmit,
    isLoading: updateStationMutation.isPending,
    handleSetFormValues
  };
};
