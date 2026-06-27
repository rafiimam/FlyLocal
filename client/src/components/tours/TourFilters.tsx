import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateTourFilters, resetTourFilters } from '../../store/tourSlice';
import { TOUR_CATEGORIES } from '../../data/tourData';
import { SlidersHorizontal, RotateCcw, ShieldCheck } from 'lucide-react';

export const TourFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.tour.filters);

  const handleCategorySelect = (category: string) => {
    dispatch(
      updateTourFilters({
        category: filters.category === category ? null : category,
      })
    );
  };

  const handleDifficultySelect = (difficulty: string) => {
    dispatch(
      updateTourFilters({
        difficulty: filters.difficulty === difficulty ? null : difficulty,
      })
    );
  };

  const handleDurationSelect = (duration: string) => {
    dispatch(
      updateTourFilters({
        duration: filters.duration === duration ? null : duration,
      })
    );
  };

  const sortOptions = [
    { value: 'priceAsc', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
    { value: 'durationAsc', label: 'Duration: Short to Long' },
    { value: 'ratingDesc', label: 'Customer Rating' },
  ];

  const difficulties = ['Easy', 'Moderate', 'Challenging'];
  const durations = [
    { label: 'Short (1-3 Days)', value: '1-3' },
    { label: 'Medium (4-7 Days)', value: '4-7' },
    { label: 'Long (8-14 Days)', value: '8-14' },
    { label: 'Expedition (15+ Days)', value: '15+' },
  ];

  return (
    <div className="bg-[#021825]/95 border border-white/10 rounded-3xl p-5 space-y-6 shrink-0 lg:w-64">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Filters</span>
        </div>
        <button
          onClick={() => dispatch(resetTourFilters())}
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
          onChange={(e) => dispatch(updateTourFilters({ sortOrder: e.target.value as any }))}
          className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer focus:border-emerald-500/30 transition-colors [color-scheme:dark]"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Difficulty Level */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Difficulty</label>
        <div className="flex flex-col gap-1.5">
          {difficulties.map((diff) => {
            const isActive = filters.difficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => handleDifficultySelect(diff)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[11px] font-semibold border transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-white shadow-inner'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{diff}</span>
                {isActive && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Range */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Duration</label>
        <div className="flex flex-col gap-1.5">
          {durations.map((dur) => {
            const isActive = filters.duration === dur.value;
            return (
              <button
                key={dur.value}
                onClick={() => handleDurationSelect(dur.value)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[11px] font-semibold border transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-white shadow-inner'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{dur.label}</span>
                {isActive && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Category</label>
        <div className="flex flex-col gap-1">
          {TOUR_CATEGORIES.map((cat) => {
            const isActive = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-white shadow-inner'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
