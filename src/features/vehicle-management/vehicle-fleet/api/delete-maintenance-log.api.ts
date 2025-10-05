import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteMaintenanceLogApi = async (id: number) => {
  const { error } = await supabaseClient.from('maintenance_log').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
};

type UseDeleteMaintenanceLogOptions = {
  mutationConfig?: MutationConfig<typeof deleteMaintenanceLogApi>;
};

export const useDeleteMaintenanceLog = ({ mutationConfig }: UseDeleteMaintenanceLogOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['maintenance-logs']
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteMaintenanceLogApi
  });
};
