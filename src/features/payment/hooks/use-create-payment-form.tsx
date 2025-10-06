import { useNotification } from '@app/context/notification-context';
import { useCreatePayment } from '@app/features/payment/api/create-payment.api';
import { Form } from 'antd';

export const useCreatePaymentForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const createPaymentMutation = useCreatePayment({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Payment created successfully');
        setOpenFromModal(false);
      },
      onError: (error) => {
        showNotification('error', 'Failed to create payment', error.message);
      }
    }
  });

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      createPaymentMutation.mutate(formValues);
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading: createPaymentMutation.isPending
  };
};
