import { MaintenanceLogFormValues } from '@app/features/vehicle-management/vehicle-fleet/types/maintenance-log.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateMaintenanceLogPayload extends MaintenanceLogFormValues {
  id: number;
}

export const updateMaintenanceLogApi = async (payload: UpdateMaintenanceLogPayload) => {
  const { id, ...updateData } = payload;
  const { data, error } = await supabaseClient.from('maintenance_log').update(updateData).eq('id', id).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseUpdateMaintenanceLogOptions = {
  mutationConfig?: MutationConfig<typeof updateMaintenanceLogApi>;
};

export const useUpdateMaintenanceLog = ({ mutationConfig }: UseUpdateMaintenanceLogOptions = {}) => {
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
    mutationFn: updateMaintenanceLogApi
  });
};
