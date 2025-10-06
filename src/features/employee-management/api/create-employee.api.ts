import { EmployeeFormValues } from '@app/features/employee-management/types/employee.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const createEmployeeApi = async (payload: EmployeeFormValues) => {
  const { data, error } = await supabaseClient.from('employee').insert([payload]).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseCreateEmployeeOptions = {
  mutationConfig?: MutationConfig<typeof createEmployeeApi>;
};

export const useCreateEmployee = ({ mutationConfig }: UseCreateEmployeeOptions = {}) => {
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
    mutationFn: createEmployeeApi
  });
};
