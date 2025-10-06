import { MutationConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoleInTrip } from '@app/features/trip-scheduling/types/trip.type';

interface UpdateTripAssignmentsPayload {
  tripId: number;
  assignments: Array<{
    employee_id: number;
    role_in_trip: RoleInTrip;
  }>;
}

export const updateTripAssignmentsApi = async (payload: UpdateTripAssignmentsPayload) => {
  const { tripId, assignments } = payload;

  // Delete existing assignments
  const { error: deleteError } = await supabaseClient.from('trip_assignment').delete().eq('trip_id', tripId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  // Insert new assignments
  if (assignments.length > 0) {
    const newAssignments = assignments.map((assignment) => ({
      trip_id: tripId,
      employee_id: assignment.employee_id,
      role_in_trip: assignment.role_in_trip
    }));

    const { data, error } = await supabaseClient.from('trip_assignment').insert(newAssignments).select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  return [];
};

type UseUpdateTripAssignmentsOptions = {
  mutationConfig?: MutationConfig<typeof updateTripAssignmentsApi>;
};

export const useUpdateTripAssignments = ({ mutationConfig }: UseUpdateTripAssignmentsOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['trips']
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: updateTripAssignmentsApi
  });
};
