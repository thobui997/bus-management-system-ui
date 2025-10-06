export interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  maintenanceVehicles: number;
  inactiveVehicles: number;
  totalTrips: number;
  onTimeTrips: number;
  delayedTrips: number;
  cancelledTrips: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalCustomers: number;
  totalEmployees: number;
}
export interface RevenueByMonth {
  month: string;
  revenue: number;
}
export interface TripsByRoute {
  routeName: string;
  tripCount: number;
}
export interface RecentBooking {
  id: number;
  customer_name: string;
  route_name: string;
  departure_time: string;
  total_amount: number;
  status: string;
}
export interface UpcomingTrip {
  id: number;
  route_name: string;
  departure_time: string;
  arrival_time: string;
  vehicle_license: string;
  status: string;
}
