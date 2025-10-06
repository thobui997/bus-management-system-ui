import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deletePaymentApi = async (id: number) => {
  const { error } = await supabaseClient.from('payment').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
};

type UseDeletePaymentOptions = {
  mutationConfig?: MutationConfig<typeof deletePaymentApi>;
};

export const useDeletePayment = ({ mutationConfig }: UseDeletePaymentOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['payments']
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deletePaymentApi
  });
};
