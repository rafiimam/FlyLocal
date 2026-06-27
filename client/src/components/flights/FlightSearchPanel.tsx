import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateSearchQuery, setIsSearching, setSearchTriggered, setSelectedFlight, setFlights } from '../../store/bookingSlice';
import { AirportSelector } from '../AirportSelector';
import { TravellerSelector } from '../TravellerSelector';
import { FLIGHTS } from '../../data/flightData';
import { Plane, ArrowLeftRight, Calendar, Search, ShieldCheck } from 'lucide-react';

interface FlightSearchPanelProps {
  onSearchCompleted?: () => void;
}

export const FlightSearchPanel: React.FC<FlightSearchPanelProps> = ({ onSearchCompleted }) => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.booking.searchQuery);
  const isSearching = useAppSelector((state) => state.booking.isSearching);

  const formatDateDay = (dateStr: string) => {
    if (!dateStr) return '--';
    const parts = dateStr.split('-');
    if (parts.length < 3) return '--';
    return parts[2];
  };

  const formatDateMonthYear = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Select Date';
    return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDateWeekday = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('en-US', { weekday: 'long' });
  };

  const handleSwapAirports = () => {
    const fromVal = searchQuery.from;
    const toVal = searchQuery.to;
    dispatch(updateSearchQuery({
      from: toVal,
      to: fromVal
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setIsSearching(true));
    dispatch(setSearchTriggered(true));
    dispatch(setSelectedFlight(null));

    setTimeout(() => {
      const matches = FLIGHTS.filter((flight) => {
        const fromMatch = flight.departureAirport === searchQuery.from;
        const toMatch = flight.arrivalAirport === searchQuery.to;
        const cabinMatch = flight.cabinClass === searchQuery.cabinClass;
        return fromMatch && toMatch && cabinMatch;
      });
      dispatch(setFlights(matches));
      dispatch(setIsSearching(false));
      if (onSearchCompleted) onSearchCompleted();
    }, 1200);
  };

  return (
    <div className="bg-[#021825]/90 border border-white/10 rounded-3xl p-6 shadow-2xl relative bg-gradient-to-r from-brand-navy-dark to-[#011420]/90">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
      
      <form onSubmit={handleSearchSubmit} className="space-y-6">
        {/* Trip type and status header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex bg-slate-950/60 p-1 rounded-2xl border border-white/10 max-w-fit">
            <button
              type="button"
              onClick={() => dispatch(updateSearchQuery({ tripType: 'oneWay' }))}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                searchQuery.tripType === 'oneWay'
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-cyan-light text-slate-950 shadow-md shadow-brand-cyan/15 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plane className="w-3.5 h-3.5 transform -rotate-45" />
              <span>One Way</span>
            </button>
            <button
              type="button"
              onClick={() => dispatch(updateSearchQuery({ tripType: 'roundTrip' }))}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                searchQuery.tripType === 'roundTrip'
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-cyan-light text-slate-950 shadow-md shadow-brand-cyan/15 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Round Trip</span>
            </button>
          </div>
          <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-full border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sabre & Amadeus GDS Live Hub Active</span>
          </div>
        </div>

        {/* Unique Cockpit GDS Radar Route Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch select-none">
          
          {/* Radar Route Tracker Board - spans 6 cols */}
          <div className="lg:col-span-6 bg-slate-950/50 border border-white/10 rounded-2xl p-5 relative hover:border-white/15 transition-all flex flex-col justify-between">
            <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-500 uppercase tracking-widest pointer-events-none">
              GDS Radar Track: Active
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-3 relative z-10 overflow-visible">
              
              {/* Departure Node Selector */}
              <div className="flex-1 min-w-0">
                <AirportSelector
                  label="Departure Station"
                  value={searchQuery.from}
                  onChange={(code) => dispatch(updateSearchQuery({ from: code }))}
                  placeholder="Departure airport..."
                />
              </div>

              {/* SVG Flight Path Arc - only visible on desktop row view */}
              <div className="hidden sm:block absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-12 pointer-events-none z-0">
                <svg className="w-full h-full text-brand-cyan/20" viewBox="0 0 100 50" fill="none" preserveAspectRatio="none">
                  <path d="M 5 35 Q 50 5 95 35" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle r="3.5" fill="#0ea5e9" className="animate-pulse">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M 5 35 Q 50 5 95 35" />
                  </circle>
                </svg>
              </div>

              {/* Destination Node Selector */}
              <div className="flex-1 min-w-0">
                <AirportSelector
                  label="Destination Station"
                  value={searchQuery.to}
                  onChange={(code) => dispatch(updateSearchQuery({ to: code }))}
                  placeholder="Arrival airport..."
                  excludeCode={searchQuery.from}
                />
              </div>

              {/* Centered Swap Switch (Overlaps boundary on both mobile stack & desktop row) */}
              <div className="absolute left-1/2 top-[55%] sm:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <button
                  type="button"
                  onClick={handleSwapAirports}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 hover:border-brand-cyan text-brand-cyan hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:rotate-180 active:scale-95 cursor-pointer hover:shadow-brand-cyan/25"
                  title="Swap Airports"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

          {/* Date stamp card */}
          <div className="lg:col-span-3 bg-slate-950/50 border border-white/10 rounded-2xl p-5 relative hover:border-white/15 transition-all flex flex-col justify-between">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Departure Date
            </label>
            
            <div className="relative flex-1 flex items-center min-h-[48px] cursor-pointer mt-1">
              {/* Overlay Date Display */}
              <div className="flex items-center gap-3.5 pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-white tracking-tight leading-none">
                      {formatDateDay(searchQuery.departureDate)}
                    </span>
                    <span className="text-sm font-bold text-slate-300">
                      {formatDateMonthYear(searchQuery.departureDate)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5 font-medium">
                    {formatDateWeekday(searchQuery.departureDate)}
                  </span>
                </div>
              </div>

              {/* Invisible HTML Date Input */}
              <input
                type="date"
                required
                value={searchQuery.departureDate}
                onChange={(e) => dispatch(updateSearchQuery({ departureDate: e.target.value }))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
            </div>
          </div>

          {/* Travellers and Class Card */}
          <div className="lg:col-span-3 bg-slate-950/50 border border-white/10 rounded-2xl p-5 relative hover:border-white/15 transition-all flex flex-col justify-between">
            <TravellerSelector
              adults={searchQuery.adults}
              childrenCount={searchQuery.children}
              infants={searchQuery.infants}
              cabinClass={searchQuery.cabinClass}
              onChange={(data) => {
                dispatch(updateSearchQuery({
                  adults: data.adults,
                  children: data.children,
                  infants: data.infants,
                  cabinClass: data.cabinClass,
                }));
              }}
            />
          </div>

        </div>

        {/* Search Actions row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
            <span>Sabre & Amadeus GDS live synchronization. Adjust markup slider below after querying.</span>
          </div>
          
          <button
            type="submit"
            disabled={isSearching}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-cyan-light hover:from-brand-cyan-light hover:to-brand-cyan text-slate-950 font-bold text-sm shadow-xl shadow-brand-cyan/20 hover:shadow-brand-cyan/35 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 duration-300 cursor-pointer"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                <span>Syncing Live Fares...</span>
              </>
            ) : (
              <>
                <Search className="w-4.5 h-4.5" />
                <span>Search Agent Flights</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
