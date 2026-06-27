import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateFilters } from '../../store/bookingSlice';
import { FlightResultCard } from './FlightResultCard';
import { ArrowUpDown, AlertTriangle } from 'lucide-react';

export const FlightResultsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const filteredFlights = useAppSelector((state) => state.booking.filteredFlights);
  const searchTriggered = useAppSelector((state) => state.booking.searchTriggered);
  const isSearching = useAppSelector((state) => state.booking.isSearching);
  const searchQuery = useAppSelector((state) => state.booking.searchQuery);
  const filters = useAppSelector((state) => state.booking.filters);
  const markupType = useAppSelector((state) => state.booking.markupType);
  const markupValue = useAppSelector((state) => state.booking.markupValue);
  const commissionRate = useAppSelector((state) => state.booking.commissionRate);

  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);

  if (!searchTriggered) return null;

  return (
    <div className="space-y-4">
      {/* Result metadata sort */}
      <div className="flex justify-between items-center bg-[#011420] border border-white/5 px-4 py-3 rounded-2xl">
        <span className="text-xs font-semibold text-slate-400">
          Showing <span className="text-white">{filteredFlights.length}</span> flight matches for {searchQuery.from} → {searchQuery.to}
        </span>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filters.sortOrder}
            onChange={(e) => dispatch(updateFilters({ sortOrder: e.target.value as any }))}
            className="bg-transparent text-xs font-semibold text-slate-300 border-none outline-none focus:ring-0 cursor-pointer [color-scheme:dark]"
          >
            <option value="priceAsc" className="bg-slate-900">Sort: Price (Lowest)</option>
            <option value="priceDesc" className="bg-slate-900">Sort: Price (Highest)</option>
            <option value="durationAsc" className="bg-slate-900">Sort: Flight Duration</option>
            <option value="depTimeAsc" className="bg-slate-900">Sort: Departure Time</option>
          </select>
        </div>
      </div>

      {/* Loading & Empty states */}
      {isSearching ? (
        <div className="glass-card rounded-2xl p-16 text-center space-y-4 border-white/5">
          <div className="w-12 h-12 rounded-full border-t-2 border-brand-cyan border-r-2 animate-spin mx-auto" />
          <p className="text-slate-300 font-medium text-sm animate-pulse">Syncing live NDC inventories from GDS portals...</p>
        </div>
      ) : filteredFlights.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center space-y-2 border-white/5">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h4 className="font-display font-semibold text-white text-base">No flights match the filters</h4>
          <p className="text-slate-400 text-xs max-w-sm mx-auto text-center">
            Try expanding filters or changing options in the search widget to locate flight schedules.
          </p>
        </div>
      ) : (
        /* Flight Cards list */
        <div className="space-y-3">
          {filteredFlights.map((flight) => (
            <FlightResultCard
              key={flight.id}
              flight={flight}
              commissionRate={commissionRate}
              markupType={markupType}
              markupValue={markupValue}
              isExpanded={expandedFlightId === flight.id}
              onToggleExpand={() => setExpandedFlightId(expandedFlightId === flight.id ? null : flight.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
