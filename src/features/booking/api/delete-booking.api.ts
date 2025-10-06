import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteBookingApi = async (id: number) => {
  // First delete all tickets
  const { error: ticketsError } = await supabaseClient.from('ticket').delete().eq('booking_id', id);

  if (ticketsError) {
    throw new Error(ticketsError.message);
  }

  // Then delete the booking
  const { error } = await supabaseClient.from('booking').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
};

type UseDeleteBookingOptions = {
  mutationConfig?: MutationConfig<typeof deleteBookingApi>;
};

export const useDeleteBooking = ({ mutationConfig }: UseDeleteBookingOptions = {}) => {
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
    mutationFn: deleteBookingApi
  });
};
