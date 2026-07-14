import React from 'react';
import { Search, Plane, Building2, Map } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<any>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'flights' | 'hotels' | 'tours' | 'default';
}

const variantIcons = {
  flights: Plane,
  hotels: Building2,
  tours: Map,
  default: Search,
};

const variantColors = {
  flights: {
    bg: 'bg-brand-cyan/10',
    border: 'border-brand-cyan/20',
    text: 'text-brand-cyan',
    btnBg: 'bg-brand-cyan hover:bg-brand-cyan-light',
    btnShadow: 'shadow-brand-cyan/15',
  },
  hotels: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    btnBg: 'bg-amber-500 hover:bg-amber-400',
    btnShadow: 'shadow-amber-500/15',
  },
  tours: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    btnBg: 'bg-emerald-500 hover:bg-emerald-400',
    btnShadow: 'shadow-emerald-500/15',
  },
  default: {
    bg: 'bg-brand-cyan/10',
    border: 'border-brand-cyan/20',
    text: 'text-brand-cyan',
    btnBg: 'bg-brand-cyan hover:bg-brand-cyan-light',
    btnShadow: 'shadow-brand-cyan/15',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
}) => {
  const Icon = icon || variantIcons[variant];
  const colors = variantColors[variant];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className={`w-16 h-16 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-5`}>
        <Icon className={`w-7 h-7 ${colors.text}`} />
      </div>
      <h3 className="font-display text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold ${colors.btnBg} transition-all text-slate-950 shadow-lg ${colors.btnShadow} cursor-pointer`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
