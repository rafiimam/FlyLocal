import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addHotelBooking } from '../../store/hotelSlice';
import { addLedgerTransaction } from '../../store/bookingSlice';
import { updateBalance } from '../../store/authSlice';
import { PriceBreakdown } from '../shared/PriceBreakdown';
import type { Hotel, RoomType, RatePlan, HotelBooking } from '../../data/hotelData';
import type { LedgerTransaction } from '../../data/mockData';
import { ShieldCheck, AlertTriangle, ArrowLeft, Building2 } from 'lucide-react';

interface HotelCheckoutProps {
  hotel: Hotel;
  roomType: RoomType;
  ratePlan: RatePlan;
  nights: number;
  rooms: number;
  onBack: () => void;
  onSuccess: (confirmationNumber: string) => void;
}

export const HotelCheckout: React.FC<HotelCheckoutProps> = ({
  hotel,
  roomType,
  ratePlan,
  nights,
  rooms,
  onBack,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const agent = useAppSelector((state) => state.auth.agent);
  const markupType = useAppSelector((state) => state.hotel.markupType);
  const markupValue = useAppSelector((state) => state.hotel.markupValue);

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!agent) return null;

  const basePriceTotal = ratePlan.basePricePerNight * nights * rooms;
  const taxTotal = ratePlan.taxPerNight * nights * rooms;
  const netCost = basePriceTotal + taxTotal;

  const customMarkup = markupType === 'fixed'
    ? markupValue
    : basePriceTotal * (markupValue / 100);

  const totalClientPaid = netCost + customMarkup;
  const agentProfit = customMarkup;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestName || !guestEmail || !guestPhone) {
      setError('Please fill in all guest details.');
      return;
    }

    if (agent.balance < netCost) {
      setError('Insufficient wallet balance to purchase this hotel reservation.');
      return;
    }

    const confNum = 'HTL-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const newBooking: HotelBooking = {
      id: `BK-H-${Date.now()}`,
      confirmationNumber: confNum,
      hotel,
      roomType,
      ratePlan,
      checkIn: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], // placeholder check-in matching searchQuery
      checkOut: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      nights,
      rooms,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      totalBasePrice: basePriceTotal,
      totalTax: taxTotal,
      markupApplied: customMarkup,
      totalClientPaid,
      agentProfit,
      bookingDate: new Date().toISOString(),
      status: 'Confirmed' as const,
    };

    // Deduct agent balance
    dispatch(updateBalance(-netCost));

    // Ledger record
    const newTxn: LedgerTransaction = {
      id: `TXN-H-${Date.now()}`,
      ref: confNum,
      date: new Date().toISOString(),
      type: 'Hotel Booking',
      description: `Hotel Booked: ${hotel.name} - ${roomType.name} (Conf: ${confNum}, Guest: ${guestName})`,
      amount: -netCost,
      balanceAfter: agent.balance - netCost,
      status: 'Success',
      serviceType: 'hotels',
    };

    dispatch(addHotelBooking(newBooking));
    dispatch(addLedgerTransaction(newTxn));
    onSuccess(confNum);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Room Selection</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Guest Details Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-[#021825]/95 border border-white/10 rounded-3xl p-6 space-y-6 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-brand-cyan/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 border border-brand-cyan/25 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-brand-cyan" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Lead Guest Details</h3>
              <span className="text-[10px] text-slate-400">Enter details as shown in passport/NID</span>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Full Name</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Anisur Rahman"
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-cyan/30 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="guest@email.com"
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-cyan/30 transition-colors"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Phone Number</label>
              <input
                type="text"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+880 1712-345678"
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-cyan/30 transition-colors"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Special Requests (Optional)</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Late check-in, high floor, twin beds, etc..."
                rows={3}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-cyan/30 transition-colors resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secure SSL booking direct with GDS supplier</span>
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-cyan-light text-slate-950 font-bold text-xs shadow-lg shadow-brand-cyan/15 hover:shadow-brand-cyan/25 transition-all cursor-pointer"
            >
              Confirm Booking
            </button>
          </div>
        </form>

        {/* Pricing Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#021825]/95 border border-white/10 rounded-3xl p-5 space-y-4">
            <h4 className="font-display font-bold text-white text-sm">Reservation Details</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Hotel</span>
                <span className="text-white font-semibold text-right">{hotel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Room</span>
                <span className="text-white font-semibold text-right">{roomType.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rate Plan</span>
                <span className="text-white font-semibold text-right text-brand-cyan-light">{ratePlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration</span>
                <span className="text-white font-semibold">{nights} night{nights > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rooms Booked</span>
                <span className="text-white font-semibold">{rooms} Room{rooms > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          <PriceBreakdown
            basePrice={basePriceTotal}
            tax={taxTotal}
            markupAmount={customMarkup}
            label="GDS Net Fare Breakdown"
          />
        </div>
      </div>
    </div>
  );
};
