import { BookingStatus } from '@app/features/booking/types/booking.type';
import { DatePicker, Form, FormInstance, InputNumber, Modal, Select } from 'antd';

type BookingFormModalProps = {
  mode?: 'create' | 'edit';
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance<any>;
  handleSubmit: () => Promise<void>;
};

const BookingFormModal = ({ open, setOpen, form, handleSubmit, mode = 'create' }: BookingFormModalProps) => {
  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Create Booking' : 'Edit Booking'}
      okText={mode === 'create' ? 'Create' : 'Update'}
      cancelText='Cancel'
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      onCancel={() => setOpen(false)}
      destroyOnHidden
      centered
      width={700}
      modalRender={(dom) => (
        <Form layout='vertical' form={form} name='booking_form' clearOnDestroy onFinish={() => handleSubmit()}>
          {dom}
        </Form>
      )}
    >
      <div className='grid grid-cols-2 gap-4'>
        <Form.Item name='customer_id' label='Customer ID' rules={[{ required: true }]}>
          <InputNumber className='!w-full' min={1} placeholder='Enter customer ID' />
        </Form.Item>

        <Form.Item name='trip_id' label='Trip ID' rules={[{ required: true }]}>
          <InputNumber className='!w-full' min={1} placeholder='Enter trip ID' />
        </Form.Item>

        <Form.Item name='booking_time' label='Booking Time' rules={[{ required: true }]}>
          <DatePicker className='w-full' showTime format='DD/MM/YYYY HH:mm' placeholder='Select booking time' />
        </Form.Item>

        <Form.Item name='total_amount' label='Total Amount (VND)' rules={[{ required: true }]}>
          <InputNumber
            className='!w-full'
            min={0}
            placeholder='Enter total amount'
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as any}
          />
        </Form.Item>

        <Form.Item name='status' label='Status' rules={[{ required: true }]} className='col-span-2'>
          <Select
            placeholder='Select status'
            options={[
              { label: 'Confirmed', value: BookingStatus.CONFIRMED },
              { label: 'Pending Payment', value: BookingStatus.PENDING_PAYMENT },
              { label: 'Cancelled', value: BookingStatus.CANCELLED }
            ]}
          />
        </Form.Item>
      </div>
    </Modal>
  );
};

export default BookingFormModal;
