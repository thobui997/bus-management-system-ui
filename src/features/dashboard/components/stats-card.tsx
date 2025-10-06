import { Card, Statistic } from 'antd';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
  suffix?: string;
  prefix?: string;
}

const StatsCard = ({ title, value, icon: Icon, color = '#1890ff', suffix, prefix }: StatsCardProps) => {
  return (
    <Card variant='borderless' className='shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex items-center justify-between'>
        <Statistic title={title} value={value} suffix={suffix} prefix={prefix} />
        <div
          className='flex items-center justify-center w-14 h-14 rounded-full'
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={28} style={{ color }} />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
