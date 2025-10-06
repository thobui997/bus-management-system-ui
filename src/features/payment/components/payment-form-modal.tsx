import { useBookings } from '@app/features/booking/api/get-bookings.api';
import { BookingStatus } from '@app/features/booking/types/booking.type';
import { PaymentMethod, PaymentStatus } from '@app/features/payment/types/payment.type';
import { DatePicker, Form, FormInstance, InputNumber, Modal, Select } from 'antd';
import { useEffect } from 'react';

type PaymentFormModalProps = {
  mode?: 'create' | 'edit';
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance<any>;
  handleSubmit: () => Promise<void>;
};

const PaymentFormModal = ({ open, setOpen, form, handleSubmit, mode = 'create' }: PaymentFormModalProps) => {
  const bookingsQuery = useBookings({
    params: { pageSize: 100, status: BookingStatus.PENDING_PAYMENT }
  });

  const selectedBookingId = Form.useWatch('booking_id', form);

  useEffect(() => {
    if (selectedBookingId && bookingsQuery.data) {
      const selectedBooking = bookingsQuery.data.data.find((b) => b.id === selectedBookingId);
      if (selectedBooking) {
        form.setFieldValue('amount', selectedBooking.total_amount);
      }
    }
  }, [selectedBookingId, bookingsQuery.data, form]);

  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Create Payment' : 'Edit Payment'}
      okText={mode === 'create' ? 'Create' : 'Update'}
      cancelText='Cancel'
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      onCancel={() => setOpen(false)}
      destroyOnHidden
      centered
      width={700}
      modalRender={(dom) => (
        <Form layout='vertical' form={form} name='payment_form' clearOnDestroy onFinish={() => handleSubmit()}>
          {dom}
        </Form>
      )}
    >
      <div className='grid grid-cols-2 gap-4'>
        <Form.Item name='booking_id' label='Booking' rules={[{ required: true }]} className='col-span-2'>
          <Select
            placeholder='Select booking'
            showSearch
            loading={bookingsQuery.isLoading}
            disabled={mode === 'edit'}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={bookingsQuery.data?.data.map((booking) => ({
              label: `#${booking.id} - ${booking.customer?.full_name} (${booking.total_amount.toLocaleString('vi-VN')} đ)`,
              value: booking.id
            }))}
          />
        </Form.Item>

        <Form.Item name='payment_method' label='Payment Method' rules={[{ required: true }]}>
          <Select
            placeholder='Select payment method'
            options={[
              { label: 'Cash', value: PaymentMethod.CASH },
              { label: 'E-Wallet', value: PaymentMethod.E_WALLET },
              { label: 'Bank Transfer', value: PaymentMethod.BANK_TRANSFER }
            ]}
          />
        </Form.Item>

        <Form.Item name='amount' label='Amount (VND)' rules={[{ required: true }]}>
          <InputNumber
            className='!w-full'
            min={0}
            disabled
            placeholder='Enter amount'
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
          />
        </Form.Item>

        <Form.Item name='transaction_time' label='Transaction Time' rules={[{ required: true }]}>
          <DatePicker className='w-full' showTime format='DD/MM/YYYY HH:mm' placeholder='Select transaction time' />
        </Form.Item>

        <Form.Item name='status' label='Status' rules={[{ required: true }]}>
          <Select
            placeholder='Select status'
            options={[
              { label: 'Success', value: PaymentStatus.SUCCESS },
              { label: 'Failed', value: PaymentStatus.FAILED }
            ]}
          />
        </Form.Item>
      </div>
    </Modal>
  );
};

export default PaymentFormModal;
