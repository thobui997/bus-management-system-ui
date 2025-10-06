import { CustomerFormValues } from '@app/features/customer-management/types/customer.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const createCustomerApi = async (payload: CustomerFormValues) => {
  const { data, error } = await supabaseClient.from('customer').insert([payload]).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseCreateCustomerOptions = {
  mutationConfig?: MutationConfig<typeof createCustomerApi>;
};

export const useCreateCustomer = ({ mutationConfig }: UseCreateCustomerOptions = {}) => {
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
    mutationFn: createCustomerApi
  });
};
