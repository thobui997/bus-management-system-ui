import { BookingFormValues } from '@app/features/booking/types/booking.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateBookingPayload extends BookingFormValues {
  id: number;
}

export const updateBookingApi = async (payload: UpdateBookingPayload) => {
  const { id, ...updateData } = payload;
  const { data, error } = await supabaseClient.from('booking').update(updateData).eq('id', id).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseUpdateBookingOptions = {
  mutationConfig?: MutationConfig<typeof updateBookingApi>;
};

export const useUpdateBooking = ({ mutationConfig }: UseUpdateBookingOptions = {}) => {
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
    mutationFn: updateBookingApi
  });
};
