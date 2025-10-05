import { StationFormValues } from '@app/features/station-management/types/station.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const createStationApi = async (payload: StationFormValues) => {
  const { data, error } = await supabaseClient.from('station').insert([payload]).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseCreateStationOptions = {
  mutationConfig?: MutationConfig<typeof createStationApi>;
};

export const useCreateStation = ({ mutationConfig }: UseCreateStationOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['stations']
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createStationApi
  });
};
