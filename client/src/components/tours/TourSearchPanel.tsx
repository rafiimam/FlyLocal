import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateTourSearch, searchTours, setTourSearching, updateTourFilters, resetTourFilters } from '../../store/tourSlice';
import { POPULAR_TOUR_DESTINATIONS, TOUR_CATEGORIES } from '../../data/tourData';
import { Map, Calendar, Users, Search, MapPin, Tag, Clock, SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

export const TourSearchPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.tour.searchQuery);
  const isSearching = useAppSelector((state) => state.tour.isSearching);
  const filters = useAppSelector((state) => state.tour.filters);

  // Search autocomplete / dropdown toggles
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [destSearch, setDestSearch] = useState(searchQuery.destination);
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDaysDropdown, setShowDaysDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const destRef = useRef<HTMLDivElement>(null);
  const travelersRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const daysRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) setShowDestDropdown(false);
      if (travelersRef.current && !travelersRef.current.contains(e.target as Node)) setShowTravelersDropdown(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setShowCategoryDropdown(false);
      if (daysRef.current && !daysRef.current.contains(e.target as Node)) setShowDaysDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredDests = POPULAR_TOUR_DESTINATIONS.filter(
    (d) =>
      d.destination.toLowerCase().includes(destSearch.toLowerCase()) ||
      d.country.toLowerCase().includes(destSearch.toLowerCase())
  );

  const handleSearch = () => {
    dispatch(setTourSearching(true));
    setTimeout(() => dispatch(searchTours()), 800);
  };

  // Filter Actions
  const handleDifficultySelect = (difficulty: string) => {
    dispatch(updateTourFilters({ difficulty: filters.difficulty === difficulty ? null : difficulty }));
  };

  const sortOptions = [
    { value: 'priceAsc', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
    { value: 'durationAsc', label: 'Duration: Short to Long' },
    { value: 'ratingDesc', label: 'Customer Rating' },
  ];

  const difficulties = ['Easy', 'Moderate', 'Challenging'];

  return (
    <div className="bg-[#021825]/95 border border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-4">
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
            <Map className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Search Tour Packages</h3>
            <span className="text-[10px] text-slate-400">Curated B2B tour packages worldwide</span>
          </div>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
          <span>{showFilters ? 'Hide Filters' : 'Advanced Filters'}</span>
          {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Search Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Destination */}
        <div className="md:col-span-3 relative" ref={destRef}>
          <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Destination</label>
          <div
            className="flex items-center gap-2 bg-slate-950/50 border border-white/10 rounded-xl px-3 py-3 cursor-text hover:border-emerald-500/30 transition-colors"
            onClick={() => setShowDestDropdown(true)}
          >
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={destSearch}
              onChange={(e) => {
                setDestSearch(e.target.value);
                dispatch(updateTourSearch({ destination: e.target.value }));
                setShowDestDropdown(true);
              }}
              placeholder="Where to..."
              className="bg-transparent w-full text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>
          {showDestDropdown && filteredDests.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#011d2c] border border-white/10 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto">
              {filteredDests.map((d) => (
                <button
                  key={d.destination}
                  onClick={() => {
                    setDestSearch(d.destination);
                    dispatch(updateTourSearch({ destination: d.destination }));
                    setShowDestDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold block">{d.destination}</span>
                    <span className="text-[10px] text-slate-500">{d.country}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Travel Date */}
        <div className="md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Travel Date</label>
          <div className="flex items-center gap-2 bg-slate-950/50 border border-white/10 rounded-xl px-3 py-3 hover:border-emerald-500/30 transition-colors">
            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="date"
              value={searchQuery.startDate}
              onChange={(e) => dispatch(updateTourSearch({ startDate: e.target.value }))}
              className="bg-transparent w-full text-sm text-white outline-none [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Travelers (Custom Selector) */}
        <div className="md:col-span-2 relative" ref={travelersRef}>
          <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Travelers</label>
          <button
            type="button"
            onClick={() => setShowTravelersDropdown(!showTravelersDropdown)}
            className="w-full flex items-center justify-between gap-2 bg-slate-950/50 border border-white/10 rounded-xl px-3 py-3 hover:border-emerald-500/30 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-sm text-white">
                {searchQuery.travelers} traveler{searchQuery.travelers > 1 ? 's' : ''}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showTravelersDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#011d2c] border border-white/10 rounded-xl shadow-2xl z-50 py-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    dispatch(updateTourSearch({ travelers: n }));
                    setShowTravelersDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {n} traveler{n > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category (Custom Selector) */}
        <div className="md:col-span-3 relative" ref={categoryRef}>
          <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Category</label>
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full flex items-center justify-between gap-2 bg-slate-950/50 border border-white/10 rounded-xl px-3 py-3 hover:border-emerald-500/30 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-sm text-white truncate max-w-[150px]">
                {searchQuery.category || 'All Categories'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showCategoryDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#011d2c] border border-white/10 rounded-xl shadow-2xl z-50 py-1 max-h-48 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  dispatch(updateTourSearch({ category: '' }));
                  setShowCategoryDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors font-semibold"
              >
                All Categories
              </button>
              {TOUR_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    dispatch(updateTourSearch({ category: cat }));
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Duration (Custom Selector) */}
        <div className="md:col-span-2 relative" ref={daysRef}>
          <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Days</label>
          <button
            type="button"
            onClick={() => setShowDaysDropdown(!showDaysDropdown)}
            className="w-full flex items-center justify-between gap-2 bg-slate-950/50 border border-white/10 rounded-xl px-3 py-3 hover:border-emerald-500/30 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-sm text-white">
                {searchQuery.duration ? `${searchQuery.duration} Days` : 'Any'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showDaysDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#011d2c] border border-white/10 rounded-xl shadow-2xl z-50 py-1">
              {[
                { label: 'Any Duration', value: '' },
                { label: '1-3 Days', value: '1-3' },
                { label: '4-7 Days', value: '4-7' },
                { label: '8-14 Days', value: '8-14' },
                { label: '15+ Days', value: '15+' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    dispatch(updateTourSearch({ duration: opt.value }));
                    setShowDaysDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expandable Advanced Filters Box */}
      {showFilters && (
        <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top duration-300">
          {/* Difficulty Level */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Difficulty</span>
              <button
                type="button"
                onClick={() => dispatch(resetTourFilters())}
                className="text-[9px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset
              </button>
            </div>
            <div className="flex gap-2">
              {difficulties.map((diff) => {
                const isActive = filters.difficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => handleDifficultySelect(diff)}
                    className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-white shadow-inner'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{diff}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sorting configurations */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Sort Order</span>
            <select
              value={filters.sortOrder}
              onChange={(e) => dispatch(updateTourFilters({ sortOrder: e.target.value as any }))}
              className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer focus:border-emerald-500/30 transition-colors [color-scheme:dark]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#011d2c]">{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Action Row */}
      <div className="flex justify-end pt-2 border-t border-white/5">
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 font-sans"
        >
          {isSearching ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              <span>Searching Packages...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Search Packages</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
