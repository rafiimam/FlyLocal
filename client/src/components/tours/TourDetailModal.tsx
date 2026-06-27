import React, { useState } from 'react';
import { X, Star, MapPin, Check, XCircle, Info, Clock, Compass } from 'lucide-react';
import type { TourPackage } from '../../data/tourData';

interface TourDetailModalProps {
  tour: TourPackage;
  onClose: () => void;
  onSelectBooking: (date: string, adultsCount: number, childrenCount: number, singleSupp: boolean) => void;
}

export const TourDetailModal: React.FC<TourDetailModalProps> = ({
  tour,
  onClose,
  onSelectBooking,
}) => {
  const [selectedDate, setSelectedDate] = useState(tour.availableDates[0] || '');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [singleSupplement, setSingleSupplement] = useState(false);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'inclusions' | 'highlights'>('itinerary');

  const adultPrice = tour.pricing.find((p) => p.priceType === 'Adult')?.totalPrice ?? 0;
  const childPrice = tour.pricing.find((p) => p.priceType === 'Child (5-11)')?.totalPrice ?? 0;
  const singleSuppPrice = tour.pricing.find((p) => p.priceType === 'Single Supplement')?.totalPrice ?? 0;

  const totalCalculated =
    adultPrice * adults +
    childPrice * children +
    (singleSupplement ? singleSuppPrice : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl mx-4 bg-[#011d2c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header Hero Section */}
        <div className="relative p-6 border-b border-white/5 bg-gradient-to-br from-emerald-950/20 to-brand-navy-dark">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-brand-navy flex items-center justify-center border border-white/10 shrink-0">
              <Compass className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  {tour.category}
                </span>
                <span className="flex items-center gap-1 bg-slate-950/50 rounded-lg px-2 py-0.5 text-[10px] text-white">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <strong>{tour.rating}</strong> ({tour.reviewCount} reviews)
                </span>
              </div>
              <h2 className="font-display font-bold text-xl text-white">{tour.name}</h2>
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{tour.destination}, {tour.country}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mt-4 max-w-2xl">{tour.description}</p>

          <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-400">
            <span>Duration: <strong className="text-white">{tour.durationDays} Days / {tour.durationNights} Nights</strong></span>
            <span>Difficulty: <strong className="text-white">{tour.difficulty}</strong></span>
            <span>Languages: <strong className="text-white">{tour.languages.join(', ')}</strong></span>
          </div>
        </div>

        {/* Details & Booking Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          {/* Left Column: Itinerary / Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-white/5 gap-4 text-xs font-semibold">
              {[
                { id: 'itinerary', label: 'Day-by-Day Itinerary' },
                { id: 'inclusions', label: 'Inclusions & Exclusions' },
                { id: 'highlights', label: 'Key Highlights' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-2 transition-all border-b-2 cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-emerald-400 text-white'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content: Itinerary */}
            {activeTab === 'itinerary' && (
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {tour.itinerary.map((day) => (
                  <div key={day.id} className="relative pl-6 border-l border-white/10 pb-4">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
                    
                    <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-emerald-400 uppercase tracking-wider">Day {day.dayNumber}</span>
                        <span className="text-slate-400">{day.transportMode}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{day.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{day.description}</p>
                      
                      {day.activities.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-white/5">
                          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Activities</span>
                          {day.activities.map((act) => (
                            <div key={act.id} className="text-[10px] text-slate-300 flex justify-between">
                              <span>• {act.name} ({act.type})</span>
                              <span className="text-slate-500">{act.durationHours > 0 ? `${act.durationHours} hrs` : 'various'}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {(day.meals.length > 0 || day.accommodation) && (
                        <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                          {day.meals.length > 0 && (
                            <div>
                              <span className="font-semibold block text-slate-300">Meals</span>
                              <span>{day.meals.map((m) => m.type).join(', ')}</span>
                            </div>
                          )}
                          {day.accommodation && (
                            <div>
                              <span className="font-semibold block text-slate-300">Stay</span>
                              <span className="truncate block">{day.accommodation}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Content: Inclusions */}
            {activeTab === 'inclusions' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Inclusions */}
                <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 space-y-3">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>Inclusions</span>
                  </h4>
                  <ul className="space-y-2">
                    {tour.inclusions.map((inc) => (
                      <li key={inc} className="flex items-start gap-2 text-slate-300 text-[11px]">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-4 space-y-3">
                  <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    <span>Exclusions</span>
                  </h4>
                  <ul className="space-y-2">
                    {tour.exclusions.map((exc) => (
                      <li key={exc} className="flex items-start gap-2 text-slate-300 text-[11px]">
                        <span className="text-rose-400 mt-0.5">•</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab Content: Highlights */}
            {activeTab === 'highlights' && (
              <div className="bg-slate-950/30 border border-white/5 rounded-2xl p-5 space-y-3 text-xs">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-400" />
                  <span>Key Package Highlights</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {tour.highlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Booking panel config */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-950/40 border border-white/5 rounded-3xl p-5 space-y-5">
              <h3 className="font-display font-bold text-white text-sm">Configure Booking</h3>

              {/* Date Selection */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Available Departures</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer focus:border-emerald-500/30 transition-colors [color-scheme:dark]"
                >
                  {tour.availableDates.map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Travelers Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Adults (Age 12+)</label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500/30 [color-scheme:dark]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Children (5-11)</label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500/30 [color-scheme:dark]"
                  >
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Single Supplement */}
              {singleSuppPrice > 0 && (
                <label className="flex items-center justify-between gap-3 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-3 cursor-pointer select-none">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-white block">Single Supplement</span>
                    <span className="text-[9px] text-slate-400 block">+ ৳{singleSuppPrice.toLocaleString()} BDT</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={singleSupplement}
                    onChange={(e) => setSingleSupplement(e.target.checked)}
                    className="rounded border-white/10 text-emerald-400 w-4 h-4 accent-emerald-500 focus:ring-0 cursor-pointer"
                  />
                </label>
              )}

              {/* Rate Breakdown */}
              <div className="border-t border-white/5 pt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Adults x {adults}</span>
                  <span className="text-white font-semibold">৳{(adultPrice * adults).toLocaleString()}</span>
                </div>
                {children > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Children x {children}</span>
                    <span className="text-white font-semibold">৳{(childPrice * children).toLocaleString()}</span>
                  </div>
                )}
                {singleSupplement && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Single Supplement</span>
                    <span className="text-white font-semibold">৳{singleSuppPrice.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/5 pt-2 font-bold">
                  <span className="text-white">Total B2B Net Cost</span>
                  <span className="text-emerald-400 text-sm">৳{totalCalculated.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectBooking(selectedDate, adults, children, singleSupplement)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer font-sans"
              >
                <span>Proceed to Checkout</span>
                <Clock className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
