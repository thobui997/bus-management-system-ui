import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteEmployeeApi = async (id: number) => {
  const { error } = await supabaseClient.from('employee').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
};

type UseDeleteEmployeeOptions = {
  mutationConfig?: MutationConfig<typeof deleteEmployeeApi>;
};

export const useDeleteEmployee = ({ mutationConfig }: UseDeleteEmployeeOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['employees']
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteEmployeeApi
  });
};
