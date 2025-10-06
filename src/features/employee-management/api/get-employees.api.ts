import { Employee, EmployeeParams } from '@app/features/employee-management/types/employee.type';
import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getEmployeesApi = async (params: EmployeeParams = {}) => {
  const { search = '', page = 1, pageSize = 10 } = params;

  let query = supabaseClient.from('employee').select('*', { count: 'exact' });

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,phone_number.ilike.%${search}%,license_number.ilike.%${search}%`
    );
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  query = query.order('created_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: data as Employee[],
    total,
    page,
    pageSize,
    totalPages
  };
};

export const getEmployeesQueryOptions = (params: EmployeeParams = {}) => {
  return queryOptions({
    queryKey: ['employees', params],
    queryFn: () => getEmployeesApi(params)
  });
};

type UseEmployeesOptions = {
  params?: EmployeeParams;
  queryConfig?: QueryConfig<typeof getEmployeesQueryOptions>;
};

export const useEmployees = ({ queryConfig = {}, params = {} }: UseEmployeesOptions = {}) => {
  return useQuery({
    ...getEmployeesQueryOptions(params),
    ...queryConfig
  });
};
