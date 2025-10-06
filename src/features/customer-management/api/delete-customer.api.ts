import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteCustomerApi = async (id: number) => {
  const { error } = await supabaseClient.from('customer').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
};

type UseDeleteCustomerOptions = {
  mutationConfig?: MutationConfig<typeof deleteCustomerApi>;
};

export const useDeleteCustomer = ({ mutationConfig }: UseDeleteCustomerOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['customers']
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteCustomerApi
  });
};
