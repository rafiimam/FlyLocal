import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateHotelSearch, searchHotels, setHotelSearching, updateHotelFilters, resetHotelFilters } from '../../store/hotelSlice';
import { POPULAR_HOTEL_DESTINATIONS, HOTEL_AMENITIES_LIST } from '../../data/hotelData';
import { Building2, Calendar, Users, Search, MapPin, ChevronDown, ChevronUp, SlidersHorizontal, RotateCcw, Star, ShieldCheck } from 'lucide-react';

export const HotelSearchPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.hotel.searchQuery);
  const isSearching = useAppSelector((state) => state.hotel.isSearching);
  const filters = useAppSelector((state) => state.hotel.filters);

  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [destSearch, setDestSearch] = useState(searchQuery.destination);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const destRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) setShowDestDropdown(false);
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) setShowGuestDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredDests = POPULAR_HOTEL_DESTINATIONS.filter(
    (d) =>
      d.city.toLowerCase().includes(destSearch.toLowerCase()) ||
      d.country.toLowerCase().includes(destSearch.toLowerCase())
  );

  const handleSearch = () => {
    dispatch(setHotelSearching(true));
    setTimeout(() => dispatch(searchHotels()), 800);
  };

  const nights = (() => {
    const ci = new Date(searchQuery.checkIn);
    const co = new Date(searchQuery.checkOut);
    const diff = Math.ceil((co.getTime() - ci.getTime()) / 86400000);
    return diff > 0 ? diff : 1;
  })();

  // Filter actions
  const handleStarClick = (rating: number) => {
    dispatch(updateHotelFilters({ starRating: filters.starRating === rating ? null : rating }));
  };

  const handleAmenityToggle = (amenity: string) => {
    const isSelected = filters.amenities.includes(amenity);
    const newAmenities = isSelected
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    dispatch(updateHotelFilters({ amenities: newAmenities }));
  };

  const handleMealPlanSelect = (mealPlan: string) => {
    dispatch(updateHotelFilters({ mealPlan: filters.mealPlan === mealPlan ? null : mealPlan }));
  };

  const handleRefundableToggle = (val: boolean) => {
    dispatch(updateHotelFilters({ isRefundable: filters.isRefundable === val ? null : val }));
  };

  const sortOptions = [
    { value: 'priceAsc', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
    { value: 'ratingDesc', label: 'Star Rating' },
    { value: 'nameAsc', label: 'Hotel Name (A-Z)' },
  ];

  const mealPlans = ['Room Only', 'Bed & Breakfast', 'Half Board', 'Full Board', 'All Inclusive'];

  return (
    <div className="bg-[#021825]/95 border border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-4">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
            <Building2 className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Search Hotels</h3>
            <span className="text-[10px] text-slate-400">B2B net rates from global suppliers</span>
          </div>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span>{showFilters ? 'Hide Filters' : 'Advanced Filters'}</span>
          {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Search Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Destination */}
        <div className="md:col-span-4 relative" ref={destRef}>
          <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Destination</label>
          <div
            className="flex items-center gap-2 bg-slate-950/50 border border-white/10 rounded-xl px-3 py-3 cursor-text hover:border-amber-500/30 transition-colors"
            onClick={() => setShowDestDropdown(true)}
          >
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="text"
              value={destSearch}
              onChange={(e) => {
                setDestSearch(e.target.value);
                dispatch(updateHotelSearch({ destination: e.target.value }));
                setShowDestDropdown(true);
              }}
              placeholder="City or country..."
              className="bg-transparent w-full text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>
          {showDestDropdown && filteredDests.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#011d2c] border border-white/10 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto">
              {filteredDests.map((d) => (
                <button
                  key={d.code}
                  onClick={() => {
                    setDestSearch(d.city);
                    dispatch(updateHotelSearch({ destination: d.city }));
                    setShowDestDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-semibold block">{d.city}</span>
                    <span className="text-[10px] text-slate-500">{d.country}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Check-in */}
        <div className="md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Check-in</label>
          <div className="flex items-center gap-2 bg-slate-950/50 border border-white/10 rounded-xl px-3 py-3 hover:border-amber-500/30 transition-colors">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="date"
              value={searchQuery.checkIn}
              onChange={(e) => dispatch(updateHotelSearch({ checkIn: e.target.value }))}
              className="bg-transparent w-full text-sm text-white outline-none [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="md:col-span-2">
          <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Check-out</label>
          <div className="flex items-center gap-2 bg-slate-950/50 border border-white/10 rounded-xl px-3 py-3 hover:border-amber-500/30 transition-colors">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="date"
              value={searchQuery.checkOut}
              onChange={(e) => dispatch(updateHotelSearch({ checkOut: e.target.value }))}
              className="bg-transparent w-full text-sm text-white outline-none [color-scheme:dark]"
            />
          </div>
          <span className="text-[10px] text-amber-400 mt-1 block">{nights} night{nights > 1 ? 's' : ''}</span>
        </div>

        {/* Rooms & Guests */}
        <div className="md:col-span-2 relative" ref={guestRef}>
          <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Rooms & Guests</label>
          <button
            type="button"
            onClick={() => setShowGuestDropdown(!showGuestDropdown)}
            className="w-full flex items-center justify-between gap-2 bg-slate-950/50 border border-white/10 rounded-xl px-3 py-3 hover:border-amber-500/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-sm text-white">
                {searchQuery.rooms}R · {searchQuery.adults}A
                {searchQuery.children > 0 ? ` · ${searchQuery.children}C` : ''}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showGuestDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#011d2c] border border-white/10 rounded-xl shadow-2xl z-50 p-4 space-y-3">
              {[
                { label: 'Rooms', key: 'rooms' as const, min: 1, max: 9 },
                { label: 'Adults', key: 'adults' as const, min: 1, max: 9 },
                { label: 'Children', key: 'children' as const, min: 0, max: 6 },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => dispatch(updateHotelSearch({ [item.key]: Math.max(item.min, searchQuery[item.key] - 1) }))}
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-sm font-bold cursor-pointer"
                    >−</button>
                    <span className="text-sm text-white font-semibold w-4 text-center">{searchQuery[item.key]}</span>
                    <button
                      type="button"
                      onClick={() => dispatch(updateHotelSearch({ [item.key]: Math.min(item.max, searchQuery[item.key] + 1) }))}
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-sm font-bold cursor-pointer"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="md:col-span-2 flex items-end">
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 font-sans"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Advanced Filters Box */}
      {showFilters && (
        <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top duration-300">
          
          {/* Col 1: Sorting & Star Rating */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Sort & Stars</span>
              <button
                type="button"
                onClick={() => dispatch(resetHotelFilters())}
                className="text-[9px] font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset
              </button>
            </div>
            
            {/* Sort order custom selector */}
            <select
              value={filters.sortOrder}
              onChange={(e) => dispatch(updateHotelFilters({ sortOrder: e.target.value as any }))}
              className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer focus:border-amber-500/30 transition-colors [color-scheme:dark]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#011d2c]">{opt.label}</option>
              ))}
            </select>

            {/* Stars */}
            <div className="flex gap-1.5">
              {[3, 4, 5].map((rating) => {
                const isActive = filters.starRating === rating;
                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleStarClick(rating)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-500/45 text-white shadow-inner'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{rating}</span>
                    <Star className={`w-3 h-3 ${isActive ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Col 2: Cancellation & Meal Plans */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Refund & Meals</span>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'Free Cancellation', value: true },
                { label: 'Non-Refundable Only', value: false },
              ].map((item) => {
                const isActive = filters.isRefundable === item.value;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleRefundableToggle(item.value)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[10px] font-semibold border transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-500/40 text-white shadow-inner'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Col 3: Meal Plan selection */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Meal Plan Selection</span>
            <div className="grid grid-cols-2 gap-1.5">
              {mealPlans.map((mp) => {
                const isActive = filters.mealPlan === mp;
                return (
                  <button
                    key={mp}
                    type="button"
                    onClick={() => handleMealPlanSelect(mp)}
                    className={`text-[9px] font-semibold rounded-lg py-2 border transition-all truncate cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-500/40 text-white shadow-inner'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                    title={mp}
                  >
                    {mp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Col 4: Popular Amenities checklist */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Popular Amenities</span>
            <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
              {HOTEL_AMENITIES_LIST.map((amenity) => {
                const isChecked = filters.amenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 text-[10px] text-slate-300 font-medium cursor-pointer hover:text-white transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded bg-slate-950 border-white/10 text-amber-400 focus:ring-0 w-3.5 h-3.5 accent-amber-500 cursor-pointer"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
