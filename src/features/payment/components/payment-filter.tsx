import { PaymentMethod, PaymentStatus } from '@app/features/payment/types/payment.type';
import { DatePicker, Select, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

type PaymentFilterProps = {
  onStatusChange: (status?: PaymentStatus) => void;
  onMethodChange: (method?: PaymentMethod) => void;
  onDateRangeChange: (dates: [string, string] | null) => void;
};

const PaymentFilter = ({ onStatusChange, onMethodChange, onDateRangeChange }: PaymentFilterProps) => {
  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      onDateRangeChange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
    } else {
      onDateRangeChange(null);
    }
  };

  return (
    <Space size='large'>
      <Select
        size='large'
        placeholder='Filter by status'
        allowClear
        style={{ width: 200 }}
        onChange={onStatusChange}
        options={[
          { label: 'Success', value: PaymentStatus.SUCCESS },
          { label: 'Failed', value: PaymentStatus.FAILED }
        ]}
      />

      <Select
        size='large'
        placeholder='Filter by method'
        allowClear
        style={{ width: 200 }}
        onChange={onMethodChange}
        options={[
          { label: 'Cash', value: PaymentMethod.CASH },
          { label: 'E-Wallet', value: PaymentMethod.E_WALLET },
          { label: 'Bank Transfer', value: PaymentMethod.BANK_TRANSFER }
        ]}
      />

      <RangePicker size='large' onChange={handleDateChange} format='DD/MM/YYYY' />
    </Space>
  );
};

export default PaymentFilter;
