import React from 'react';
import { MapPin, Clock, Star, Users, ChevronRight, Sunrise } from 'lucide-react';
import type { TourPackage } from '../../data/tourData';

interface TourPackageCardProps {
  tour: TourPackage;
  onSelect: (tour: TourPackage) => void;
}

const categoryColors: Record<string, string> = {
  Beach: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  Adventure: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  Cultural: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  Luxury: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'City Break': 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/25',
  Wildlife: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Heritage: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
};

export const TourPackageCard: React.FC<TourPackageCardProps> = ({ tour, onSelect }) => {
  const adultPrice = tour.pricing.find((p) => p.priceType === 'Adult');
  const catColor = categoryColors[tour.category] || categoryColors['City Break'];

  return (
    <div
      className="glass-card rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all overflow-hidden cursor-pointer group"
      onClick={() => onSelect(tour)}
    >
      {/* Tour Image Placeholder */}
      <div className="relative h-44 bg-gradient-to-br from-emerald-900/30 to-brand-navy-dark overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Sunrise className="w-10 h-10 text-emerald-400/30 mx-auto mb-2" />
            <span className="text-xs text-slate-400 font-semibold">{tour.destination}</span>
          </div>
        </div>

        {/* Category Badge */}
        <div className={`absolute top-3 left-3 ${catColor} border rounded-lg px-2 py-1 backdrop-blur-sm`}>
          <span className="text-[9px] font-bold uppercase">{tour.category}</span>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-950/70 backdrop-blur-sm rounded-lg px-2 py-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-bold text-white">{tour.rating}</span>
          <span className="text-[9px] text-slate-400">({tour.reviewCount})</span>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-slate-950/70 backdrop-blur-sm rounded-lg px-2 py-1">
          <Clock className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] font-bold text-white">{tour.durationDays}D/{tour.durationNights}N</span>
        </div>
      </div>

      {/* Tour Details */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="font-display font-bold text-white text-sm group-hover:text-emerald-400 transition-colors leading-tight">
            {tour.name}
          </h4>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] text-slate-400">{tour.destination}, {tour.country}</span>
          </div>
        </div>

        {/* Highlights Preview */}
        <div className="space-y-1">
          {tour.highlights.slice(0, 3).map((h, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[10px] text-slate-400">
              <span className="text-emerald-400 mt-0.5">•</span>
              <span>{h}</span>
            </div>
          ))}
          {tour.highlights.length > 3 && (
            <span className="text-[10px] text-emerald-400 font-semibold">+{tour.highlights.length - 3} more highlights</span>
          )}
        </div>

        {/* Group Size */}
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Users className="w-3 h-3" />
          <span>Group size: {tour.groupSizeMin}–{tour.groupSizeMax} persons</span>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-end justify-between pt-3 border-t border-white/5">
          <div>
            <span className="text-[10px] text-slate-400 block">B2B Net / person</span>
            <span className="text-lg font-bold text-white font-display">
              ৳{adultPrice?.totalPrice.toLocaleString() || 'N/A'}
            </span>
          </div>
          <button className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-all flex items-center gap-1 cursor-pointer">
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
