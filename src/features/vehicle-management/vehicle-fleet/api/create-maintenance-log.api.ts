import { MaintenanceLogFormValues } from '@app/features/vehicle-management/vehicle-fleet/types/maintenance-log.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const createMaintenanceLogApi = async (payload: MaintenanceLogFormValues) => {
  const { data, error } = await supabaseClient.from('maintenance_log').insert([payload]).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseCreateMaintenanceLogOptions = {
  mutationConfig?: MutationConfig<typeof createMaintenanceLogApi>;
};

export const useCreateMaintenanceLog = ({ mutationConfig }: UseCreateMaintenanceLogOptions = {}) => {
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
    mutationFn: createMaintenanceLogApi
  });
};
