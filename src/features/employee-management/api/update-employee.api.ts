import { EmployeeFormValues } from '@app/features/employee-management/types/employee.type';
import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateEmployeePayload extends EmployeeFormValues {
  id: number;
}

export const updateEmployeeApi = async (payload: UpdateEmployeePayload) => {
  const { id, ...updateData } = payload;
  const { data, error } = await supabaseClient.from('employee').update(updateData).eq('id', id).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

type UseUpdateEmployeeOptions = {
  mutationConfig?: MutationConfig<typeof updateEmployeeApi>;
};

export const useUpdateEmployee = ({ mutationConfig }: UseUpdateEmployeeOptions = {}) => {
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
    mutationFn: updateEmployeeApi
  });
};
