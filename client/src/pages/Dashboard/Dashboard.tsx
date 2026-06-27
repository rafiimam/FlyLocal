import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  addLedgerTransaction, 
  voidBookingTicket 
} from '../../store/bookingSlice';
import { updateBalance } from '../../store/authSlice';

// Components
import { ServiceTabs } from '../../components/shared/ServiceTabs';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { FlightSearchPanel } from '../../components/flights/FlightSearchPanel';
import { FlightResultsList } from '../../components/flights/FlightResultsList';
import { FlightFilters } from '../../components/flights/FlightFilters';
import { FlightCheckout } from '../../components/flights/FlightCheckout';
import { HotelDashboard } from './HotelDashboard';
import { TourDashboard } from './TourDashboard';
import { MarkupSlider } from '../../components/MarkupSlider';

import type { LedgerTransaction } from '../../data/mockData';
import type { ServiceType } from '../../data/mockData';
import { 
  DollarSign, 
  FileText, 
  Send, 
  Building2,
  Compass,
  ShieldCheck
} from 'lucide-react';

interface DashboardProps {
  activeTab: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ activeTab }) => {
  const dispatch = useAppDispatch();
  
  // Select Redux States
  const agent = useAppSelector((state) => state.auth.agent);
  const ledger = useAppSelector((state) => state.booking.ledger);
  
  // Flight bookings (Central list for flights, hotel/tour have their own slice states)
  const flightBookings = useAppSelector((state) => state.booking.bookings);
  const hotelBookings = useAppSelector((state) => state.hotel.hotelBookings);
  const tourBookings = useAppSelector((state) => state.tour.tourBookings);

  const selectedFlight = useAppSelector((state) => state.booking.selectedFlight);
  const filteredFlights = useAppSelector((state) => state.booking.filteredFlights);
  const searchTriggered = useAppSelector((state) => state.booking.searchTriggered);
  const commissionRate = useAppSelector((state) => state.booking.commissionRate);

  // Local Page UI states
  const [activeService, setActiveService] = useState<ServiceType>('flights');
  const [activeBookingsTab, setActiveBookingsTab] = useState<ServiceType>('flights');

  // Deposit Request State
  const [depositAmount, setDepositAmount] = useState('');
  const [depositBank, setDepositBank] = useState('Standard Chartered Bank');
  const [depositRef, setDepositRef] = useState('');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState(false);

  if (!agent) return null;

  // Submit Bank Deposit Request
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) return;

    const newTxn: LedgerTransaction = {
      id: `TXN-${Date.now()}`,
      ref: `DEP-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      type: 'Deposit',
      description: `Deposit Request via ${depositBank} (Ref: ${depositRef})`,
      amount,
      balanceAfter: agent.balance,
      status: 'Pending',
    };

    dispatch(addLedgerTransaction(newTxn));
    setDepositAmount('');
    setDepositRef('');
    setDepositSuccessMsg(true);
    setTimeout(() => setDepositSuccessMsg(false), 5000);
  };

  // Void ticket action (Flights)
  const handleVoidFlightTicket = (bookingId: string) => {
    const booking = flightBookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const baseFareTotal = booking.flight.basePrice;
    const taxTotal = booking.flight.tax;
    const baseCommission = baseFareTotal * commissionRate;
    const agentNetCost = (baseFareTotal + taxTotal) - baseCommission;
    const voidPenalty = 3500;
    const refundAmount = agentNetCost - voidPenalty;

    dispatch(updateBalance(refundAmount));

    const newTxn: LedgerTransaction = {
      id: `TXN-${Date.now()}`,
      ref: `VOID-${booking.pnr}`,
      date: new Date().toISOString(),
      type: 'Void Ticket',
      description: `Void Ticket PNR ${booking.pnr} (Refunded with penalty BDT ${voidPenalty.toLocaleString()})`,
      amount: refundAmount,
      balanceAfter: agent.balance + refundAmount,
      status: 'Success',
      serviceType: 'flights',
    };

    dispatch(voidBookingTicket({ bookingId, refundAmount, newTxn }));
  };

  return (
    <div className="space-y-6">
      {/* Search & Book Dashboard Area */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Service Selector Tabs */}
          <div className="flex items-center justify-between gap-4">
            <ServiceTabs activeService={activeService} onChange={setActiveService} />
            <div className="text-[10px] text-slate-400 font-semibold hidden md:flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
              <span>Direct GDS Feed Activated</span>
            </div>
          </div>

          {activeService === 'flights' && (
            <div className="space-y-6">
              <FlightSearchPanel />

              {searchTriggered && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
                  {/* Filters & Markup Sidebar */}
                  <div className="lg:col-span-4 space-y-6">
                    {selectedFlight ? (
                      <MarkupSlider
                        basePrice={selectedFlight.basePrice}
                        tax={selectedFlight.tax}
                      />
                    ) : filteredFlights.length > 0 ? (
                      <MarkupSlider
                        basePrice={filteredFlights[0].basePrice}
                        tax={filteredFlights[0].tax}
                      />
                    ) : (
                      <div className="glass-card rounded-2xl p-4 text-xs text-slate-400 text-center italic border-white/5">
                        Search flight results to configure live markups
                      </div>
                    )}
                    <FlightFilters />
                  </div>

                  {/* Results List */}
                  <div className="lg:col-span-8">
                    <FlightResultsList />
                  </div>
                </div>
              )}

              {selectedFlight && <FlightCheckout />}
            </div>
          )}

          {activeService === 'hotels' && <HotelDashboard />}

          {activeService === 'tours' && <TourDashboard />}
        </div>
      )}

      {/* Bookings Queue */}
      {activeTab === 'bookings' && (
        <div className="glass-card rounded-3xl p-6 border-white/5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="font-display font-semibold text-white text-base">Bookings Queue</h3>
              <p className="text-xs text-slate-400">Track and manage issued inventory across all services.</p>
            </div>
            <ServiceTabs activeService={activeBookingsTab} onChange={setActiveBookingsTab} variant="compact" />
          </div>

          {/* Flights Bookings Queue */}
          {activeBookingsTab === 'flights' && (
            flightBookings.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <FileText className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="font-display font-semibold text-white text-sm">No flight tickets issued yet</h4>
                <p className="text-xs text-slate-400">Issued flight tickets will show up in this queue.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">PNR</th>
                      <th className="py-3 px-2">Flight Segment</th>
                      <th className="py-3 px-2">Passenger</th>
                      <th className="py-3 px-2">Markup</th>
                      <th className="py-3 px-2">Total Paid</th>
                      <th className="py-3 px-2">Profit</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flightBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-white/5 hover:bg-white/1 transition-all">
                        <td className="py-4 px-2 font-bold font-mono tracking-wider text-white">{booking.pnr}</td>
                        <td className="py-4 px-2">
                          <span className="font-semibold text-white block">{booking.flight.flightNumber}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {booking.flight.departureAirport} → {booking.flight.arrivalAirport} ({booking.flight.cabinClass})
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-semibold block">{booking.passengers[0]?.lastName}/{booking.passengers[0]?.firstName}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{booking.passengers[0]?.passportNumber}</span>
                        </td>
                        <td className="py-4 px-2 font-medium">৳{booking.markupApplied.toLocaleString()}</td>
                        <td className="py-4 px-2 font-bold text-white">৳{booking.totalClientPaid.toLocaleString()}</td>
                        <td className="py-4 px-2 font-semibold text-emerald-400">৳{booking.agentProfit.toLocaleString()}</td>
                        <td className="py-4 px-2">
                          <StatusBadge status={booking.status === 'Ticketed' ? 'Ticketed' : 'Cancelled'} />
                        </td>
                        <td className="py-4 px-2 text-right">
                          {booking.status === 'Ticketed' && (
                            <button
                              onClick={() => handleVoidFlightTicket(booking.id)}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Void Ticket
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* Hotels Bookings Queue */}
          {activeBookingsTab === 'hotels' && (
            hotelBookings.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <Building2 className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="font-display font-semibold text-white text-sm">No hotel reservations confirmed yet</h4>
                <p className="text-xs text-slate-400">Confirmed hotel stays will show up in this queue.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Confirmation No</th>
                      <th className="py-3 px-2">Hotel</th>
                      <th className="py-3 px-2">Room Type</th>
                      <th className="py-3 px-2">Lead Guest</th>
                      <th className="py-3 px-2">Stay Details</th>
                      <th className="py-3 px-2">Total Paid</th>
                      <th className="py-3 px-2">Markup</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotelBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-white/5 hover:bg-white/1 transition-all">
                        <td className="py-4 px-2 font-bold font-mono tracking-wider text-white">{booking.confirmationNumber}</td>
                        <td className="py-4 px-2">
                          <span className="font-semibold text-white block">{booking.hotel.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{booking.hotel.city}, {booking.hotel.country}</span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-medium text-slate-300 block">{booking.roomType.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{booking.ratePlan.name}</span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-semibold block">{booking.guestName}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{booking.guestPhone}</span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-medium block">{booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{booking.rooms} room{booking.rooms > 1 ? 's' : ''}</span>
                        </td>
                        <td className="py-4 px-2 font-bold text-white">৳{booking.totalClientPaid.toLocaleString()}</td>
                        <td className="py-4 px-2 font-semibold text-brand-cyan">৳{booking.markupApplied.toLocaleString()}</td>
                        <td className="py-4 px-2">
                          <StatusBadge status={booking.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* Tours Bookings Queue */}
          {activeBookingsTab === 'tours' && (
            tourBookings.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <Compass className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="font-display font-semibold text-white text-sm">No tour package bookings confirmed yet</h4>
                <p className="text-xs text-slate-400">Confirmed tour bookings will show up in this queue.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Booking Ref</th>
                      <th className="py-3 px-2">Tour Package</th>
                      <th className="py-3 px-2">Lead Traveler</th>
                      <th className="py-3 px-2">Start Date</th>
                      <th className="py-3 px-2">Travelers</th>
                      <th className="py-3 px-2">Total Paid</th>
                      <th className="py-3 px-2">Profit</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tourBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-white/5 hover:bg-white/1 transition-all">
                        <td className="py-4 px-2 font-bold font-mono tracking-wider text-white">{booking.confirmationNumber}</td>
                        <td className="py-4 px-2">
                          <span className="font-semibold text-white block">{booking.tourPackage.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{booking.tourPackage.destination} ({booking.tourPackage.durationDays} Days)</span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-semibold block">{booking.leadTravelerName}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{booking.leadTravelerEmail}</span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-medium text-slate-300 block">
                            {new Date(booking.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </span>
                        </td>
                        <td className="py-4 px-2 font-semibold">
                          {booking.adults}A {booking.children > 0 ? `· ${booking.children}C` : ''}
                        </td>
                        <td className="py-4 px-2 font-bold text-white">৳{booking.totalClientPaid.toLocaleString()}</td>
                        <td className="py-4 px-2 font-semibold text-emerald-400">৳{booking.agentProfit.toLocaleString()}</td>
                        <td className="py-4 px-2">
                          <StatusBadge status={booking.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      )}

      {/* Financial statement ledger */}
      {activeTab === 'ledger' && (
        <div className="glass-card rounded-3xl p-6 border-white/5 space-y-6">
          <div>
            <h3 className="font-display font-semibold text-white text-base">Financial Statement Ledger</h3>
            <p className="text-xs text-slate-400">Verify agency deposits, ticket balances, and margins in real time.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-slate-300">
              <thead>
                <tr className="border-b border-white/10 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-2">Transaction ID</th>
                  <th className="py-3 px-2">Reference</th>
                  <th className="py-3 px-2">Date / Time</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Description</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Wallet Balance</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((txn) => (
                  <tr key={txn.id} className="border-b border-white/5 hover:bg-white/1 transition-all">
                    <td className="py-4 px-2 font-mono text-slate-400">{txn.id}</td>
                    <td className="py-4 px-2 font-bold font-mono tracking-wider text-slate-200">{txn.ref}</td>
                    <td className="py-4 px-2 text-slate-400">{new Date(txn.date).toLocaleString()}</td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        txn.type === 'Deposit'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : txn.type === 'Void Ticket' || txn.type === 'Refund' || txn.type === 'Hotel Cancellation' || txn.type === 'Tour Cancellation'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="py-4 px-2 font-medium max-w-xs truncate">{txn.description}</td>
                    <td className={`py-4 px-2 font-bold ${txn.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {txn.amount > 0 ? '+' : ''}৳{txn.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-2 font-semibold text-slate-200">৳{txn.balanceAfter.toLocaleString()}</td>
                    <td className="py-4 px-2">
                      <StatusBadge status={txn.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Deposit form */}
      {activeTab === 'deposit' && (
        <div className="max-w-xl mx-auto glass-card rounded-3xl p-6 border-white/5 space-y-6">
          <div>
            <h3 className="font-display font-semibold text-white text-base">Request B2B Balance Deposit</h3>
            <p className="text-xs text-slate-400">
              Submit bank receipts or mobile payment numbers to request credit topups.
            </p>
          </div>

          {depositSuccessMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl p-3.5 text-xs flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Deposit request has been successfully transmitted. Admin approval will take 5-15 mins.</span>
            </div>
          )}

          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Deposit Amount (BDT)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-cyan" />
                <input
                  type="number"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 250000"
                  className="w-full bg-[#011420] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Select Bank Gateway</label>
              <select
                value={depositBank}
                onChange={(e) => setDepositBank(e.target.value)}
                className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-brand-cyan [color-scheme:dark]"
              >
                <option value="Standard Chartered Bank" className="bg-slate-900">Standard Chartered Bank (SCB)</option>
                <option value="City Bank Ltd" className="bg-slate-900">The City Bank Ltd</option>
                <option value="Mutual Trust Bank" className="bg-slate-900">Mutual Trust Bank (MTB)</option>
                <option value="bKash (MFS Transfer)" className="bg-slate-900">bKash (Mobile Transfer)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Deposit Reference / Bank Slip ID</label>
              <input
                type="text"
                required
                value={depositRef}
                onChange={(e) => setDepositRef(e.target.value)}
                placeholder="e.g. TXN-88492013-SCB"
                className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyan-light transition-all shadow-lg shadow-brand-cyan/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Deposit Approval Request</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
