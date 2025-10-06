import { CustomerFormValues } from '@app/features/customer-management/types/customer.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateCustomerPayload extends CustomerFormValues {
  id: number;
}

export const updateCustomerApi = async (payload: UpdateCustomerPayload) => {
  const { id, ...updateData } = payload;
  const { data, error } = await supabaseClient.from('customer').update(updateData).eq('id', id).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseUpdateCustomerOptions = {
  mutationConfig?: MutationConfig<typeof updateCustomerApi>;
};

export const useUpdateCustomer = ({ mutationConfig }: UseUpdateCustomerOptions = {}) => {
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
    mutationFn: updateCustomerApi
  });
};
