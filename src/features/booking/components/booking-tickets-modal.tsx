import { useBookingDetail } from '@app/features/booking/api/get-booking-detail.api';
import { useManageTickets } from '@app/features/booking/api/manage-tickets.api';
import { TicketFormValues } from '@app/features/booking/types/booking.type';
import { useNotification } from '@app/context/notification-context';
import { Button, Card, Form, Input, InputNumber, Modal, Space, Spin, Typography } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const { Text } = Typography;

interface BookingTicketsModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bookingId: number;
}

const BookingTicketsModal = ({ open, setOpen, bookingId }: BookingTicketsModalProps) => {
  const { showNotification } = useNotification();
  const [pendingTickets, setPendingTickets] = useState<TicketFormValues[]>([]);

  const bookingDetailQuery = useBookingDetail({ id: bookingId });
  const manageTicketsMutation = useManageTickets({
    mutationConfig: {
      onSuccess: () => {
        showNotification('success', 'Tickets updated successfully');
        setOpen(false);
      },
      onError: () => {
        showNotification('error', 'Failed to update tickets');
      }
    }
  });

  useEffect(() => {
    if (bookingDetailQuery.data?.tickets) {
      setPendingTickets(
        bookingDetailQuery.data.tickets.map((ticket) => ({
          seat_number: ticket.seat_number,
          price: ticket.price,
          qrcode: ticket.qrcode || undefined
        }))
      );
    }
  }, [bookingDetailQuery.data]);

  const handleAddTicket = () => {
    setPendingTickets([...pendingTickets, { seat_number: '', price: 0, qrcode: '' }]);
  };

  const handleRemoveTicket = (index: number) => {
    setPendingTickets(pendingTickets.filter((_, i) => i !== index));
  };

  const handleTicketChange = (index: number, field: keyof TicketFormValues, value: any) => {
    const newTickets = [...pendingTickets];
    newTickets[index] = { ...newTickets[index], [field]: value };
    setPendingTickets(newTickets);
  };

  const handleSave = () => {
    // Validate
    const hasEmpty = pendingTickets.some((t) => !t.seat_number || !t.price || t.price <= 0);
    if (hasEmpty) {
      showNotification('error', 'Please fill all ticket information');
      return;
    }

    manageTicketsMutation.mutate({
      bookingId,
      tickets: pendingTickets
    });
  };

  return (
    <Modal
      open={open}
      title='Manage Booking Tickets'
      okText='Save'
      cancelText='Cancel'
      width={900}
      onOk={handleSave}
      onCancel={() => setOpen(false)}
      confirmLoading={manageTicketsMutation.isPending}
    >
      {bookingDetailQuery.isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {/* Booking Info */}
          <Card size='small' className='bg-blue-50'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Text strong>Customer:</Text>
                <div>{bookingDetailQuery.data?.customer?.full_name}</div>
                <div className='text-gray-500 text-xs'>{bookingDetailQuery.data?.customer?.email}</div>
              </div>
              <div>
                <Text strong>Trip:</Text>
                <div>Trip #{bookingDetailQuery.data?.trip_id}</div>
                <div className='text-gray-500 text-xs'>
                  Total Amount: {bookingDetailQuery.data?.total_amount.toLocaleString('vi-VN')} đ
                </div>
              </div>
            </div>
          </Card>

          {/* Tickets List */}
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <Text strong className='text-lg'>
                Tickets ({pendingTickets.length})
              </Text>
              <Button type='dashed' icon={<Plus size={16} />} onClick={handleAddTicket}>
                Add Ticket
              </Button>
            </div>

            {pendingTickets.length === 0 ? (
              <Card className='text-center py-8 bg-gray-50'>
                <Text type='secondary'>No tickets yet. Click "Add Ticket" to create one.</Text>
              </Card>
            ) : (
              <div className='flex flex-col gap-3 max-h-96 overflow-y-auto'>
                {pendingTickets.map((ticket, index) => (
                  <Card key={index} size='small' className='shadow-sm'>
                    <div className='grid grid-cols-12 gap-3 items-stretch'>
                      <div className='col-span-3'>
                        <Text type='secondary' className='text-xs'>
                          Seat Number *
                        </Text>
                        <Input
                          value={ticket.seat_number}
                          onChange={(e) => handleTicketChange(index, 'seat_number', e.target.value)}
                          placeholder='A12'
                          maxLength={5}
                          size='large'
                        />
                      </div>

                      <div className='col-span-3'>
                        <Text type='secondary' className='text-xs'>
                          Price (VND) *
                        </Text>
                        <InputNumber
                          className='!w-full'
                          value={ticket.price}
                          onChange={(value) => handleTicketChange(index, 'price', value || 0)}
                          min={0}
                          placeholder='100000'
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
                          size='large'
                        />
                      </div>

                      <div className='col-span-5'>
                        <Text type='secondary' className='text-xs'>
                          QR Code
                        </Text>
                        <Input
                          value={ticket.qrcode}
                          onChange={(e) => handleTicketChange(index, 'qrcode', e.target.value)}
                          placeholder='QR code data (optional)'
                          size='large'
                        />
                      </div>

                      <div className='col-span-1 flex items-end justify-center'>
                        <Button
                          danger
                          type='text'
                          icon={<Trash2 size={20} />}
                          onClick={() => handleRemoveTicket(index)}
                          size='large'
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {pendingTickets.length > 0 && (
            <Card size='small' className='bg-green-50'>
              <div className='flex justify-between items-center'>
                <Text strong>Total Tickets:</Text>
                <Text strong className='text-lg'>
                  {pendingTickets.length}
                </Text>
              </div>
              <div className='flex justify-between items-center mt-2'>
                <Text strong>Calculated Total:</Text>
                <Text strong className='text-lg text-green-600'>
                  {pendingTickets.reduce((sum, t) => sum + (t.price || 0), 0).toLocaleString('vi-VN')} đ
                </Text>
              </div>
            </Card>
          )}
        </div>
      )}
    </Modal>
  );
};

export default BookingTicketsModal;
