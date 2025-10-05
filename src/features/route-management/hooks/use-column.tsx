import { Route } from '@app/features/route-management/types/route.type';
import dayjs from '@app/lib/date-utils';
import { ConfirmDeleteButton, EditButton } from '@app/shared/components';
import { DateFormat } from '@app/shared/contants';
import { convertMinutesToHM } from '@app/shared/utils';
import { Button, Space, TableProps, Tag, Tooltip } from 'antd';
import { MapPin, Route as RouteIcon } from 'lucide-react';

type UseColumnProps = {
  onEdit: (record: Route) => void;
  onDelete: (record: Route) => void;
  onManageStops: (record: Route) => void;
};

const useColumn = ({ onEdit, onDelete, onManageStops }: UseColumnProps) => {
  const columns: TableProps<Route>['columns'] = [
    {
      title: 'Route Name',
      dataIndex: 'route_name',
      key: 'route_name',
      width: 200,
      fixed: 'left'
    },
    {
      title: 'Start Station',
      dataIndex: ['start_station', 'station_name'],
      key: 'start_station',
      width: 180,
      render: (value) => (
        <div className='flex items-center gap-1'>
          <Tag color='green'>START</Tag>
          <span>{value || '-'}</span>
        </div>
      )
    },
    {
      title: 'End Station',
      dataIndex: ['end_station', 'station_name'],
      key: 'end_station',
      width: 180,
      render: (value) => (
        <div className='flex items-center gap-1'>
          <Tag color='red'>END</Tag>
          <span>{value || '-'}</span>
        </div>
      )
    },
    {
      title: 'Stops',
      dataIndex: 'route_stops',
      key: 'stops_count',
      width: 120,
      render: (stops: any[]) => {
        const count = stops?.length || 0;
        return (
          <Tag color={count > 0 ? 'blue' : 'default'}>
            <div className='flex items-center gap-1'>
              <MapPin size={14} />
              <span>
                {count} {count === 1 ? 'stop' : 'stops'}
              </span>
            </div>
          </Tag>
        );
      }
    },
    {
      title: 'Distance',
      dataIndex: 'distance',
      key: 'distance',
      width: 120,
      render: (value) => (value ? `${value} km` : '-')
    },
    {
      title: 'Duration',
      dataIndex: 'standard_duration',
      key: 'standard_duration',
      width: 120,
      render: (value) => convertMinutesToHM(value)
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (value) => (
        <div className='flex flex-col gap-1'>
          <div>{dayjs(value).format(DateFormat.DATE_SLASH)}</div>
          <div className='text-gray-500'>{dayjs(value).format(DateFormat.TIME_24H)}</div>
        </div>
      )
    },
    {
      key: 'action',
      title: 'Action',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space className='!gap-0'>
          <Tooltip title='Manage Stops'>
            <Button icon={<RouteIcon size={20} />} type='text' size='large' onClick={() => onManageStops(record)} />
          </Tooltip>
          <EditButton onClick={() => onEdit(record)} />
          <ConfirmDeleteButton
            title='Are you sure you want to delete this route? This will also delete all associated stops.'
            onConfirm={() => onDelete(record)}
          />
        </Space>
      )
    }
  ];

  return { columns };
};

export default useColumn;
