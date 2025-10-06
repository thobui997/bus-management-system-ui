import { useNotification } from '@app/context/notification-context';
import { useCreateCustomer } from '@app/features/customer-management/api/create-customer.api';
import { Form } from 'antd';

export const useCreateCustomerForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const createCustomerMutation = useCreateCustomer({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Customer created successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to create customer');
      }
    }
  });

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      createCustomerMutation.mutate(formValues);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading: createCustomerMutation.isPending
  };
};
