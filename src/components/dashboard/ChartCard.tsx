
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  iconColor?: string;
  children: ReactNode;
  className?: string;
  chartBackground?: string;
  timestamp?: string;
}

export function ChartCard({
  title,
  subtitle,
  icon,
  iconColor,
  children,
  className,
  chartBackground = "bg-blue-500",
  timestamp
}: ChartCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden",
      className
    )}>
      <div className={cn(
        "relative p-6 text-white",
        chartBackground
      )}>
        <div className="relative z-10">
          {children}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-500 mb-2">{subtitle}</p>
        )}
        {timestamp && (
          <div className="flex items-center text-xs text-gray-400">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-2 flex items-center justify-center">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}
