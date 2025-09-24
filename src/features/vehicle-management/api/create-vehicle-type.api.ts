import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface VehicleTypePayload {
  type_name: string;
  description?: string;
}

export const createVehicleTypeApi = async (payload: VehicleTypePayload) => {
  const { data, error } = await supabaseClient
    .from('vehicle_type')
    .insert([{ type_name: payload.type_name, description: payload.description }])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseVehicleTypeOptions = {
  mutationConfig?: MutationConfig<typeof createVehicleTypeApi>;
};

export const useCreateVehicleType = ({ mutationConfig }: UseVehicleTypeOptions = {}) => {
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
    mutationFn: createVehicleTypeApi
  });
};
