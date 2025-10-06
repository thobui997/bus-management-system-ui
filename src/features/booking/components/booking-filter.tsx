import { BookingStatus } from '@app/features/booking/types/booking.type';
import { Select, Space } from 'antd';

type BookingFilterProps = {
  onStatusChange: (status?: BookingStatus) => void;
};

const BookingFilter = ({ onStatusChange }: BookingFilterProps) => {
  return (
    <Space size='large'>
      <Select
        size='large'
        placeholder='Filter by status'
        allowClear
        style={{ width: 200 }}
        onChange={onStatusChange}
        options={[
          { label: 'Confirmed', value: BookingStatus.CONFIRMED },
          { label: 'Pending Payment', value: BookingStatus.PENDING_PAYMENT },
          { label: 'Cancelled', value: BookingStatus.CANCELLED }
        ]}
      />
    </Space>
  );
};

export default BookingFilter;
