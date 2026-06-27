import React from 'react';
import { Plane, Building2, Map } from 'lucide-react';
import type { ServiceType } from '../../data/mockData';

interface ServiceTabsProps {
  activeService: ServiceType;
  onChange: (service: ServiceType) => void;
  variant?: 'default' | 'compact';
}

const services: { id: ServiceType; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'hotels', label: 'Hotels', icon: Building2 },
  { id: 'tours', label: 'Tours', icon: Map },
];

export const ServiceTabs: React.FC<ServiceTabsProps> = ({ activeService, onChange, variant = 'default' }) => {
  const isCompact = variant === 'compact';

  const activeStyles: Record<ServiceType, { text: string; bg: string; border: string; icon: string }> = {
    flights: {
      text: 'text-white',
      bg: 'bg-gradient-to-r from-brand-cyan/20 to-brand-cyan/10',
      border: 'border-brand-cyan/30',
      icon: 'text-brand-cyan',
    },
    hotels: {
      text: 'text-white',
      bg: 'bg-gradient-to-r from-amber-500/20 to-amber-500/10',
      border: 'border-amber-500/30',
      icon: 'text-amber-400',
    },
    tours: {
      text: 'text-white',
      bg: 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/10',
      border: 'border-emerald-500/30',
      icon: 'text-emerald-400',
    },
  };

  return (
    <div className={`flex ${isCompact ? 'gap-1' : 'gap-2'} ${isCompact ? 'bg-slate-950/30' : 'bg-slate-950/40'} p-1 rounded-2xl border border-white/5 w-fit`}>
      {services.map((service) => {
        const Icon = service.icon;
        const isActive = activeService === service.id;
        const styles = activeStyles[service.id];

        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onChange(service.id)}
            className={`flex items-center gap-2 ${isCompact ? 'px-3 py-2 text-[11px]' : 'px-5 py-2.5 text-xs'} rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
              isActive
                ? `${styles.bg} ${styles.border} ${styles.text} border shadow-inner`
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Icon className={`${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${isActive ? styles.icon : 'text-slate-400'}`} />
            <span>{service.label}</span>
          </button>
        );
      })}
    </div>
  );
};
