import { TripFormValues } from '@app/features/trip-scheduling/types/trip.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateTripPayload extends TripFormValues {
  id: number;
}

export const updateTripApi = async (payload: UpdateTripPayload) => {
  const { id, ...updateData } = payload;
  const { data, error } = await supabaseClient.from('trip').update(updateData).eq('id', id).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseUpdateTripOptions = {
  mutationConfig?: MutationConfig<typeof updateTripApi>;
};

export const useUpdateTrip = ({ mutationConfig }: UseUpdateTripOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['trips']
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateTripApi
  });
};
