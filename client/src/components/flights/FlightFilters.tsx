import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateFilters, resetFilters } from '../../store/bookingSlice';

export const FlightFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.booking.filters);

  return (
    <div className="glass-card rounded-2xl p-5 border-white/5 space-y-4">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="font-display font-semibold text-white text-sm">GDS Filters</span>
        <button
          type="button"
          onClick={() => dispatch(resetFilters())}
          className="text-[10px] font-bold text-brand-cyan hover:underline cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* Stops filter */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stops</span>
        <div className="flex gap-2">
          {[
            { id: null, label: 'All' },
            { id: 0, label: 'Direct' },
            { id: 1, label: '1 Stop' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => dispatch(updateFilters({ stops: item.id as any }))}
              className={`flex-1 text-center py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                filters.stops === item.id
                  ? 'bg-brand-cyan/15 border-brand-cyan text-white'
                  : 'bg-[#011420] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Refundability */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ticket Refundability</span>
        <div className="flex gap-2">
          {[
            { id: null, label: 'All' },
            { id: true, label: 'Refundable' },
            { id: false, label: 'Non-Refund' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => dispatch(updateFilters({ refundable: item.id as any }))}
              className={`flex-1 text-center py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                filters.refundable === item.id
                  ? 'bg-brand-cyan/15 border-brand-cyan text-white'
                  : 'bg-[#011420] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
