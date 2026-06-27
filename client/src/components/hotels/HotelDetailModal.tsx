import React, { useState } from 'react';
import { X, Star, MapPin, Check, Users, BedDouble, Maximize } from 'lucide-react';
import type { Hotel, RoomType, RatePlan } from '../../data/hotelData';

interface HotelDetailModalProps {
  hotel: Hotel;
  nights: number;
  onClose: () => void;
  onSelectRoom: (roomType: RoomType, ratePlan: RatePlan) => void;
}

export const HotelDetailModal: React.FC<HotelDetailModalProps> = ({
  hotel,
  nights,
  onClose,
  onSelectRoom,
}) => {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl mx-4 bg-[#011d2c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 border-b border-white/5">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-cyan/5 rounded-full blur-[80px] pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-brand-navy flex items-center justify-center border border-white/10 shrink-0">
              <span className="text-xl font-display font-bold text-white">{hotel.name.charAt(0)}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {Array.from({ length: hotel.starRating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <h2 className="font-display font-bold text-xl text-white">{hotel.name}</h2>
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                <MapPin className="w-3 h-3" />
                <span>{hotel.address}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mt-4 max-w-2xl">{hotel.description}</p>

          {/* Quick Info */}
          <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-400">
            <span>Check-in: <strong className="text-white">{hotel.checkInTime}</strong></span>
            <span>Check-out: <strong className="text-white">{hotel.checkOutTime}</strong></span>
            <span className="text-amber-400 font-semibold">{nights} night{nights > 1 ? 's' : ''} stay</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mt-4">
            {hotel.amenities.map((amenity) => (
              <span key={amenity} className="flex items-center gap-1 text-[10px] text-slate-300 bg-slate-950/50 rounded-lg px-2 py-1 border border-white/5">
                <Check className="w-2.5 h-2.5 text-emerald-400" />
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Room Types */}
        <div className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-white font-display">Available Room Types</h3>

          {hotel.roomTypes.map((roomType) => (
            <div
              key={roomType.id}
              className={`border rounded-2xl overflow-hidden transition-all ${
                activeRoomId === roomType.id ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5 bg-slate-950/20'
              }`}
            >
              {/* Room Type Header */}
              <button
                onClick={() => setActiveRoomId(activeRoomId === roomType.id ? null : roomType.id)}
                className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-navy-light/20 border border-white/10 flex items-center justify-center">
                    <BedDouble className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{roomType.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Max {roomType.maxOccupancy} guests
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize className="w-3 h-3" />
                        {roomType.roomSizeSqm} sqm
                      </span>
                      <span>
                        {roomType.bedConfigurations.map((bc) => `${bc.count} ${bc.type}`).join(' + ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">from</span>
                  <span className="text-base font-bold text-white font-display">
                    ৳{Math.min(...roomType.ratePlans.map((rp) => rp.totalPerNight)).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400"> /night</span>
                </div>
              </button>

              {/* Rate Plans (expandable) */}
              {activeRoomId === roomType.id && (
                <div className="border-t border-white/5 p-4 space-y-3">
                  <p className="text-[11px] text-slate-400 leading-relaxed">{roomType.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {roomType.amenities.map((a) => (
                      <span key={a} className="text-[9px] text-slate-300 bg-slate-950/60 rounded px-1.5 py-0.5 border border-white/5">
                        {a}
                      </span>
                    ))}
                  </div>

                  {roomType.ratePlans.map((ratePlan) => (
                    <div
                      key={ratePlan.id}
                      className="bg-slate-950/40 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-amber-500/20 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{ratePlan.name}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            ratePlan.cancellationPolicy.isRefundable
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                          }`}>
                            {ratePlan.cancellationPolicy.isRefundable ? 'Refundable' : 'Non-Refundable'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          <span className="font-semibold text-amber-400">{ratePlan.mealPlan}</span>
                          {' · '}{ratePlan.availableRooms} rooms left
                        </div>
                        <div className="text-[10px] text-slate-500">{ratePlan.cancellationPolicy.description}</div>
                        <div className="flex flex-wrap gap-1">
                          {ratePlan.inclusions.map((inc) => (
                            <span key={inc} className="text-[9px] text-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5">
                              ✓ {inc}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-4">
                        <div>
                          <span className="text-[10px] text-slate-400 block">B2B Net / night</span>
                          <span className="text-lg font-bold text-white font-display">৳{ratePlan.totalPerNight.toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mb-2">
                          {nights} nights: ৳{(ratePlan.totalPerNight * nights).toLocaleString()}
                        </div>
                        <button
                          onClick={() => onSelectRoom(roomType, ratePlan)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 transition-all cursor-pointer"
                        >
                          Book This Room
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
