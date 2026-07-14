import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSelectedFlight, addBooking, addLedgerTransaction } from '../../store/bookingSlice';
import { updateBalance } from '../../store/authSlice';
import { Ticket, X, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { LedgerTransaction } from '../../data/mockData';

export const FlightCheckout: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const agent = useAppSelector((state) => state.auth.agent);
  const selectedFlight = useAppSelector((state) => state.booking.selectedFlight);
  const searchQuery = useAppSelector((state) => state.booking.searchQuery);
  const markupType = useAppSelector((state) => state.booking.markupType);
  const markupValue = useAppSelector((state) => state.booking.markupValue);
  const commissionRate = useAppSelector((state) => state.booking.commissionRate);

  const [passengerDetails, setPassengerDetails] = useState({
    title: 'Mr',
    firstName: '',
    lastName: '',
    gender: 'Male',
    dob: '',
    passportNumber: '',
    passportExpiry: '',
    nationality: 'Bangladeshi',
  });
  
  const [checkoutSuccessPnr, setCheckoutSuccessPnr] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!selectedFlight || !agent) return null;

  const baseFareTotal = selectedFlight.basePrice;
  const taxTotal = selectedFlight.tax;
  const baseCommission = baseFareTotal * commissionRate;
  const agentNetCost = (baseFareTotal + taxTotal) - baseCommission;

  const customMarkup = markupType === 'fixed'
    ? markupValue
    : baseFareTotal * (markupValue / 100);

  const totalClientPaid = agentNetCost + customMarkup;
  const agentProfit = baseCommission + customMarkup;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!passengerDetails.firstName || !passengerDetails.lastName) {
      setCheckoutError('Please fill in first and last names.');
      return;
    }

    if (agent.balance < agentNetCost) {
      setCheckoutError('Insufficient wallet balance to purchase this flight ticket. Add deposits.');
      return;
    }

    const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newBooking = {
      id: `BK-${Date.now()}`,
      pnr,
      flight: selectedFlight,
      query: searchQuery,
      passengers: [passengerDetails],
      markupApplied: customMarkup,
      totalClientPaid,
      agentProfit,
      bookingDate: new Date().toISOString(),
      status: 'Ticketed' as const,
    };

    // Deduct agent net cost
    dispatch(updateBalance(-agentNetCost));

    // Add ledger statement
    const newTxn: LedgerTransaction = {
      id: `TXN-${Date.now()}`,
      ref: `PNR-${pnr}`,
      date: new Date().toISOString(),
      type: 'Issue Ticket',
      description: `Ticket Issued PNR ${pnr} (${selectedFlight.departureAirport}-${selectedFlight.arrivalAirport}, Pax: ${passengerDetails.lastName}/${passengerDetails.firstName})`,
      amount: -agentNetCost,
      balanceAfter: agent.balance - agentNetCost,
      status: 'Success',
      serviceType: 'flights',
    };

    dispatch(addBooking(newBooking));
    dispatch(addLedgerTransaction(newTxn));
    setCheckoutSuccessPnr(pnr);
    setCheckoutError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={() => dispatch(setSelectedFlight(null))} />
      
      <div className="relative w-full max-w-2xl bg-[#011d2c] border border-white/10 rounded-3xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto z-10 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center p-6 sm:p-8 pb-4 bg-gradient-to-r from-brand-cyan/10 via-transparent to-transparent border-b border-white/5 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-cyan/15 border border-brand-cyan/25 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-brand-cyan" />
            </div>
            <h3 className="font-display font-semibold text-lg text-white">Passenger Details & Issuance</h3>
          </div>
          <button 
            onClick={() => dispatch(setSelectedFlight(null))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-6">

        {checkoutSuccessPnr ? (
          /* Success ticket view */
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-display font-bold text-white text-xl">Ticket Issued Successfully!</h4>
              <p className="text-xs text-slate-400 text-center">
                PNR ticket record locator has been successfully written to GDS channels.
              </p>
            </div>
            
            <div className="bg-[#011420] border border-white/10 rounded-2xl p-5 max-w-sm mx-auto space-y-3 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">PNR Record Locator:</span>
                <span className="font-bold text-white font-mono tracking-wider">{checkoutSuccessPnr}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Passenger Name:</span>
                <span className="font-semibold text-white">{passengerDetails.lastName}/{passengerDetails.firstName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Sector routing:</span>
                <span className="font-semibold text-white">{selectedFlight.departureAirport} → {selectedFlight.arrivalAirport}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Flight number:</span>
                <span className="font-semibold text-white">{selectedFlight.flightNumber}</span>
              </div>
            </div>

            <button
              onClick={() => {
                dispatch(setSelectedFlight(null));
                setCheckoutSuccessPnr(null);
              }}
              className="px-6 py-2.5 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyan-light transition-all cursor-pointer"
            >
              Return to Flight Search
            </button>
          </div>
        ) : (
          /* Form input fields */
          <form onSubmit={handleCheckoutSubmit} className="space-y-5">
            
            {/* Display errors */}
            {checkoutError && (
              <div className="bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-xl p-3.5 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Title</label>
                <select
                  value={passengerDetails.title}
                  onChange={(e) => setPassengerDetails({ ...passengerDetails, title: e.target.value })}
                  className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan/50 focus:ring-2 focus:ring-brand-cyan/10 [color-scheme:dark] transition-all"
                >
                  <option value="Mr">Mr.</option>
                  <option value="Mrs">Mrs.</option>
                  <option value="Ms">Ms.</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Given Name</label>
                <input
                  type="text"
                  required
                  placeholder="First name..."
                  value={passengerDetails.firstName}
                  onChange={(e) => setPassengerDetails({ ...passengerDetails, firstName: e.target.value })}
                  className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan/50 focus:ring-2 focus:ring-brand-cyan/10 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Surname</label>
                <input
                  type="text"
                  required
                  placeholder="Last name..."
                  value={passengerDetails.lastName}
                  onChange={(e) => setPassengerDetails({ ...passengerDetails, lastName: e.target.value })}
                  className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Gender</label>
                <select
                  value={passengerDetails.gender}
                  onChange={(e) => setPassengerDetails({ ...passengerDetails, gender: e.target.value })}
                  className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan [color-scheme:dark]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={passengerDetails.dob}
                  onChange={(e) => setPassengerDetails({ ...passengerDetails, dob: e.target.value })}
                  className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nationality</label>
                <input
                  type="text"
                  required
                  value={passengerDetails.nationality}
                  onChange={(e) => setPassengerDetails({ ...passengerDetails, nationality: e.target.value })}
                  className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Passport / NID Number</label>
                <input
                  type="text"
                  required
                  placeholder="Number..."
                  value={passengerDetails.passportNumber}
                  onChange={(e) => setPassengerDetails({ ...passengerDetails, passportNumber: e.target.value })}
                  className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Passport Expiry</label>
                <input
                  type="date"
                  required
                  value={passengerDetails.passportExpiry}
                  onChange={(e) => setPassengerDetails({ ...passengerDetails, passportExpiry: e.target.value })}
                  className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/5 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">GDS Base Cost Structure</span>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Flight Base Fare</span>
                  <span className="font-semibold text-white">৳{baseFareTotal.toLocaleString()} BDT</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Taxes & Fees</span>
                  <span className="font-semibold text-white">৳{taxTotal.toLocaleString()} BDT</span>
                </div>
                <div className="col-span-2 border-t border-white/5 pt-2 flex justify-between">
                  <span className="text-slate-300 font-semibold">B2B Net Cost (deducted from wallet)</span>
                  <span className="font-bold text-brand-cyan-light">৳{agentNetCost.toLocaleString()} BDT</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/5">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block">Invoice Total (Net + Markup)</span>
                <span className="text-base font-bold text-white font-display">৳{totalClientPaid.toLocaleString()}</span>
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-cyan-light text-slate-950 font-bold text-xs shadow-lg shadow-brand-cyan/20 hover:shadow-brand-cyan/35 transition-all cursor-pointer btn-shimmer"
              >
                Issue GDS Seat
              </button>
            </div>

          </form>
        )}
        </div>
      </div>
    </div>
  );
};
