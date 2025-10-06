import { TripFormValues } from '@app/features/trip-scheduling/types/trip.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const createTripApi = async (payload: TripFormValues) => {
  const { data, error } = await supabaseClient.from('trip').insert([payload]).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseCreateTripOptions = {
  mutationConfig?: MutationConfig<typeof createTripApi>;
};

export const useCreateTrip = ({ mutationConfig }: UseCreateTripOptions = {}) => {
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
    mutationFn: createTripApi
  });
};
