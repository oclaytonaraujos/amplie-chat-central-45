
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
    period: string;
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
  return (
    <div className={cn(
      "bg-white rounded-2xl shadow-sm p-6 border border-gray-100",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
            iconColor
          )}>
            {icon}
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-gray-400 text-xs">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center text-sm">
          <span className={cn(
            "font-semibold",
            trend.isPositive ? "text-green-500" : "text-red-500"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-gray-400 ml-1">
            {trend.period}
          </span>
        </div>
      )}
    </div>
  );
}
