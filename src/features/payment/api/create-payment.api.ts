import { PaymentFormValues } from '@app/features/payment/types/payment.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const createPaymentApi = async (payload: PaymentFormValues) => {
  // Check if booking exists and get its details
  const { data: booking, error: bookingError } = await supabaseClient
    .from('booking')
    .select('id, total_amount, status')
    .eq('id', payload.booking_id)
    .single();

  if (bookingError) {
    throw new Error('Booking not found');
  }

  // Validate amount matches booking total_amount
  if (payload.amount !== booking.total_amount) {
    throw new Error('Payment amount must match booking total amount');
  }

  const { data, error } = await supabaseClient.from('payment').insert([payload]).select();

  if (error) {
    throw new Error(error.message);
  }

  // Update booking status to confirmed if payment is successful
  if (payload.status === 'success') {
    await supabaseClient.from('booking').update({ status: 'confirmed' }).eq('id', payload.booking_id);
  }

  return data;
};

type UseCreatePaymentOptions = {
  mutationConfig?: MutationConfig<typeof createPaymentApi>;
};

export const useCreatePayment = ({ mutationConfig }: UseCreatePaymentOptions = {}) => {
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
    mutationFn: createPaymentApi
  });
};
