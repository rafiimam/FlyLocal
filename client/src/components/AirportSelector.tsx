import React, { useState, useEffect, useRef } from 'react';
import { AIRPORTS } from '../data/mockData';
import { MapPin } from 'lucide-react';

interface AirportSelectorProps {
  label: string;
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  excludeCode?: string;
}

export const AirportSelector: React.FC<AirportSelectorProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Search airport...',
  excludeCode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedAirport = AIRPORTS.find((a) => a.code === value);

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

  // Update input text to search term when typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const filteredAirports = AIRPORTS.filter((airport) => {
    if (excludeCode && airport.code === excludeCode) return false;
    
    const search = searchTerm.toLowerCase();
    return (
      airport.code.toLowerCase().includes(search) ||
      airport.city.toLowerCase().includes(search) ||
      airport.country.toLowerCase().includes(search) ||
      airport.name.toLowerCase().includes(search)
    );
  });

  const selectAirport = (code: string) => {
    onChange(code);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative flex flex-col" ref={containerRef}>
      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
        {label}
      </label>
      
      <div 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-brand-cyan focus-within:ring-2 focus-within:ring-brand-cyan/20 transition-all cursor-pointer"
      >
        <MapPin className="w-4 h-4 text-brand-cyan shrink-0" />
        <div className="flex-1 overflow-hidden">
          {isOpen ? (
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder={selectedAirport ? `${selectedAirport.city} (${selectedAirport.code})` : placeholder}
              className="w-full bg-transparent border-none outline-none p-0 text-sm text-white placeholder-slate-400 focus:ring-0"
              autoFocus
            />
          ) : (
            <div>
              {selectedAirport ? (
                <div className="text-left">
                  <span className="font-semibold text-sm text-white mr-1.5">{selectedAirport.city}</span>
                  <span className="text-xs text-brand-cyan font-bold bg-brand-cyan/10 px-1.5 py-0.5 rounded">
                    {selectedAirport.code}
                  </span>
                  <span className="text-xs text-slate-400 truncate block mt-0.5">{selectedAirport.name}</span>
                </div>
              ) : (
                <span className="text-sm text-slate-400">{placeholder}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 rounded-xl bg-[#011d2c] border border-white/10 shadow-2xl max-h-60 overflow-y-auto">
          {filteredAirports.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No airports found for "{searchTerm}"
            </div>
          ) : (
            <div className="p-1">
              {filteredAirports.map((airport) => (
                <button
                  key={airport.code}
                  type="button"
                  onClick={() => selectAirport(airport.code)}
                  className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-white/5 text-slate-200 hover:text-white transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{airport.city}</span>
                      <span className="text-[10px] text-slate-400">{airport.country}</span>
                    </div>
                    <span className="text-xs text-slate-400 line-clamp-1 mt-0.5">{airport.name}</span>
                  </div>
                  <span className="text-xs font-bold font-display text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
                    {airport.code}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
