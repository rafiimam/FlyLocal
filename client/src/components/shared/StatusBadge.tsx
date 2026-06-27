import React from 'react';
import { CheckCircle, Clock, XCircle, Plane, LogIn, LogOut } from 'lucide-react';

type BadgeStatus = 'Booked' | 'Confirmed' | 'Ticketed' | 'Pending' | 'Cancelled' | 'Checked In' | 'Checked Out' | 'Completed' | 'Success' | 'Failed';

interface StatusBadgeProps {
  status: BadgeStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<BadgeStatus, { bg: string; text: string; icon: React.ComponentType<any> }> = {
  Booked: { bg: 'bg-brand-cyan/15 border-brand-cyan/25', text: 'text-brand-cyan', icon: Plane },
  Confirmed: { bg: 'bg-emerald-500/15 border-emerald-500/25', text: 'text-emerald-400', icon: CheckCircle },
  Ticketed: { bg: 'bg-emerald-500/15 border-emerald-500/25', text: 'text-emerald-400', icon: CheckCircle },
  Pending: { bg: 'bg-amber-500/15 border-amber-500/25', text: 'text-amber-400', icon: Clock },
  Cancelled: { bg: 'bg-rose-500/15 border-rose-500/25', text: 'text-rose-400', icon: XCircle },
  'Checked In': { bg: 'bg-blue-500/15 border-blue-500/25', text: 'text-blue-400', icon: LogIn },
  'Checked Out': { bg: 'bg-slate-500/15 border-slate-500/25', text: 'text-slate-400', icon: LogOut },
  Completed: { bg: 'bg-emerald-500/15 border-emerald-500/25', text: 'text-emerald-400', icon: CheckCircle },
  Success: { bg: 'bg-emerald-500/15 border-emerald-500/25', text: 'text-emerald-400', icon: CheckCircle },
  Failed: { bg: 'bg-rose-500/15 border-rose-500/25', text: 'text-rose-400', icon: XCircle },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;
  const isSm = size === 'sm';

  return (
    <span className={`inline-flex items-center gap-1 ${isSm ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'} rounded-lg border font-semibold ${config.bg} ${config.text}`}>
      <Icon className={isSm ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
      <span>{status}</span>
    </span>
  );
};
