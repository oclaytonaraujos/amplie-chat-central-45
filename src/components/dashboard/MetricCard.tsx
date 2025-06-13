import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}
export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  trend,
  className
}: MetricCardProps) {
  return <div className={cn("bg-white rounded-xl shadow-amplie p-4 md:p-6 hover:shadow-amplie-hover transition-all duration-300 animate-fade-in", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm font-medium text-gray-600 uppercase tracking-wide truncate">
            {title}
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1 md:mt-2">
            {value}
          </p>
          {subtitle}
          {trend && <div className="flex items-center mt-2 md:mt-3">
              
              
            </div>}
        </div>
        <div className={cn("p-2 md:p-3 rounded-xl flex-shrink-0", iconColor)}>
          {icon}
        </div>
      </div>
    </div>;
}