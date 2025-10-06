import { QueryConfig } from '@app/lib/react-query';
import { supabaseClient } from '@app/lib/supabase-client';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { DashboardStats } from '../types/dashboard.type';

export const getDashboardStatsApi = async (): Promise<DashboardStats> => {
  // Get vehicle stats
  const { data: vehicles } = await supabaseClient.from('vehicle').select('status');

  const totalVehicles = vehicles?.length || 0;
  const activeVehicles = vehicles?.filter((v) => v.status === 'active').length || 0;
  const maintenanceVehicles = vehicles?.filter((v) => v.status === 'maintenance').length || 0;
  const inactiveVehicles = vehicles?.filter((v) => v.status === 'inactive').length || 0;

  // Get trip stats
  const { data: trips } = await supabaseClient.from('trip').select('status');

  const totalTrips = trips?.length || 0;
  const onTimeTrips = trips?.filter((t) => t.status === 'onTime').length || 0;
  const delayedTrips = trips?.filter((t) => t.status === 'delayed').length || 0;
  const cancelledTrips = trips?.filter((t) => t.status === 'cancelled').length || 0;

  // Get booking stats
  const { data: bookings } = await supabaseClient.from('booking').select('status, total_amount');

  const totalBookings = bookings?.length || 0;
  const confirmedBookings = bookings?.filter((b) => b.status === 'confirmed').length || 0;
  const pendingBookings = bookings?.filter((b) => b.status === 'pendingPayment').length || 0;
  const cancelledBookings = bookings?.filter((b) => b.status === 'cancelled').length || 0;

  // Calculate revenue
  const totalRevenue = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

  // Get monthly revenue (current month)
  const currentMonth = new Date().toISOString().slice(0, 7);
  const { data: monthlyBookings } = await supabaseClient
    .from('booking')
    .select('total_amount, created_at')
    .gte('created_at', `${currentMonth}-01`)
    .lte('created_at', `${currentMonth}-31`);

  const monthlyRevenue = monthlyBookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

  // Get customer and employee counts
  const { count: totalCustomers } = await supabaseClient.from('customer').select('*', { count: 'exact', head: true });

  const { count: totalEmployees } = await supabaseClient.from('employee').select('*', { count: 'exact', head: true });

  return {
    totalVehicles,
    activeVehicles,
    maintenanceVehicles,
    inactiveVehicles,
    totalTrips,
    onTimeTrips,
    delayedTrips,
    cancelledTrips,
    totalBookings,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    totalRevenue,
    monthlyRevenue,
    totalCustomers: totalCustomers || 0,
    totalEmployees: totalEmployees || 0
  };
};

export const getDashboardStatsQueryOptions = () => {
  return queryOptions({
    queryKey: ['dashboard-stats'],
    queryFn: () => getDashboardStatsApi(),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

type UseDashboardStatsOptions = {
  queryConfig?: QueryConfig<typeof getDashboardStatsQueryOptions>;
};

export const useDashboardStats = ({ queryConfig = {} }: UseDashboardStatsOptions = {}) => {
  return useQuery({
    ...getDashboardStatsQueryOptions(),
    ...queryConfig
  });
};
