import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateHotelFilters, resetHotelFilters } from '../../store/hotelSlice';
import { HOTEL_AMENITIES_LIST } from '../../data/hotelData';
import { SlidersHorizontal, RotateCcw, Star, ShieldCheck } from 'lucide-react';

export const HotelFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.hotel.filters);

  const handleStarClick = (rating: number) => {
    dispatch(
      updateHotelFilters({
        starRating: filters.starRating === rating ? null : rating,
      })
    );
  };

  const handleAmenityToggle = (amenity: string) => {
    const isSelected = filters.amenities.includes(amenity);
    const newAmenities = isSelected
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    dispatch(updateHotelFilters({ amenities: newAmenities }));
  };

  const handleMealPlanSelect = (mealPlan: string) => {
    dispatch(
      updateHotelFilters({
        mealPlan: filters.mealPlan === mealPlan ? null : mealPlan,
      })
    );
  };

  const handleRefundableToggle = (val: boolean) => {
    dispatch(
      updateHotelFilters({
        isRefundable: filters.isRefundable === val ? null : val,
      })
    );
  };

  const sortOptions = [
    { value: 'priceAsc', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
    { value: 'ratingDesc', label: 'Star Rating' },
    { value: 'nameAsc', label: 'Hotel Name (A-Z)' },
  ];

  const mealPlans = ['Room Only', 'Bed & Breakfast', 'Half Board', 'Full Board', 'All Inclusive'];

  return (
    <div className="bg-[#021825]/95 border border-white/10 rounded-3xl p-5 space-y-6 shrink-0 lg:w-64">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-cyan" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Filters</span>
        </div>
        <button
          onClick={() => dispatch(resetHotelFilters())}
          className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Sort By</label>
        <select
          value={filters.sortOrder}
          onChange={(e) => dispatch(updateHotelFilters({ sortOrder: e.target.value as any }))}
          className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer focus:border-brand-cyan/30 transition-colors [color-scheme:dark]"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Star Rating */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Star Rating</label>
        <div className="flex items-center gap-1">
          {[3, 4, 5].map((rating) => {
            const isActive = filters.starRating === rating;
            return (
              <button
                key={rating}
                onClick={() => handleStarClick(rating)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-cyan/20 border-brand-cyan/45 text-white shadow-inner shadow-brand-cyan/10'
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

      {/* Cancellation Policy */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Refundable Options</label>
        <div className="flex flex-col gap-1.5">
          {[
            { label: 'Free Cancellation', value: true },
            { label: 'Non-Refundable Only', value: false },
          ].map((item) => {
            const isActive = filters.isRefundable === item.value;
            return (
              <button
                key={item.label}
                onClick={() => handleRefundableToggle(item.value)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[11px] font-semibold border transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-brand-cyan/20 border-brand-cyan/40 text-white shadow-inner'
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

      {/* Meal Plan */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Meal Plan</label>
        <div className="flex flex-col gap-1">
          {mealPlans.map((mp) => {
            const isActive = filters.mealPlan === mp;
            return (
              <button
                key={mp}
                onClick={() => handleMealPlanSelect(mp)}
                className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-cyan/15 border-brand-cyan/40 text-white shadow-inner'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {mp}
              </button>
            );
          })}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Popular Amenities</label>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {HOTEL_AMENITIES_LIST.map((amenity) => {
            const isChecked = filters.amenities.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center gap-2 text-[11px] text-slate-300 font-medium cursor-pointer hover:text-white transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded bg-slate-950 border-white/10 text-brand-cyan focus:ring-0 w-3.5 h-3.5 accent-brand-cyan"
                />
                <span>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
