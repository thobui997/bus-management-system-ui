import { PaymentFormValues } from '@app/features/payment/types/payment.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdatePaymentPayload extends PaymentFormValues {
  id: number;
}

export const updatePaymentApi = async (payload: UpdatePaymentPayload) => {
  const { id, ...updateData } = payload;

  const { data, error } = await supabaseClient.from('payment').update(updateData).eq('id', id).select();

  if (error) {
    throw new Error(error.message);
  }

  // Update booking status based on payment status
  if (updateData.status === 'success') {
    await supabaseClient.from('booking').update({ status: 'confirmed' }).eq('id', updateData.booking_id);
  } else if (updateData.status === 'failed') {
    await supabaseClient.from('booking').update({ status: 'pendingPayment' }).eq('id', updateData.booking_id);
  }

  return data;
};

type UseUpdatePaymentOptions = {
  mutationConfig?: MutationConfig<typeof updatePaymentApi>;
};

export const useUpdatePayment = ({ mutationConfig }: UseUpdatePaymentOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['payments']
      });
      queryClient.invalidateQueries({
        queryKey: ['bookings']
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updatePaymentApi
  });
};
