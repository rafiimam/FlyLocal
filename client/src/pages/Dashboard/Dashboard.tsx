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
  ShieldCheck,
  Plane,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  BarChart3,
  Calendar,
  Map
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

  // Compute booking stats
  const totalFlightRevenue = flightBookings.reduce((s, b) => s + b.totalClientPaid, 0);
  const totalFlightProfit = flightBookings.reduce((s, b) => s + b.agentProfit, 0);
  const totalHotelRevenue = hotelBookings.reduce((s, b) => s + b.totalClientPaid, 0);
  const totalHotelProfit = hotelBookings.reduce((s, b) => s + b.agentProfit, 0);
  const totalTourRevenue = tourBookings.reduce((s, b) => s + b.totalClientPaid, 0);
  const totalTourProfit = tourBookings.reduce((s, b) => s + b.agentProfit, 0);
  const totalBookingsCount = flightBookings.length + hotelBookings.length + tourBookings.length;

  // Ledger stats
  const totalDeposits = ledger.filter(t => t.type === 'Deposit' && t.status === 'Success').reduce((s, t) => s + t.amount, 0);
  const totalSpent = ledger.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const pendingDeposits = ledger.filter(t => t.type === 'Deposit' && t.status === 'Pending').length;

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
        <div className="space-y-6">
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border-brand-cyan/15 group hover:border-brand-cyan/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 border border-brand-cyan/25 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-brand-cyan" />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Total</span>
              </div>
              <span className="text-2xl font-display font-bold text-white block">{totalBookingsCount}</span>
              <span className="text-[10px] text-slate-400">Bookings across all services</span>
            </div>

            <div className="glass-card rounded-2xl p-5 border-brand-cyan/15 group hover:border-brand-cyan/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 border border-brand-cyan/25 flex items-center justify-center">
                  <Plane className="w-5 h-5 text-brand-cyan transform -rotate-45" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-brand-cyan font-semibold">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{flightBookings.length} tickets</span>
                </div>
              </div>
              <span className="text-2xl font-display font-bold text-white block">৳{totalFlightRevenue.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Profit: ৳{totalFlightProfit.toLocaleString()}</span>
            </div>

            <div className="glass-card rounded-2xl p-5 border-amber-500/15 group hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{hotelBookings.length} stays</span>
                </div>
              </div>
              <span className="text-2xl font-display font-bold text-white block">৳{totalHotelRevenue.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Profit: ৳{totalHotelProfit.toLocaleString()}</span>
            </div>

            <div className="glass-card rounded-2xl p-5 border-emerald-500/15 group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <Map className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{tourBookings.length} tours</span>
                </div>
              </div>
              <span className="text-2xl font-display font-bold text-white block">৳{totalTourRevenue.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Profit: ৳{totalTourProfit.toLocaleString()}</span>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="glass-card rounded-3xl border-white/5 overflow-hidden">
            {/* Table Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-white/5 bg-gradient-to-r from-slate-950/50 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-navy-light flex items-center justify-center border border-white/10">
                  <FileText className="w-5 h-5 text-brand-cyan" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white text-base">Bookings Queue</h3>
                  <p className="text-[10px] text-slate-400">Track and manage issued inventory across all services.</p>
                </div>
              </div>
              <ServiceTabs activeService={activeBookingsTab} onChange={setActiveBookingsTab} variant="compact" />
            </div>

            <div className="p-6">
              {/* Flights Bookings Queue */}
              {activeBookingsTab === 'flights' && (
                flightBookings.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center mx-auto">
                      <Plane className="w-7 h-7 text-brand-cyan transform -rotate-45" />
                    </div>
                    <h4 className="font-display font-semibold text-white text-sm">No flight tickets issued yet</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">Issued flight tickets will show up in this queue. Start by searching for flights.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          <th className="py-3 px-3 bg-slate-950/30 rounded-l-lg">PNR</th>
                          <th className="py-3 px-3 bg-slate-950/30">Flight Segment</th>
                          <th className="py-3 px-3 bg-slate-950/30">Passenger</th>
                          <th className="py-3 px-3 bg-slate-950/30">Markup</th>
                          <th className="py-3 px-3 bg-slate-950/30">Total Paid</th>
                          <th className="py-3 px-3 bg-slate-950/30">Profit</th>
                          <th className="py-3 px-3 bg-slate-950/30">Status</th>
                          <th className="py-3 px-3 bg-slate-950/30 rounded-r-lg text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flightBookings.map((booking, idx) => (
                          <tr key={booking.id} className={`border-b border-white/5 hover:bg-brand-cyan/5 transition-all ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-950/20'}`}>
                            <td className="py-4 px-3">
                              <span className="font-bold font-mono tracking-wider text-brand-cyan bg-brand-cyan/10 px-2 py-1 rounded-lg">{booking.pnr}</span>
                            </td>
                            <td className="py-4 px-3">
                              <span className="font-semibold text-white block">{booking.flight.flightNumber}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {booking.flight.departureAirport} → {booking.flight.arrivalAirport} · <span className="text-brand-cyan">{booking.flight.cabinClass}</span>
                              </span>
                            </td>
                            <td className="py-4 px-3">
                              <span className="font-semibold text-slate-200 block">{booking.passengers[0]?.lastName}/{booking.passengers[0]?.firstName}</span>
                              <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">{booking.passengers[0]?.passportNumber}</span>
                            </td>
                            <td className="py-4 px-3">
                              <span className="font-semibold text-amber-400">৳{booking.markupApplied.toLocaleString()}</span>
                            </td>
                            <td className="py-4 px-3 font-bold text-white">৳{booking.totalClientPaid.toLocaleString()}</td>
                            <td className="py-4 px-3">
                              <span className="font-bold text-emerald-400 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                ৳{booking.agentProfit.toLocaleString()}
                              </span>
                            </td>
                            <td className="py-4 px-3">
                              <StatusBadge status={booking.status === 'Ticketed' ? 'Ticketed' : 'Cancelled'} />
                            </td>
                            <td className="py-4 px-3 text-right">
                              {booking.status === 'Ticketed' && (
                                <button
                                  type="button"
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
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
                      <Building2 className="w-7 h-7 text-amber-400" />
                    </div>
                    <h4 className="font-display font-semibold text-white text-sm">No hotel reservations confirmed yet</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">Confirmed hotel stays will show up in this queue.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          <th className="py-3 px-3 bg-slate-950/30 rounded-l-lg">Confirmation No</th>
                          <th className="py-3 px-3 bg-slate-950/30">Hotel</th>
                          <th className="py-3 px-3 bg-slate-950/30">Room Type</th>
                          <th className="py-3 px-3 bg-slate-950/30">Lead Guest</th>
                          <th className="py-3 px-3 bg-slate-950/30">Stay Details</th>
                          <th className="py-3 px-3 bg-slate-950/30">Total Paid</th>
                          <th className="py-3 px-3 bg-slate-950/30">Markup</th>
                          <th className="py-3 px-3 bg-slate-950/30 rounded-r-lg">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hotelBookings.map((booking, idx) => (
                          <tr key={booking.id} className={`border-b border-white/5 hover:bg-amber-500/5 transition-all ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-950/20'}`}>
                            <td className="py-4 px-3">
                              <span className="font-bold font-mono tracking-wider text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">{booking.confirmationNumber}</span>
                            </td>
                            <td className="py-4 px-3">
                              <span className="font-semibold text-white block">{booking.hotel.name}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{booking.hotel.city}, {booking.hotel.country}</span>
                            </td>
                            <td className="py-4 px-3">
                              <span className="font-medium text-slate-200 block">{booking.roomType.name}</span>
                              <span className="text-[10px] text-amber-400/80 block mt-0.5">{booking.ratePlan.name}</span>
                            </td>
                            <td className="py-4 px-3">
                              <span className="font-semibold text-slate-200 block">{booking.guestName}</span>
                              <span className="text-[10px] text-slate-500 block mt-0.5">{booking.guestPhone}</span>
                            </td>
                            <td className="py-4 px-3">
                              <span className="font-semibold text-white block">{booking.nights} night{booking.nights > 1 ? 's' : ''}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{booking.rooms} room{booking.rooms > 1 ? 's' : ''}</span>
                            </td>
                            <td className="py-4 px-3 font-bold text-white">৳{booking.totalClientPaid.toLocaleString()}</td>
                            <td className="py-4 px-3">
                              <span className="font-bold text-emerald-400 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                ৳{booking.markupApplied.toLocaleString()}
                              </span>
                            </td>
                            <td className="py-4 px-3">
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
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                      <Compass className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h4 className="font-display font-semibold text-white text-sm">No tour package bookings confirmed yet</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">Confirmed tour bookings will show up in this queue.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          <th className="py-3 px-3 bg-slate-950/30 rounded-l-lg">Booking Ref</th>
                          <th className="py-3 px-3 bg-slate-950/30">Tour Package</th>
                          <th className="py-3 px-3 bg-slate-950/30">Lead Traveler</th>
                          <th className="py-3 px-3 bg-slate-950/30">Start Date</th>
                          <th className="py-3 px-3 bg-slate-950/30">Travelers</th>
                          <th className="py-3 px-3 bg-slate-950/30">Total Paid</th>
                          <th className="py-3 px-3 bg-slate-950/30">Profit</th>
                          <th className="py-3 px-3 bg-slate-950/30 rounded-r-lg">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tourBookings.map((booking, idx) => (
                          <tr key={booking.id} className={`border-b border-white/5 hover:bg-emerald-500/5 transition-all ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-950/20'}`}>
                            <td className="py-4 px-3">
                              <span className="font-bold font-mono tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">{booking.confirmationNumber}</span>
                            </td>
                            <td className="py-4 px-3">
                              <span className="font-semibold text-white block">{booking.tourPackage.name}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{booking.tourPackage.destination} · <span className="text-emerald-400">{booking.tourPackage.durationDays} Days</span></span>
                            </td>
                            <td className="py-4 px-3">
                              <span className="font-semibold text-slate-200 block">{booking.leadTravelerName}</span>
                              <span className="text-[10px] text-slate-500 block mt-0.5">{booking.leadTravelerEmail}</span>
                            </td>
                            <td className="py-4 px-3">
                              <span className="font-medium text-white flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-emerald-400" />
                                {new Date(booking.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </td>
                            <td className="py-4 px-3">
                              <span className="font-semibold text-white">{booking.adults}A</span>
                              {booking.children > 0 && <span className="text-slate-400 ml-1">· {booking.children}C</span>}
                            </td>
                            <td className="py-4 px-3 font-bold text-white">৳{booking.totalClientPaid.toLocaleString()}</td>
                            <td className="py-4 px-3">
                              <span className="font-bold text-emerald-400 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                ৳{booking.agentProfit.toLocaleString()}
                              </span>
                            </td>
                            <td className="py-4 px-3">
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
          </div>
        </div>
      )}

      {/* Financial statement ledger */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          {/* Ledger Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-5 border-emerald-500/15">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Total Deposits</span>
              </div>
              <span className="text-2xl font-display font-bold text-emerald-400">৳{totalDeposits.toLocaleString()}</span>
              {pendingDeposits > 0 && (
                <span className="text-[10px] text-amber-400 font-semibold block mt-1">{pendingDeposits} pending approval</span>
              )}
            </div>

            <div className="glass-card rounded-2xl p-5 border-rose-500/15">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center">
                  <ArrowDownRight className="w-5 h-5 text-rose-400" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Total Spent</span>
              </div>
              <span className="text-2xl font-display font-bold text-rose-400">৳{totalSpent.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 block mt-1">{ledger.filter(t => t.amount < 0).length} debit transactions</span>
            </div>

            <div className="glass-card rounded-2xl p-5 border-brand-cyan/15">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 border border-brand-cyan/25 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-brand-cyan" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Current Balance</span>
              </div>
              <span className="text-2xl font-display font-bold text-white">৳{agent.balance.toLocaleString()}</span>
              <span className="text-[10px] text-brand-cyan font-semibold block mt-1">{agent.currency} · Live Wallet</span>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="glass-card rounded-3xl border-white/5 overflow-hidden">
            <div className="flex items-center gap-3 p-6 border-b border-white/5 bg-gradient-to-r from-slate-950/50 to-transparent">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-navy-light flex items-center justify-center border border-white/10">
                <CreditCard className="w-5 h-5 text-brand-cyan" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white text-base">Financial Statement Ledger</h3>
                <p className="text-[10px] text-slate-400">Verify agency deposits, ticket balances, and margins in real time.</p>
              </div>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3 bg-slate-950/30 rounded-l-lg">Transaction ID</th>
                    <th className="py-3 px-3 bg-slate-950/30">Reference</th>
                    <th className="py-3 px-3 bg-slate-950/30">Date / Time</th>
                    <th className="py-3 px-3 bg-slate-950/30">Type</th>
                    <th className="py-3 px-3 bg-slate-950/30">Description</th>
                    <th className="py-3 px-3 bg-slate-950/30">Amount</th>
                    <th className="py-3 px-3 bg-slate-950/30">Wallet Balance</th>
                    <th className="py-3 px-3 bg-slate-950/30 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((txn, idx) => (
                    <tr key={txn.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-all ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-950/20'}`}>
                      <td className="py-4 px-3 font-mono text-[10px] text-slate-500">{txn.id}</td>
                      <td className="py-4 px-3">
                        <span className="font-bold font-mono tracking-wider text-slate-200 bg-slate-800/50 px-2 py-1 rounded-lg text-[10px]">{txn.ref}</span>
                      </td>
                      <td className="py-4 px-3 text-slate-400">
                        <span className="block">{new Date(txn.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                        <span className="text-[10px] text-slate-500 block">{new Date(txn.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold inline-block ${
                          txn.type === 'Deposit'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : txn.type === 'Void Ticket' || txn.type === 'Refund' || txn.type === 'Hotel Cancellation' || txn.type === 'Tour Cancellation'
                            ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                            : txn.type === 'Hotel Booking'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                            : txn.type === 'Tour Booking'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                        }`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-4 px-3 font-medium max-w-xs">
                        <span className="text-slate-300 truncate block">{txn.description}</span>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`font-bold flex items-center gap-1 ${txn.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {txn.amount > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {txn.amount > 0 ? '+' : ''}৳{txn.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-3 font-semibold text-white">৳{txn.balanceAfter.toLocaleString()}</td>
                      <td className="py-4 px-3">
                        <StatusBadge status={txn.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Request Deposit form */}
      {activeTab === 'deposit' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Deposit Info Card */}
          <div className="glass-card rounded-3xl border-brand-cyan/15 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-cyan/10 via-brand-navy-light/5 to-transparent p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-cyan/15 border border-brand-cyan/25 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-brand-cyan" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white text-lg">Request B2B Balance Deposit</h3>
                  <p className="text-xs text-slate-400">Submit bank receipts or mobile payment numbers to request credit topups.</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Current Balance Preview */}
              <div className="flex items-center justify-between bg-slate-950/40 rounded-2xl px-5 py-4 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-cyan/15 border border-brand-cyan/25 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-brand-cyan" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Current Balance</span>
                    <span className="text-lg font-display font-bold text-white">৳{agent.balance.toLocaleString()} <span className="text-xs text-brand-cyan font-medium">{agent.currency}</span></span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Currency</span>
                  <span className="text-sm font-display font-semibold text-slate-300">{agent.currency}</span>
                </div>
              </div>

              {depositSuccessMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl p-4 text-xs flex items-center gap-3 font-medium animate-in slide-in-from-top duration-300">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Deposit request has been successfully transmitted. Admin approval will take 5-15 mins.</span>
                </div>
              )}

              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 flex items-center gap-1.5">
                    <DollarSign className="w-3 h-3 text-brand-cyan" />
                    Deposit Amount (BDT)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-cyan font-bold text-sm">৳</span>
                    <input
                      type="number"
                      required
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="e.g. 250000"
                      className="w-full bg-[#011420] border border-white/10 rounded-xl pl-9 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50 focus:ring-2 focus:ring-brand-cyan/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-brand-cyan" />
                    Select Bank Gateway
                  </label>
                  <select
                    value={depositBank}
                    onChange={(e) => setDepositBank(e.target.value)}
                    className="w-full bg-[#011420] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-cyan/50 focus:ring-2 focus:ring-brand-cyan/10 [color-scheme:dark] transition-all cursor-pointer"
                  >
                    <option value="Standard Chartered Bank" className="bg-slate-900">Standard Chartered Bank (SCB)</option>
                    <option value="City Bank Ltd" className="bg-slate-900">The City Bank Ltd</option>
                    <option value="Mutual Trust Bank" className="bg-slate-900">Mutual Trust Bank (MTB)</option>
                    <option value="bKash (MFS Transfer)" className="bg-slate-900">bKash (Mobile Transfer)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 ml-1 flex items-center gap-1.5">
                    <CreditCard className="w-3 h-3 text-brand-cyan" />
                    Deposit Reference / Bank Slip ID
                  </label>
                  <input
                    type="text"
                    required
                    value={depositRef}
                    onChange={(e) => setDepositRef(e.target.value)}
                    placeholder="e.g. TXN-88492013-SCB"
                    className="w-full bg-[#011420] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50 focus:ring-2 focus:ring-brand-cyan/10 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-cyan-light text-slate-950 font-bold text-sm hover:shadow-xl hover:shadow-brand-cyan/20 transition-all shadow-lg shadow-brand-cyan/15 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Broadcast Deposit Approval Request</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
