import { TicketFormValues } from '@app/features/booking/types/booking.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ManageTicketsPayload {
  bookingId: number;
  tickets: TicketFormValues[];
}

export const manageTicketsApi = async (payload: ManageTicketsPayload) => {
  const { bookingId, tickets } = payload;

  // Delete existing tickets
  const { error: deleteError } = await supabaseClient.from('ticket').delete().eq('booking_id', bookingId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  // Insert new tickets
  if (tickets.length > 0) {
    const newTickets = tickets.map((ticket) => ({
      booking_id: bookingId,
      seat_number: ticket.seat_number,
      price: ticket.price,
      qrcode: ticket.qrcode || null
    }));

    const { data, error } = await supabaseClient.from('ticket').insert(newTickets).select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  return [];
};

type UseManageTicketsOptions = {
  mutationConfig?: MutationConfig<typeof manageTicketsApi>;
};

export const useManageTickets = ({ mutationConfig }: UseManageTicketsOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['bookings']
      });
      queryClient.invalidateQueries({
        queryKey: ['booking', variables.bookingId]
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: manageTicketsApi
  });
};
