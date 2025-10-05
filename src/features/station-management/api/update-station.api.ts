import { StationFormValues } from '@app/features/station-management/types/station.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateStationPayload extends StationFormValues {
  id: number;
}

export const updateStationApi = async (payload: UpdateStationPayload) => {
  const { id, ...updateData } = payload;
  const { data, error } = await supabaseClient.from('station').update(updateData).eq('id', id).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseUpdateStationOptions = {
  mutationConfig?: MutationConfig<typeof updateStationApi>;
};

export const useUpdateStation = ({ mutationConfig }: UseUpdateStationOptions = {}) => {
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
    mutationFn: updateStationApi
  });
};
