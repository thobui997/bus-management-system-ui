import { useCustomers } from '@app/features/customer-management/api/get-customers.api';
import { useTrips } from '@app/features/trip-scheduling/api/get-trips.api';
import { BookingStatus, TicketFormValues } from '@app/features/booking/types/booking.type';
import { Button, Card, DatePicker, Divider, Form, FormInstance, Input, InputNumber, Modal, Select, Space } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

type BookingFormModalProps = {
  mode?: 'create' | 'edit';
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance<any>;
  handleSubmit: (tickets: TicketFormValues[]) => Promise<void>;
  initialTickets?: TicketFormValues[];
};

const BookingFormModal = ({
  open,
  setOpen,
  form,
  handleSubmit,
  mode = 'create',
  initialTickets = []
}: BookingFormModalProps) => {
  const [tickets, setTickets] = useState<TicketFormValues[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customersQuery = useCustomers({ params: { pageSize: 100 } });
  const tripsQuery = useTrips({ params: { pageSize: 100 } });

  // Initialize tickets when modal opens
  useEffect(() => {
    if (open) {
      if (initialTickets.length > 0) {
        setTickets([...initialTickets]); // Create new array to avoid reference issues
      } else if (mode === 'create') {
        setTickets([{ seat_number: '', price: 0, qrcode: '' }]);
      }
    }
  }, [open, mode, initialTickets.length]); // Use length to avoid infinite loop

  // Auto calculate total amount based on tickets
  useEffect(() => {
    const totalAmount = tickets.reduce((sum, ticket) => sum + (Number(ticket.price) || 0), 0);
    form.setFieldValue('total_amount', totalAmount);
  }, [tickets, form]);

  const handleAddTicket = () => {
    setTickets([...tickets, { seat_number: '', price: 0, qrcode: '' }]);
  };

  const handleRemoveTicket = (index: number) => {
    if (tickets.length > 1) {
      const newTickets = tickets.filter((_, i) => i !== index);
      setTickets(newTickets);
    }
  };

  const handleTicketChange = (index: number, field: keyof TicketFormValues, value: any) => {
    const newTickets = [...tickets];
    newTickets[index] = {
      ...newTickets[index],
      [field]: field === 'price' ? Number(value) || 0 : value
    };
    setTickets(newTickets);
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate booking form
      await form.validateFields();

      // Validate tickets
      if (tickets.length === 0) {
        Modal.error({
          title: 'Validation Error',
          content: 'Please add at least one ticket'
        });
        setIsSubmitting(false);
        return;
      }

      const hasEmptyTicket = tickets.some((t) => !t.seat_number || !t.price || t.price <= 0);
      if (hasEmptyTicket) {
        Modal.error({
          title: 'Validation Error',
          content: 'Please fill all ticket information with valid seat number and price'
        });
        setIsSubmitting(false);
        return;
      }

      // Check for duplicate seat numbers
      const seatNumbers = tickets.map((t) => t.seat_number.trim().toLowerCase());
      const hasDuplicates = seatNumbers.length !== new Set(seatNumbers).size;
      if (hasDuplicates) {
        Modal.error({
          title: 'Validation Error',
          content: 'Duplicate seat numbers found. Each seat number must be unique.'
        });
        setIsSubmitting(false);
        return;
      }

      await handleSubmit(tickets);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Form validation error:', error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    // Reset tickets when closing
    setTickets([]);
  };

  const totalAmount = tickets.reduce((sum, ticket) => sum + (Number(ticket.price) || 0), 0);

  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Create Booking' : 'Edit Booking'}
      okText={mode === 'create' ? 'Create' : 'Update'}
      cancelText='Cancel'
      onOk={onSubmit}
      onCancel={handleCancel}
      destroyOnHidden
      centered
      width={1200}
      confirmLoading={isSubmitting}
    >
      <div className='grid grid-cols-2 gap-6'>
        {/* Left Column - Booking Information */}
        <div className='border-r border-gray-300 !pr-6'>
          <h3 className='text-lg font-semibold mb-4'>Booking Information</h3>
          <Form layout='vertical' form={form} name='booking_form'>
            <Form.Item
              name='customer_id'
              label='Customer'
              rules={[{ required: true, message: 'Please select a customer' }]}
            >
              <Select
                placeholder='Select customer'
                showSearch
                size='large'
                loading={customersQuery.isLoading}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={customersQuery.data?.data.map((customer) => ({
                  label: `${customer.full_name} - ${customer.email || customer.phone_number}`,
                  value: customer.id
                }))}
              />
            </Form.Item>

            <Form.Item name='trip_id' label='Trip' rules={[{ required: true, message: 'Please select a trip' }]}>
              <Select
                placeholder='Select trip'
                showSearch
                size='large'
                loading={tripsQuery.isLoading}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={tripsQuery.data?.data.map((trip) => ({
                  label: `${trip.route?.route_name} - ${new Date(trip.departure_time).toLocaleString()}`,
                  value: trip.id
                }))}
              />
            </Form.Item>

            <Form.Item
              name='booking_time'
              label='Booking Time'
              rules={[{ required: true, message: 'Please select booking time' }]}
            >
              <DatePicker
                className='w-full'
                size='large'
                showTime
                format='DD/MM/YYYY HH:mm'
                placeholder='Select booking time'
              />
            </Form.Item>

            <Form.Item name='status' label='Status' rules={[{ required: true, message: 'Please select status' }]}>
              <Select
                placeholder='Select status'
                size='large'
                options={[
                  { label: 'Confirmed', value: BookingStatus.CONFIRMED },
                  { label: 'Pending Payment', value: BookingStatus.PENDING_PAYMENT },
                  { label: 'Cancelled', value: BookingStatus.CANCELLED }
                ]}
              />
            </Form.Item>

            {/* IMPORTANT: Remove Form.Item wrapper, just display the value */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Total Amount (VND)</label>
              <InputNumber
                className='!w-full'
                size='large'
                disabled
                value={totalAmount}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
              <div className='text-xs text-gray-500 mt-1'>Auto-calculated from ticket prices</div>
            </div>
          </Form>
        </div>

        {/* Right Column - Tickets Information */}
        <div className='pl-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold'>Tickets ({tickets.length})</h3>
            <Button type='dashed' icon={<Plus size={16} />} onClick={handleAddTicket} size='large'>
              Add Ticket
            </Button>
          </div>

          <div className='flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2'>
            {tickets.length === 0 ? (
              <Card className='text-center py-8 bg-gray-50'>
                <p className='text-gray-500'>No tickets yet. Click "Add Ticket" to create one.</p>
              </Card>
            ) : (
              tickets.map((ticket, index) => (
                <Card key={index} size='small' className='shadow-sm hover:shadow-md transition-shadow'>
                  <div className='flex items-center gap-2 mb-3'>
                    <div className='bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold'>
                      {index + 1}
                    </div>
                    <Divider type='vertical' className='h-6' />
                    {tickets.length > 1 && (
                      <Button
                        danger
                        type='text'
                        icon={<Trash2 size={16} />}
                        onClick={() => handleRemoveTicket(index)}
                        size='small'
                        className='ml-auto'
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <Space direction='vertical' className='w-full' size='middle'>
                    <div>
                      <label className='text-xs text-gray-600 font-medium mb-1 block'>
                        Seat Number <span className='text-red-500'>*</span>
                      </label>
                      <Input
                        value={ticket.seat_number}
                        onChange={(e) => handleTicketChange(index, 'seat_number', e.target.value)}
                        placeholder='e.g., A12'
                        maxLength={10}
                        size='large'
                        status={!ticket.seat_number ? 'error' : ''}
                      />
                    </div>

                    <div>
                      <label className='text-xs text-gray-600 font-medium mb-1 block'>
                        Price (VND) <span className='text-red-500'>*</span>
                      </label>
                      <InputNumber
                        className='!w-full'
                        value={ticket.price}
                        onChange={(value) => handleTicketChange(index, 'price', value)}
                        min={0}
                        placeholder='Enter price'
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => {
                          const parsed = value?.replace(/\$\s?|(,*)/g, '');
                          return parsed ? Number(parsed) : 0;
                        }}
                        size='large'
                        status={!ticket.price || ticket.price <= 0 ? 'error' : ''}
                      />
                    </div>

                    <div>
                      <label className='text-xs text-gray-600 font-medium mb-1 block'>QR Code (Optional)</label>
                      <Input
                        value={ticket.qrcode || ''}
                        onChange={(e) => handleTicketChange(index, 'qrcode', e.target.value)}
                        placeholder='QR code data'
                        size='large'
                      />
                    </div>
                  </Space>
                </Card>
              ))
            )}
          </div>

          {/* Summary */}
          {tickets.length > 0 && (
            <Card size='small' className='mt-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200'>
              <div className='flex justify-between items-center mb-2'>
                <span className='font-semibold text-gray-700'>Total Tickets:</span>
                <span className='text-lg font-bold text-blue-600'>{tickets.length}</span>
              </div>
              <Divider className='my-2' />
              <div className='flex justify-between items-center'>
                <span className='font-semibold text-gray-700'>Total Amount:</span>
                <span className='text-xl font-bold text-green-600'>{totalAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BookingFormModal;
