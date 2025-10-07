import {
  MaintenanceLog,
  MaintenanceLogParams
} from '@app/features/vehicle-management/vehicle-fleet/types/maintenance-log.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getMaintenanceLogsApi = async (params: MaintenanceLogParams = {}) => {
  const { search = '', page = 1, pageSize = 10, status, vehicle_id } = params;

  let query = supabaseClient
    .from('maintenance_log')
    .select('*, vehicle:vehicle_id(id, license_plate, brand, model)', { count: 'exact' });

  if (search) {
    query = query.or(`maintenance_type.ilike.%${search}%,note.ilike.%${search}%`);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (vehicle_id) {
    query = query.eq('vehicle_id', vehicle_id);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  query = query.order('updated_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: data as MaintenanceLog[],
    total,
    page,
    pageSize,
    totalPages
  };
};

export const getMaintenanceLogsQueryOptions = (params: MaintenanceLogParams = {}) => {
  return queryOptions({
    queryKey: ['maintenance-logs', params],
    queryFn: () => getMaintenanceLogsApi(params)
  });
};

type UseMaintenanceLogsOptions = {
  params?: MaintenanceLogParams;
  queryConfig?: QueryConfig<typeof getMaintenanceLogsQueryOptions>;
};

export const useMaintenanceLogs = ({ queryConfig = {}, params = {} }: UseMaintenanceLogsOptions = {}) => {
  return useQuery({
    ...getMaintenanceLogsQueryOptions(params),
    ...queryConfig
  });
};
