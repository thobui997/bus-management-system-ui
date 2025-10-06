import { useDashboardStats } from '@app/features/dashboard/api/get-dashboard-stats.api';
import RecentBookingsCard from '@app/features/dashboard/components/recent-bookings-card';
import StatsCard from '@app/features/dashboard/components/stats-card';
import UpcomingTripsCard from '@app/features/dashboard/components/upcoming-trips-card';
import { PageTitle } from '@app/shared/components';
import Container from '@app/shared/layouts/container';
import { Card, Col, Divider, Row, Spin } from 'antd';
import {
  AlertTriangle,
  Bus,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Ticket,
  TrendingUp,
  Users,
  Wrench,
  XCircle
} from 'lucide-react';

const DashboardRoute = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Container>
        <div className='flex justify-center items-center h-full'>
          <Spin size='large' />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <div className='mb-6'>
        <PageTitle title='Dashboard' subTitle='Quick insights and performance overview' />
      </div>

      <div className='flex-1 flex flex-col gap-8 overflow-y-auto'>
        {/* Top Summary Section */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <StatsCard
              title='Total Revenue'
              value={stats?.totalRevenue || 0}
              icon={DollarSign}
              color='#52c41a'
              suffix='đ'
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatsCard
              title='Monthly Revenue'
              value={stats?.monthlyRevenue || 0}
              icon={TrendingUp}
              color='#1890ff'
              suffix='đ'
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatsCard title='Total Customers' value={stats?.totalCustomers || 0} icon={Users} color='#722ed1' />
          </Col>
        </Row>

        <Divider className='my-8' />

        {/* Middle Section - Vehicle & Trips */}
        <Row gutter={[16, 16]}>
          {/* Left column */}
          <Col xs={24} lg={12}>
            <Card title='Vehicle Fleet Overview' variant='borderless' className='rounded-2xl shadow-sm'>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={12} lg={12}>
                  <StatsCard title='Total Vehicles' value={stats?.totalVehicles || 0} icon={Bus} color='#1890ff' />
                </Col>
                <Col xs={12} sm={12} lg={12}>
                  <StatsCard title='Active' value={stats?.activeVehicles || 0} icon={CheckCircle} color='#52c41a' />
                </Col>
                <Col xs={12} sm={12} lg={12}>
                  <StatsCard
                    title='Maintenance'
                    value={stats?.maintenanceVehicles || 0}
                    icon={Wrench}
                    color='#faad14'
                  />
                </Col>
                <Col xs={12} sm={12} lg={12}>
                  <StatsCard title='Inactive' value={stats?.inactiveVehicles || 0} icon={XCircle} color='#d9d9d9' />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right column */}
          <Col xs={24} lg={12}>
            <Card title='Trip Performance' variant='borderless' className='rounded-2xl shadow-sm'>
              <Row gutter={[16, 16]}>
                <Col xs={12}>
                  <StatsCard title='Total Trips' value={stats?.totalTrips || 0} icon={Calendar} color='#1890ff' />
                </Col>
                <Col xs={12}>
                  <StatsCard title='On Time' value={stats?.onTimeTrips || 0} icon={CheckCircle} color='#52c41a' />
                </Col>
                <Col xs={12}>
                  <StatsCard title='Delayed' value={stats?.delayedTrips || 0} icon={AlertTriangle} color='#faad14' />
                </Col>
                <Col xs={12}>
                  <StatsCard title='Cancelled' value={stats?.cancelledTrips || 0} icon={XCircle} color='#ff4d4f' />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Divider className='my-8' />

        {/* Booking Stats */}
        <Card title='Booking Insights' variant='borderless' className='rounded-2xl shadow-sm mb-8'>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <StatsCard title='Total Bookings' value={stats?.totalBookings || 0} icon={Ticket} color='#1890ff' />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatsCard title='Confirmed' value={stats?.confirmedBookings || 0} icon={CheckCircle} color='#52c41a' />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatsCard title='Pending Payment' value={stats?.pendingBookings || 0} icon={Clock} color='#faad14' />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatsCard title='Cancelled' value={stats?.cancelledBookings || 0} icon={XCircle} color='#ff4d4f' />
            </Col>
          </Row>
        </Card>

        {/* Recent Section */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <RecentBookingsCard />
          </Col>
          <Col xs={24} lg={12}>
            <UpcomingTripsCard />
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default DashboardRoute;
