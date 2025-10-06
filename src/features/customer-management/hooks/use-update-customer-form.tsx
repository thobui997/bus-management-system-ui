import { useNotification } from '@app/context/notification-context';
import { useUpdateCustomer } from '@app/features/customer-management/api/update-customer.api';
import { Customer } from '@app/features/customer-management/types/customer.type';
import { Form } from 'antd';

export const useUpdateCustomerForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const updateCustomerMutation = useUpdateCustomer({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Customer updated successfully');
        setOpenFromModal(false);
      },
      onError: () => {
        showNotification('error', 'Failed to update customer');
      }
    }
  });

  const handleSubmit = async (id: number) => {
    try {
      const formValues = await form.validateFields();
      updateCustomerMutation.mutate({ id, ...formValues });
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleSetFormValues = (values: Customer) => {
    setTimeout(() => {
      form.setFieldsValue({
        full_name: values.full_name,
        phone_number: values.phone_number,
        email: values.email,
        loyalty_points: values.loyalty_points
      });
    }, 0);
  };

  return {
    form,
    handleSubmit,
    isLoading: updateCustomerMutation.isPending,
    handleSetFormValues
  };
};
