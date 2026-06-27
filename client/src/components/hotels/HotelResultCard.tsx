import React from 'react';
import { Star, MapPin, Wifi, Waves, Coffee, Dumbbell } from 'lucide-react';
import type { Hotel } from '../../data/hotelData';

interface HotelResultCardProps {
  hotel: Hotel;
  onSelect: (hotel: Hotel) => void;
  nights: number;
}

const amenityIcons: Record<string, React.ComponentType<any>> = {
  'Free WiFi': Wifi,
  'Swimming Pool': Waves,
  'Restaurant': Coffee,
  'Fitness Center': Dumbbell,
};

export const HotelResultCard: React.FC<HotelResultCardProps> = ({ hotel, onSelect, nights }) => {
  const lowestRate = Math.min(
    ...hotel.roomTypes.flatMap((rt) => rt.ratePlans.map((rp) => rp.totalPerNight))
  );
  const totalLowest = lowestRate * nights;
  const roomTypeCount = hotel.roomTypes.length;
  const hasRefundable = hotel.roomTypes.some((rt) =>
    rt.ratePlans.some((rp) => rp.cancellationPolicy.isRefundable)
  );

  return (
    <div
      className="glass-card rounded-2xl border border-white/5 hover:border-amber-500/20 transition-all overflow-hidden cursor-pointer group"
      onClick={() => onSelect(hotel)}
    >
      {/* Hotel Image Placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-brand-navy to-brand-navy-dark overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-2">
              <span className="text-xl font-display font-bold text-white">{hotel.name.charAt(0)}</span>
            </div>
            <span className="text-[10px] text-slate-400">{hotel.city}</span>
          </div>
        </div>
        
        {/* Star Rating */}
        <div className="absolute top-3 left-3 flex items-center gap-0.5 bg-slate-950/70 backdrop-blur-sm rounded-lg px-2 py-1">
          {Array.from({ length: hotel.starRating }).map((_, i) => (
            <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
          ))}
        </div>

        {/* Refundable Badge */}
        {hasRefundable && (
          <div className="absolute top-3 right-3 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-lg px-2 py-1">
            <span className="text-[9px] font-bold text-emerald-400 uppercase">Free Cancellation</span>
          </div>
        )}
      </div>

      {/* Hotel Details */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="font-display font-bold text-white text-sm group-hover:text-amber-400 transition-colors leading-tight">
            {hotel.name}
          </h4>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] text-slate-400">{hotel.city}, {hotel.country}</span>
          </div>
        </div>

        {/* Amenity Icons */}
        <div className="flex items-center gap-2 flex-wrap">
          {hotel.amenities.slice(0, 4).map((amenity) => {
            const Icon = amenityIcons[amenity];
            return Icon ? (
              <div key={amenity} className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-950/40 rounded-lg px-2 py-1 border border-white/5">
                <Icon className="w-3 h-3" />
                <span>{amenity}</span>
              </div>
            ) : null;
          })}
          {hotel.amenities.length > 4 && (
            <span className="text-[10px] text-slate-500">+{hotel.amenities.length - 4} more</span>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-end justify-between pt-3 border-t border-white/5">
          <div>
            <span className="text-[10px] text-slate-400 block">B2B Net from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white font-display">৳{lowestRate.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">/night</span>
            </div>
            <span className="text-[10px] text-slate-500">{nights} night{nights > 1 ? 's' : ''}: ৳{totalLowest.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-amber-400 block mb-1">{roomTypeCount} room type{roomTypeCount > 1 ? 's' : ''}</span>
            <button className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400 text-xs font-bold hover:bg-amber-500/25 transition-all cursor-pointer">
              View Rooms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
