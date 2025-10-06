import { BookingFormValues } from '@app/features/booking/types/booking.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const createBookingApi = async (payload: BookingFormValues) => {
  console.log('Payload sent to API:', payload); // Debug log

  const { data, error } = await supabaseClient.from('booking').insert([payload]).select();

  if (error) {
    console.error('Supabase error:', error); // Debug log
    throw new Error(error.message);
  }

  console.log('Created booking:', data); // Debug log
  return data;
};

type UseCreateBookingOptions = {
  mutationConfig?: MutationConfig<typeof createBookingApi>;
};

export const useCreateBooking = ({ mutationConfig }: UseCreateBookingOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['bookings']
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createBookingApi
  });
};
