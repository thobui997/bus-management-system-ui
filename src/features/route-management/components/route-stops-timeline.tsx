import { RouteStop } from '@app/features/route-management/types/route.type';
import { useStations } from '@app/features/station-management/api/get-stations.api';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Card, Select, Space, Tag, Typography } from 'antd';
import { GripVertical, MapPin, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const { Text } = Typography;

interface RouteStopsTimelineProps {
  routeStops: RouteStop[];
  startStation?: { id: number; station_name: string };
  endStation?: { id: number; station_name: string };
  onStopsChange: (stops: Array<{ station_id: number; stop_order: number }>) => void;
  isEditable?: boolean;
}

interface SortableStopItemProps {
  stop: RouteStop;
  index: number;
  onRemove: (index: number) => void;
  isEditable: boolean;
}

const SortableStopItem = ({ stop, index, onRemove, isEditable }: SortableStopItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stop.station_id.toString()
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className='relative'>
      <div className='flex items-center gap-3 p-3 bg-white border rounded-lg hover:shadow-md transition-shadow'>
        {isEditable && (
          <div {...attributes} {...listeners} className='cursor-move text-gray-400 hover:text-gray-600'>
            <GripVertical size={20} />
          </div>
        )}
        <div className='flex items-center gap-2 flex-1'>
          <Tag color='blue'>{index + 1}</Tag>
          <MapPin size={16} className='text-gray-500' />
          <div className='flex-1'>
            <Text strong>{stop.station?.station_name}</Text>
            {stop.station?.address && <Text className='block text-xs text-gray-500'>{stop.station.address}</Text>}
          </div>
        </div>
        {isEditable && (
          <Button
            type='text'
            danger
            icon={<Trash2 size={16} />}
            onClick={() => onRemove(index)}
            className='opacity-0 group-hover:opacity-100 transition-opacity'
          />
        )}
      </div>
      {index < 0 && <div className='w-0.5 h-8 bg-gray-300 mx-auto' />}
    </div>
  );
};

const RouteStopsTimeline = ({
  routeStops = [],
  startStation,
  endStation,
  onStopsChange,
  isEditable = false
}: RouteStopsTimelineProps) => {
  const [localStops, setLocalStops] = useState<RouteStop[]>(routeStops);
  const [selectedStationId, setSelectedStationId] = useState<number | undefined>();
  const stationsQuery = useStations({ params: { pageSize: 100 } });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = localStops.findIndex((stop) => stop.station_id.toString() === active.id);
      const newIndex = localStops.findIndex((stop) => stop.station_id.toString() === over?.id);

      const newStops = arrayMove(localStops, oldIndex, newIndex);
      const updatedStops = newStops.map((stop, index) => ({
        ...stop,
        stop_order: index + 1
      }));

      setLocalStops(updatedStops);
      onStopsChange(
        updatedStops.map((stop) => ({
          station_id: stop.station_id,
          stop_order: stop.stop_order
        }))
      );
    }
  };

  const handleAddStop = () => {
    if (!selectedStationId) return;

    const selectedStation = stationsQuery.data?.data.find((s) => s.id === selectedStationId);
    if (!selectedStation) return;

    const newStop: RouteStop = {
      id: Date.now(), // Temporary ID
      route_id: 0,
      station_id: selectedStationId,
      stop_order: localStops.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      station: {
        id: selectedStation.id,
        station_name: selectedStation.station_name,
        address: selectedStation.address || undefined
      }
    };

    const newStops = [...localStops, newStop];
    setLocalStops(newStops);
    onStopsChange(
      newStops.map((stop) => ({
        station_id: stop.station_id,
        stop_order: stop.stop_order
      }))
    );
    setSelectedStationId(undefined);
  };

  const handleRemoveStop = (index: number) => {
    const newStops = localStops
      .filter((_, i) => i !== index)
      .map((stop, i) => ({
        ...stop,
        stop_order: i + 1
      }));
    setLocalStops(newStops);
    onStopsChange(
      newStops.map((stop) => ({
        station_id: stop.station_id,
        stop_order: stop.stop_order
      }))
    );
  };

  // Get available stations (exclude already selected ones)
  const usedStationIds = [startStation?.id, endStation?.id, ...localStops.map((stop) => stop.station_id)].filter(
    Boolean
  );

  const availableStations = stationsQuery.data?.data.filter((station) => !usedStationIds.includes(station.id));

  return (
    <Card title='Route Stops' className='mt-4'>
      <div className='flex flex-col gap-3'>
        {/* Start Station */}
        <div className='!p-4 bg-green-50 border border-green-200 rounded-lg'>
          <div className='flex items-center gap-2'>
            <Tag color='green'>START</Tag>
            <MapPin size={18} className='text-green-600' />
            <Text strong className='text-green-700'>
              {startStation?.station_name || 'Not selected'}
            </Text>
          </div>
        </div>

        {/* Intermediate Stops */}
        {localStops.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={localStops.map((stop) => stop.station_id.toString())}
              strategy={verticalListSortingStrategy}
            >
              <div className='flex flex-col gap-2'>
                {localStops.map((stop, index) => (
                  <div key={stop.station_id} className='group'>
                    <SortableStopItem stop={stop} index={index} onRemove={handleRemoveStop} isEditable={isEditable} />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Add Stop */}
        {isEditable && (
          <div className='!p-3 border-2 border-dashed border-gray-300 rounded-lg'>
            <Space.Compact className='w-full'>
              <Select
                className='flex-1'
                placeholder='Select a station to add'
                value={selectedStationId}
                onChange={setSelectedStationId}
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={availableStations?.map((station) => ({
                  label: station.station_name,
                  value: station.id
                }))}
              />
              <Button type='primary' icon={<Plus size={16} />} onClick={handleAddStop} disabled={!selectedStationId}>
                Add Stop
              </Button>
            </Space.Compact>
          </div>
        )}

        {/* End Station */}
        <div className='!p-4 bg-red-50 border border-red-200 rounded-lg'>
          <div className='flex items-center gap-2'>
            <Tag color='red'>END</Tag>
            <MapPin size={18} className='text-red-600' />
            <Text strong className='text-red-700'>
              {endStation?.station_name || 'Not selected'}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RouteStopsTimeline;
