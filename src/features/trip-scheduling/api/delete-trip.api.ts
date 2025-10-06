import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteTripApi = async (id: number) => {
  // First delete all trip_assignments
  const { error: assignmentsError } = await supabaseClient.from('trip_assignment').delete().eq('trip_id', id);

  if (assignmentsError) {
    throw new Error(assignmentsError.message);
  }

  // Then delete the trip
  const { error } = await supabaseClient.from('trip').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
};

type UseDeleteTripOptions = {
  mutationConfig?: MutationConfig<typeof deleteTripApi>;
};

export const useDeleteTrip = ({ mutationConfig }: UseDeleteTripOptions = {}) => {
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
    mutationFn: deleteTripApi
  });
};
