import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface VehicleTypePayload {
  type_name: string;
  id?: number;
  description?: string;
}

export const updateVehicleTypeApi = async (payload: VehicleTypePayload) => {
  const { data, error } = await supabaseClient
    .from('vehicle_type')
    .update({ type_name: payload.type_name, description: payload.description })
    .eq('id', payload.id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseUpdateVehicleTypeOptions = {
  mutationConfig?: MutationConfig<typeof updateVehicleTypeApi>;
};

export const useUpdateVehicleType = ({ mutationConfig }: UseUpdateVehicleTypeOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['vehicle-types']
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateVehicleTypeApi
  });
};
