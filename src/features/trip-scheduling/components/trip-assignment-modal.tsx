import { useNotification } from '@app/context/notification-context';
import { useEmployees } from '@app/features/employee-management/api/get-employees.api';
import { Employee } from '@app/features/employee-management/types/employee.type';
import { useTripDetail } from '@app/features/trip-scheduling/api/get-trip-detail.api';
import { useUpdateTripAssignments } from '@app/features/trip-scheduling/api/update-trip-assignments.api';
import { RoleInTrip } from '@app/features/trip-scheduling/types/trip.type';
import dayjs from '@app/lib/date-utils';
import { Button, Card, Modal, Select, Space, Spin, Tag, Tooltip, Typography } from 'antd';
import { Calendar, CreditCard, Mail, Phone, Plus, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const { Text } = Typography;

interface TripAssignmentModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tripId: number;
}

interface Assignment {
  employee_id: number;
  role_in_trip: RoleInTrip;
}

const TripAssignmentModal = ({ open, setOpen, tripId }: TripAssignmentModalProps) => {
  const { showNotification } = useNotification();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newRole, setNewRole] = useState<RoleInTrip | undefined>();
  const [newEmployeeId, setNewEmployeeId] = useState<number | undefined>();

  const tripDetailQuery = useTripDetail({ id: tripId });
  const employeesQuery = useEmployees({ params: { pageSize: 100 } });

  const updateAssignmentsMutation = useUpdateTripAssignments({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Trip assignments updated successfully');
        setOpen(false);
      },
      onError: () => {
        showNotification('error', 'Failed to update trip assignments');
      }
    }
  });

  // Load existing assignments when modal opens
  useEffect(() => {
    if (tripDetailQuery.data?.trip_assignments) {
      setAssignments(
        tripDetailQuery.data.trip_assignments.map((ta) => ({
          employee_id: ta.employee_id,
          role_in_trip: ta.role_in_trip
        }))
      );
    }
  }, [tripDetailQuery.data]);

  const handleAddAssignment = () => {
    if (!newEmployeeId || !newRole) return;

    // Check if employee is already assigned
    if (assignments.some((a) => a.employee_id === newEmployeeId)) {
      showNotification('warning', 'This employee is already assigned to this trip');
      return;
    }

    // Check for role conflicts
    if (newRole === RoleInTrip.DRIVER) {
      const hasDriver = assignments.some((a) => a.role_in_trip === RoleInTrip.DRIVER);
      if (hasDriver) {
        showNotification('warning', 'This trip already has a driver assigned');
        return;
      }
    }

    setAssignments([...assignments, { employee_id: newEmployeeId, role_in_trip: newRole }]);
    setNewEmployeeId(undefined);
    setNewRole(undefined);
  };

  const handleRemoveAssignment = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateAssignmentsMutation.mutate({
      tripId,
      assignments
    });
  };

  const getRoleColor = (role: RoleInTrip) => {
    return role === RoleInTrip.DRIVER ? 'blue' : 'green';
  };

  const assignedEmployeeIds = assignments.map((a) => a.employee_id);
  const availableEmployees = employeesQuery.data?.data.filter((e) => !assignedEmployeeIds.includes(e.id));

  const getEmployeeFromAssignment = (employeeId: number): Employee | undefined => {
    const tripAssignment = tripDetailQuery.data?.trip_assignments?.find((ta) => ta.employee_id === employeeId);
    if (tripAssignment?.employee) {
      return tripAssignment.employee;
    }
    return employeesQuery.data?.data.find((e) => e.id === employeeId);
  };

  if (tripDetailQuery.isLoading) {
    return (
      <Modal open={open} title='Loading...' footer={null} onCancel={() => setOpen(false)}>
        <div className='flex justify-center items-center h-32'>
          <Spin size='large' />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      title='Manage Trip Assignments'
      okText='Save'
      cancelText='Cancel'
      width={800}
      onOk={handleSave}
      onCancel={() => setOpen(false)}
      confirmLoading={updateAssignmentsMutation.isPending}
    >
      <div className='flex flex-col gap-4'>
        {/* Trip Information */}
        <Card size='small' className='bg-gray-50'>
          <div className='flex justify-between items-center'>
            <div>
              <Text strong>Route: </Text>
              <Text>{tripDetailQuery.data?.route?.route_name}</Text>
              <div className='text-sm text-gray-500 mt-1'>
                {tripDetailQuery.data?.route?.start_station?.station_name} →{' '}
                {tripDetailQuery.data?.route?.end_station?.station_name}
              </div>
            </div>
            <div>
              <Text strong>Vehicle: </Text>
              <Text>{tripDetailQuery.data?.vehicle?.license_plate}</Text>
              <div className='text-sm text-gray-500'>
                {tripDetailQuery.data?.vehicle?.brand} {tripDetailQuery.data?.vehicle?.model}
              </div>
            </div>
            <div>
              <Text strong>Departure: </Text>
              <div className='text-sm'>{dayjs(tripDetailQuery.data?.departure_time).format('DD/MM/YYYY HH:mm')}</div>
            </div>
          </div>
        </Card>

        {/* Existing Assignments */}
        <div>
          <Text strong>Current Assignments</Text>
          <div className='mt-2 flex flex-col gap-2'>
            {assignments.length === 0 ? (
              <Card size='small' className='text-center text-gray-500'>
                No assignments yet
              </Card>
            ) : (
              assignments.map((assignment, index) => {
                const employee = getEmployeeFromAssignment(assignment.employee_id);
                return (
                  <Card key={index} size='small'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <User size={20} className='text-gray-500' />
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <Text strong>{employee?.full_name}</Text>
                            <Tag color={getRoleColor(assignment.role_in_trip)}>
                              {assignment.role_in_trip.toUpperCase()}
                            </Tag>
                          </div>
                          <div className='flex items-center gap-4 mt-1 text-sm text-gray-500'>
                            {employee?.email && (
                              <Tooltip title={employee.email}>
                                <div className='flex items-center gap-1'>
                                  <Mail size={14} />
                                  <span className='truncate max-w-[150px]'>{employee.email}</span>
                                </div>
                              </Tooltip>
                            )}
                            {employee?.phone_number && (
                              <div className='flex items-center gap-1'>
                                <Phone size={14} />
                                <span>{employee.phone_number}</span>
                              </div>
                            )}
                            {employee?.license_number && (
                              <div className='flex items-center gap-1'>
                                <CreditCard size={14} />
                                <span>License: {employee.license_number}</span>
                              </div>
                            )}
                            {employee?.license_expiry && (
                              <div className='flex items-center gap-1'>
                                <Calendar size={14} />
                                <span>Exp: {dayjs(employee.license_expiry).format('DD/MM/YYYY')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        type='text'
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => handleRemoveAssignment(index)}
                      />
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Add New Assignment */}
        <div>
          <Text strong>Add Assignment</Text>
          <Card size='small' className='mt-2'>
            <Space.Compact className='w-full'>
              <Select
                className='flex-1'
                placeholder='Select employee'
                value={newEmployeeId}
                onChange={setNewEmployeeId}
                showSearch
                loading={employeesQuery.isLoading}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={availableEmployees?.map((employee) => ({
                  label: `${employee.full_name}${employee.license_number ? ` (License: ${employee.license_number})` : ''}`,
                  value: employee.id
                }))}
              />
              <Select
                style={{ width: 150 }}
                placeholder='Select role'
                value={newRole}
                onChange={setNewRole}
                options={[
                  {
                    label: 'Driver',
                    value: RoleInTrip.DRIVER,
                    disabled: assignments.some((a) => a.role_in_trip === RoleInTrip.DRIVER)
                  },
                  {
                    label: 'Assistant',
                    value: RoleInTrip.ASSISTANT
                  }
                ]}
              />
              <Button
                type='primary'
                icon={<Plus size={16} />}
                onClick={handleAddAssignment}
                disabled={!newEmployeeId || !newRole}
              >
                Add
              </Button>
            </Space.Compact>
          </Card>

          {/* Helper text */}
          {assignments.some((a) => a.role_in_trip === RoleInTrip.DRIVER) && (
            <Text type='secondary' className='text-xs mt-2 block'>
              Note: Only one driver can be assigned per trip
            </Text>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TripAssignmentModal;
