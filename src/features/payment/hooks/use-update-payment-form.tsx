import { useNotification } from '@app/context/notification-context';
import { useUpdatePayment } from '@app/features/payment/api/update-payment.api';
import { Payment } from '@app/features/payment/types/payment.type';
import dayjs from '@app/lib/date-utils';
import { Form } from 'antd';

export const useUpdatePaymentForm = (setOpenFromModal: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [form] = Form.useForm();
  const { showNotification } = useNotification();

  const updatePaymentMutation = useUpdatePayment({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Payment updated successfully');
        setOpenFromModal(false);
      },
      onError: (error) => {
        showNotification('error', 'Failed to update payment', error.message);
      }
    }
  });

  const handleSubmit = async (id: number) => {
    try {
      const formValues = await form.validateFields();
      updatePaymentMutation.mutate({ id, ...formValues });
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleSetFormValues = (values: Payment) => {
    setTimeout(() => {
      form.setFieldsValue({
        booking_id: values.booking_id,
        payment_method: values.payment_method,
        amount: values.amount,
        transaction_time: values.transaction_time ? dayjs(values.transaction_time) : null,
        status: values.status
      });
    }, 0);
  };

  return {
    form,
    handleSubmit,
    isLoading: updatePaymentMutation.isPending,
    handleSetFormValues
  };
};
