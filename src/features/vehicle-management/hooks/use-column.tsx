import { VehicleType } from '@app/features/vehicle-management/types/vehicle-type.type';
import dayjs from '@app/lib/date-utils';
import { ConfirmDeleteButton, EditButton } from '@app/shared/components';
import { DateFormat } from '@app/shared/contants';
import { Space, TableProps } from 'antd';

type UseColumnProps = {
  onEdit: (record: VehicleType) => void;
  onDelete?: (record: VehicleType) => void;
};

const useColumn = ({ onEdit, onDelete }: UseColumnProps) => {
  const columns: TableProps<VehicleType>['columns'] = [
    {
      title: 'Type Name',
      dataIndex: 'type_name',
      key: 'name',
      width: 200
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (value) => dayjs(value).format(DateFormat.DATE_TIME_SHORT)
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 150,
      render: (value) => dayjs(value).format(DateFormat.DATE_TIME_SHORT)
    },
    {
      key: 'action',
      title: 'Action',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space className='!gap-0'>
          <EditButton onClick={() => onEdit(record)} />
          <ConfirmDeleteButton title='Are you sure you want to delete this vehicle type?' />
        </Space>
      )
    }
  ];

  return { columns };
};

export default useColumn;
