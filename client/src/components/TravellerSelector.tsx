import React, { useState, useRef, useEffect } from 'react';
import { Users, Plus, Minus, Check } from 'lucide-react';

interface TravellerSelectorProps {
  adults: number;
  childrenCount: number;
  infants: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  onChange: (data: { adults: number; children: number; infants: number; cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First' }) => void;
}

export const TravellerSelector: React.FC<TravellerSelectorProps> = ({
  adults,
  childrenCount,
  infants,
  cabinClass,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalTravellers = adults + childrenCount + infants;

  const updateCount = (type: 'adults' | 'children' | 'infants', operation: 'inc' | 'dec') => {
    let newAdults = adults;
    let newChildren = childrenCount;
    let newInfants = infants;

    if (type === 'adults') {
      newAdults = operation === 'inc' ? adults + 1 : Math.max(1, adults - 1);
    } else if (type === 'children') {
      newChildren = operation === 'inc' ? childrenCount + 1 : Math.max(0, childrenCount - 1);
    } else if (type === 'infants') {
      newInfants = operation === 'inc' ? infants + 1 : Math.max(0, infants - 1);
    }

    onChange({
      adults: newAdults,
      children: newChildren,
      infants: newInfants,
      cabinClass,
    });
  };

  const handleCabinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      adults,
      children: childrenCount,
      infants,
      cabinClass: e.target.value as any,
    });
  };

  return (
    <div className="relative flex flex-col" ref={containerRef}>
      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
        Travellers & Class
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-slate-200 text-left"
      >
        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-brand-cyan shrink-0" />
          <div>
            <span className="font-semibold text-sm text-white block">
              {totalTravellers} Traveller{totalTravellers > 1 ? 's' : ''}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">{cabinClass}</span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] right-0 left-0 sm:left-auto sm:w-80 z-50 rounded-xl bg-[#011d2c] border border-white/10 p-5 shadow-2xl space-y-4">
          <div className="text-sm font-semibold text-white border-b border-white/5 pb-2">
            Select Travellers
          </div>

          {/* Adults */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Adults</span>
              <span className="text-[10px] text-slate-400">12+ years</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateCount('adults', 'dec')}
                disabled={adults <= 1}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-40"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-white w-4 text-center">{adults}</span>
              <button
                type="button"
                onClick={() => updateCount('adults', 'inc')}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Children</span>
              <span className="text-[10px] text-slate-400">2 - 12 years</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateCount('children', 'dec')}
                disabled={childrenCount <= 0}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-40"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-white w-4 text-center">{childrenCount}</span>
              <button
                type="button"
                onClick={() => updateCount('children', 'inc')}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Infants */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Infants</span>
              <span className="text-[10px] text-slate-400">Under 2 years</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateCount('infants', 'dec')}
                disabled={infants <= 0}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-40"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-white w-4 text-center">{infants}</span>
              <button
                type="button"
                onClick={() => updateCount('infants', 'inc')}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cabin Class Selection */}
          <div className="space-y-1.5 border-t border-white/5 pt-3">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Cabin Class
            </label>
            <select
              value={cabinClass}
              onChange={handleCabinChange}
              className="w-full bg-[#01111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-cyan"
            >
              <option value="Economy">Economy</option>
              <option value="Premium Economy">Premium Economy</option>
              <option value="Business">Business</option>
              <option value="First">First</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-brand-cyan text-slate-950 font-semibold text-xs hover:bg-brand-cyan-light transition-all shadow-lg shadow-brand-cyan/15"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Selection</span>
          </button>
        </div>
      )}
    </div>
  );
};
