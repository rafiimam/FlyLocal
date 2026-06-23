import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  updateSearchQuery, 
  setFlights, 
  setSelectedFlight, 
  updateFilters, 
  resetFilters, 
  setIsSearching, 
  setSearchTriggered, 
  addBooking, 
  addLedgerTransaction, 
  voidBookingTicket 
} from '../../store/bookingSlice';
import { updateBalance } from '../../store/authSlice';
import { AirportSelector } from '../../components/AirportSelector';
import { TravellerSelector } from '../../components/TravellerSelector';
import { MarkupSlider } from '../../components/MarkupSlider';
import type { LedgerTransaction } from '../../data/mockData';
import { FLIGHTS } from '../../data/mockData';
import { 
  Search, 
  ArrowUpDown, 
  ArrowLeftRight,
  Calendar, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  Info,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle,
  Send,
  Ticket,
  Plane
} from 'lucide-react';

interface DashboardProps {
  activeTab: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ activeTab }) => {
  const dispatch = useAppDispatch();
  
  // Select Redux States
  const agent = useAppSelector((state) => state.auth.agent);
  const searchQuery = useAppSelector((state) => state.booking.searchQuery);
  const filteredFlights = useAppSelector((state) => state.booking.filteredFlights);
  const selectedFlight = useAppSelector((state) => state.booking.selectedFlight);
  const ledger = useAppSelector((state) => state.booking.ledger);
  const bookings = useAppSelector((state) => state.booking.bookings);
  const filters = useAppSelector((state) => state.booking.filters);
  const markupType = useAppSelector((state) => state.booking.markupType);
  const markupValue = useAppSelector((state) => state.booking.markupValue);
  const commissionRate = useAppSelector((state) => state.booking.commissionRate);
  const isSearching = useAppSelector((state) => state.booking.isSearching);
  const searchTriggered = useAppSelector((state) => state.booking.searchTriggered);

  // Local Page UI states
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);
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

  // Deposit Request State
  const [depositAmount, setDepositAmount] = useState('');
  const [depositBank, setDepositBank] = useState('Standard Chartered Bank');
  const [depositRef, setDepositRef] = useState('');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState(false);

  if (!agent) return null;

  const formatDateDay = (dateStr: string) => {
    if (!dateStr) return '--';
    const parts = dateStr.split('-');
    if (parts.length < 3) return '--';
    return parts[2];
  };

  const formatDateMonthYear = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Select Date';
    return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDateWeekday = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('en-US', { weekday: 'long' });
  };

  // Swap From & To airports
  const handleSwapAirports = () => {
    const fromVal = searchQuery.from;
    const toVal = searchQuery.to;
    dispatch(updateSearchQuery({
      from: toVal,
      to: fromVal
    }));
  };

  // Run Flight Search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setIsSearching(true));
    dispatch(setSearchTriggered(true));
    dispatch(setSelectedFlight(null));
    setExpandedFlightId(null);

    setTimeout(() => {
      const matches = FLIGHTS.filter((flight) => {
        const fromMatch = flight.departureAirport === searchQuery.from;
        const toMatch = flight.arrivalAirport === searchQuery.to;
        const cabinMatch = flight.cabinClass === searchQuery.cabinClass;
        return fromMatch && toMatch && cabinMatch;
      });
      dispatch(setFlights(matches));
      dispatch(setIsSearching(false));
    }, 1200);
  };

  // Submit Booking Checkout
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlight) return;

    const baseFareTotal = selectedFlight.basePrice;
    const taxTotal = selectedFlight.tax;
    const baseCommission = baseFareTotal * commissionRate;
    const agentNetCost = (baseFareTotal + taxTotal) - baseCommission;

    const customMarkup = markupType === 'fixed'
      ? markupValue
      : baseFareTotal * (markupValue / 100);

    const totalClientPaid = agentNetCost + customMarkup;
    const agentProfit = baseCommission + customMarkup;

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
    };

    dispatch(addBooking(newBooking));
    dispatch(addLedgerTransaction(newTxn));
    setCheckoutSuccessPnr(pnr);
    setCheckoutError(null);
  };

  // Void ticket refund action
  const handleVoidTicket = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
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
    };

    dispatch(voidBookingTicket({ bookingId, refundAmount, newTxn }));
  };

  // Submit Bank Deposit
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

  return (
    <div className="space-y-6">
      {/* Flight search panel tab view */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Redesigned Premium Cockpit Radar Search Console */}
          <div className="bg-[#021825]/90 border border-white/10 rounded-3xl p-6 shadow-2xl relative bg-gradient-to-r from-brand-navy-dark to-[#011420]/90">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
            
            <form onSubmit={handleSearchSubmit} className="space-y-6">
              {/* Trip type and status header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex bg-slate-950/60 p-1 rounded-2xl border border-white/10 max-w-fit">
                  <button
                    type="button"
                    onClick={() => dispatch(updateSearchQuery({ tripType: 'oneWay' }))}
                    className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                      searchQuery.tripType === 'oneWay'
                        ? 'bg-gradient-to-r from-brand-cyan to-brand-cyan-light text-slate-950 shadow-md shadow-brand-cyan/15 font-extrabold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Plane className="w-3.5 h-3.5 transform -rotate-45" />
                    <span>One Way</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(updateSearchQuery({ tripType: 'roundTrip' }))}
                    className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                      searchQuery.tripType === 'roundTrip'
                        ? 'bg-gradient-to-r from-brand-cyan to-brand-cyan-light text-slate-950 shadow-md shadow-brand-cyan/15 font-extrabold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Round Trip</span>
                  </button>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-full border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sabre & Amadeus GDS Live Hub Active</span>
                </div>
              </div>

              {/* Unique Cockpit GDS Radar Route Console */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch select-none">
                
                {/* Radar Route Tracker Board - spans 6 cols */}
                <div className="lg:col-span-6 bg-slate-950/50 border border-white/10 rounded-2xl p-5 relative hover:border-white/15 transition-all flex flex-col justify-between">
                  <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-500 uppercase tracking-widest pointer-events-none">
                    GDS Radar Track: Active
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 relative z-10">
                    
                    {/* Departure Node Selector */}
                    <div className="flex-1 w-full min-w-0 relative">
                      <AirportSelector
                        label="Departure Station"
                        value={searchQuery.from}
                        onChange={(code) => dispatch(updateSearchQuery({ from: code }))}
                        placeholder="Departure airport..."
                      />
                    </div>

                    {/* Cockpit Arc Connector & Swap Switch */}
                    <div className="flex flex-col items-center justify-center shrink-0 w-16 h-12 relative my-2 sm:my-0">
                      {/* SVG Flight Path Arc */}
                      <svg className="absolute inset-0 w-full h-full text-brand-cyan/20 pointer-events-none" viewBox="0 0 100 50" fill="none">
                        <path d="M 10 35 Q 50 10 90 35" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                        <circle r="3.5" fill="#0ea5e9" className="animate-pulse">
                          <animateMotion dur="4s" repeatCount="indefinite" path="M 10 35 Q 50 10 90 35" />
                        </circle>
                      </svg>
                      
                      {/* Interactive Swap Control Switch */}
                      <button
                        type="button"
                        onClick={handleSwapAirports}
                        className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 hover:border-brand-cyan text-brand-cyan hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:rotate-180 active:scale-95 cursor-pointer z-20 hover:shadow-brand-cyan/25"
                        title="Swap Airports"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Destination Node Selector */}
                    <div className="flex-1 w-full min-w-0 relative">
                      <AirportSelector
                        label="Destination Station"
                        value={searchQuery.to}
                        onChange={(code) => dispatch(updateSearchQuery({ to: code }))}
                        placeholder="Arrival airport..."
                        excludeCode={searchQuery.from}
                      />
                    </div>

                  </div>
                </div>

                {/* Date stamp card */}
                <div className="lg:col-span-3 bg-slate-950/50 border border-white/10 rounded-2xl p-5 relative hover:border-white/15 transition-all flex flex-col justify-between">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Departure Date
                  </label>
                  
                  <div className="relative flex-1 flex items-center min-h-[48px] cursor-pointer mt-1">
                    {/* Overlay Date Display */}
                    <div className="flex items-center gap-3.5 pointer-events-none">
                      <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-extrabold text-white tracking-tight leading-none">
                            {formatDateDay(searchQuery.departureDate)}
                          </span>
                          <span className="text-sm font-bold text-slate-300">
                            {formatDateMonthYear(searchQuery.departureDate)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 block mt-0.5 font-medium">
                          {formatDateWeekday(searchQuery.departureDate)}
                        </span>
                      </div>
                    </div>

                    {/* Invisible HTML Date Input */}
                    <input
                      type="date"
                      required
                      value={searchQuery.departureDate}
                      onChange={(e) => dispatch(updateSearchQuery({ departureDate: e.target.value }))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                  </div>
                </div>

                {/* Travellers and Class Card */}
                <div className="lg:col-span-3 bg-slate-950/50 border border-white/10 rounded-2xl p-5 relative hover:border-white/15 transition-all flex flex-col justify-between">
                  <TravellerSelector
                    adults={searchQuery.adults}
                    childrenCount={searchQuery.children}
                    infants={searchQuery.infants}
                    cabinClass={searchQuery.cabinClass}
                    onChange={(data) => {
                      dispatch(updateSearchQuery({
                        adults: data.adults,
                        children: data.children,
                        infants: data.infants,
                        cabinClass: data.cabinClass,
                      }));
                    }}
                  />
                </div>

              </div>

              {/* Search Actions row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>Sabre & Amadeus GDS live synchronization. Adjust markup slider below after querying.</span>
                </div>
                
                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-cyan-light hover:from-brand-cyan-light hover:to-brand-cyan text-slate-950 font-bold text-sm shadow-xl shadow-brand-cyan/20 hover:shadow-brand-cyan/35 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 duration-300 cursor-pointer"
                >
                  {isSearching ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      <span>Syncing Live Fares...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4.5 h-4.5" />
                      <span>Search Agent Flights</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Search Result HUD grid */}
          {searchTriggered && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Side Filters Sidebar & Markup slider */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Markup slider component */}
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

                {/* Filters card */}
                <div className="glass-card rounded-2xl p-5 border-white/5 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="font-display font-semibold text-white text-sm">GDS Filters</span>
                    <button
                      type="button"
                      onClick={() => dispatch(resetFilters())}
                      className="text-[10px] font-bold text-brand-cyan hover:underline"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* Stops filter */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stops</span>
                    <div className="flex gap-2">
                      {[
                        { id: null, label: 'All' },
                        { id: 0, label: 'Direct' },
                        { id: 1, label: '1 Stop' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => dispatch(updateFilters({ stops: item.id as any }))}
                          className={`flex-1 text-center py-2 rounded-xl text-xs font-semibold border ${
                            filters.stops === item.id
                              ? 'bg-brand-cyan/15 border-brand-cyan text-white'
                              : 'bg-[#011420] border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Refundability */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ticket Refundability</span>
                    <div className="flex gap-2">
                      {[
                        { id: null, label: 'All' },
                        { id: true, label: 'Refundable' },
                        { id: false, label: 'Non-Refund' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => dispatch(updateFilters({ refundable: item.id as any }))}
                          className={`flex-1 text-center py-2 rounded-xl text-xs font-semibold border ${
                            filters.refundable === item.id
                              ? 'bg-brand-cyan/15 border-brand-cyan text-white'
                              : 'bg-[#011420] border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Flight Results feeds */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Result metadata sort */}
                <div className="flex justify-between items-center bg-[#011420] border border-white/5 px-4 py-3 rounded-2xl">
                  <span className="text-xs font-semibold text-slate-400">
                    Showing <span className="text-white">{filteredFlights.length}</span> flight matches for {searchQuery.from} → {searchQuery.to}
                  </span>

                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={filters.sortOrder}
                      onChange={(e) => dispatch(updateFilters({ sortOrder: e.target.value as any }))}
                      className="bg-transparent text-xs font-semibold text-slate-300 border-none outline-none focus:ring-0 cursor-pointer"
                    >
                      <option value="priceAsc">Sort: Price (Lowest)</option>
                      <option value="priceDesc">Sort: Price (Highest)</option>
                      <option value="durationAsc">Sort: Flight Duration</option>
                      <option value="depTimeAsc">Sort: Departure Time</option>
                    </select>
                  </div>
                </div>

                {/* Loading state */}
                {isSearching ? (
                  <div className="glass-card rounded-2xl p-16 text-center space-y-4 border-white/5">
                    <div className="w-12 h-12 rounded-full border-t-2 border-brand-cyan border-r-2 animate-spin mx-auto" />
                    <p className="text-slate-300 font-medium text-sm animate-pulse">Syncing live NDC inventories from GDS portals...</p>
                  </div>
                ) : filteredFlights.length === 0 ? (
                  <div className="glass-card rounded-2xl p-16 text-center space-y-2 border-white/5">
                    <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
                    <h4 className="font-display font-semibold text-white text-base">No flights match the filters</h4>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      Try expanding filters or changing options in the search widget to locate flight schedules.
                    </p>
                  </div>
                ) : (
                  /* Flight Cards list */
                  filteredFlights.map((flight) => {
                    // Cost math based on slider markups
                    const baseTotal = flight.basePrice;
                    const taxTotal = flight.tax;
                    const commission = baseTotal * commissionRate;
                    const agentNetCost = (baseTotal + taxTotal) - commission;
                    const customMarkup = markupType === 'fixed' ? markupValue : baseTotal * (markupValue / 100);
                    const totalCustomerInvoice = agentNetCost + customMarkup;
                    
                    const isExpanded = expandedFlightId === flight.id;

                    return (
                      <div
                        key={flight.id}
                        className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                          selectedFlight?.id === flight.id
                            ? 'border-brand-cyan shadow-md shadow-brand-cyan/5 bg-brand-cyan/2'
                            : 'border-white/5 hover:border-white/15 hover:bg-white/1'
                        }`}
                      >
                        {/* Main Summary strip */}
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                          
                          {/* Airline info */}
                          <div className="flex items-center gap-3 min-w-[120px]">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-navy-light to-brand-navy border border-white/10 flex items-center justify-center font-display font-black text-xs text-white">
                              {flight.airlineCode}
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-white block">{flight.flightNumber}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">Carrier {flight.airlineCode}</span>
                            </div>
                          </div>

                          {/* Time duration timeline */}
                          <div className="flex items-center justify-between sm:justify-start flex-1 max-w-md gap-4">
                            <div className="text-left">
                              <span className="text-base font-bold text-white block">
                                {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="text-xs text-slate-400 font-bold bg-[#011420] px-1.5 py-0.5 rounded mt-0.5 inline-block">
                                {flight.departureAirport}
                              </span>
                            </div>

                            {/* Duration line */}
                            <div className="flex-1 text-center relative px-2">
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
                                {flight.duration}
                              </span>
                              <div className="h-0.5 bg-white/10 relative">
                                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                              </div>
                              <span className="text-[9px] text-brand-cyan font-bold block mt-0.5">
                                {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-base font-bold text-white block">
                                {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="text-xs text-slate-400 font-bold bg-[#011420] px-1.5 py-0.5 rounded mt-0.5 inline-block">
                                {flight.arrivalAirport}
                              </span>
                            </div>
                          </div>

                          {/* Price & Selection */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 gap-2 min-w-[140px]">
                            <div className="text-right">
                              <span className="text-xs text-slate-400 line-through block">
                                ৳{(flight.basePrice + flight.tax).toLocaleString()}
                              </span>
                              <span className="text-base font-bold font-display text-white block text-glow">
                                ৳{totalCustomerInvoice.toLocaleString()}
                              </span>
                              <span className="text-[9px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                                Refundable Tag
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setExpandedFlightId(isExpanded ? null : flight.id)}
                                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => dispatch(setSelectedFlight(flight))}
                                className="px-4 py-2 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyan-light transition-all shadow-md shadow-brand-cyan/15 cursor-pointer"
                              >
                                Book Now
                              </button>
                            </div>
                          </div>

                        </div>

                        {/* Extended Details Panel */}
                        {isExpanded && (
                          <div className="bg-[#011420]/80 border-t border-white/5 p-4 sm:p-5 space-y-4 animate-in slide-in-from-top duration-300">
                            
                            {/* Segment Mapping */}
                            <div className="space-y-4">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Flight Routing Segment Details</span>
                              {flight.segments.map((seg, sIdx) => (
                                <div key={sIdx} className="flex gap-4 items-start relative pl-6 border-l border-white/10">
                                  <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-brand-cyan" />
                                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                                    <div>
                                      <span className="text-slate-400 block">Flight Number</span>
                                      <span className="font-semibold text-white">{seg.flightNumber} ({seg.aircraft})</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block">From Airport</span>
                                      <span className="font-semibold text-white">{seg.departureAirport} → {seg.arrivalAirport}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block">Departure</span>
                                      <span className="font-semibold text-white">
                                        {new Date(seg.departureTime).toLocaleDateString()} {new Date(seg.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block">Baggage Limit</span>
                                      <span className="font-semibold text-white">{seg.baggage}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* GDS Fare Rules Summary */}
                            <div className="bg-[#011a29] border border-white/5 rounded-xl p-3 text-[10px] text-slate-400 leading-relaxed flex items-start gap-2">
                              <Info className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                              <p>
                                <b>Fare Rules:</b> {flight.fareRule} GDS commissions of 7% (BDT {commission.toLocaleString()}) are refunded to agent. Custom markup BDT {customMarkup.toLocaleString()} applied.
                              </p>
                            </div>

                          </div>
                        )}

                      </div>
                    );
                  })
                )}

              </div>

            </div>
          )}

          {/* Interactive Checkout Modal Form */}
          {selectedFlight && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={() => dispatch(setSelectedFlight(null))} />
              
              <div className="relative w-full max-w-2xl bg-[#011d2c] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto z-10 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-brand-cyan" />
                    <h3 className="font-display font-semibold text-lg text-white">Passenger Details & Issuance</h3>
                  </div>
                  <button 
                    onClick={() => dispatch(setSelectedFlight(null))}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {checkoutSuccessPnr ? (
                  /* Success ticket view */
                  <div className="text-center py-6 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-display font-bold text-white text-xl">Ticket Issued Successfully!</h4>
                      <p className="text-xs text-slate-400">
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
                      className="px-6 py-2.5 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyan-light transition-all"
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
                          className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                        >
                          <option value="Mr">Mr.</option>
                          <option value="Mrs">Mrs.</option>
                          <option value="Ms">Ms.</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">First Name (as Passport)</label>
                        <input
                          type="text"
                          required
                          value={passengerDetails.firstName}
                          onChange={(e) => setPassengerDetails({ ...passengerDetails, firstName: e.target.value })}
                          placeholder="e.g. Anisur"
                          className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Last Name (as Passport)</label>
                        <input
                          type="text"
                          required
                          value={passengerDetails.lastName}
                          onChange={(e) => setPassengerDetails({ ...passengerDetails, lastName: e.target.value })}
                          placeholder="e.g. Rahman"
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
                          className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Date of Birth</label>
                        <input
                          type="date"
                          required
                          value={passengerDetails.dob}
                          onChange={(e) => setPassengerDetails({ ...passengerDetails, dob: e.target.value })}
                          className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Passport Number</label>
                        <input
                          type="text"
                          required
                          value={passengerDetails.passportNumber}
                          onChange={(e) => setPassengerDetails({ ...passengerDetails, passportNumber: e.target.value })}
                          placeholder="e.g. A01824921"
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
                          className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                        />
                      </div>
                    </div>

                    {/* Summary B2B cost breakout */}
                    <div className="bg-[#011420] border border-white/5 rounded-2xl p-4 space-y-2 text-xs text-slate-400">
                      <div className="flex justify-between">
                        <span>Agent Net Cost (Debited from B2B Wallet):</span>
                        <span className="font-bold text-white">
                          ৳{((selectedFlight.basePrice + selectedFlight.tax) - (selectedFlight.basePrice * commissionRate)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Applied Profit Markup:</span>
                        <span className="font-bold text-brand-cyan">
                          + ৳{(markupType === 'fixed' ? markupValue : selectedFlight.basePrice * (markupValue / 100)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-white/10 pt-2 text-sm">
                        <span className="font-semibold text-slate-200">Customer Ticket Invoice price:</span>
                        <span className="font-bold text-white font-display">
                          ৳{(((selectedFlight.basePrice + selectedFlight.tax) - (selectedFlight.basePrice * commissionRate)) + (markupType === 'fixed' ? markupValue : selectedFlight.basePrice * (markupValue / 100))).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-brand-cyan text-slate-950 font-bold text-sm hover:bg-brand-cyan-light transition-all shadow-lg shadow-brand-cyan/20 cursor-pointer"
                    >
                      Issue Electronic Ticket (Confirm GDS Booking)
                    </button>
                  </form>
                )}

              </div>
            </div>
          )}

        </div>
      )}

      {/* Bookings Queue and Void Ticketing Manager */}
      {activeTab === 'bookings' && (
        <div className="glass-card rounded-3xl p-6 border-white/5 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <h3 className="font-display font-semibold text-white text-base">Bookings Queue</h3>
              <p className="text-xs text-slate-400">Track GDS issuances and process ticket voids.</p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <FileText className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="font-display font-semibold text-white text-sm">No issued tickets yet</h4>
              <p className="text-xs text-slate-400">Issued flight bookings will show up in this ticketing queue.</p>
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
                    <th className="py-3 px-2">Total Customer</th>
                    <th className="py-3 px-2">Profit</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
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
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          booking.status === 'Ticketed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        {booking.status === 'Ticketed' && (
                          <button
                            onClick={() => handleVoidTicket(booking.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Void Ticket (Refund)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Financial statement sheet log */}
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
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : txn.type === 'Void Ticket' || txn.type === 'Refund'
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : 'bg-rose-500/10 text-rose-400'
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
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        txn.status === 'Success'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : txn.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-400 animate-pulse'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Deposit form submission */}
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
                className="w-full bg-[#011420] border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-brand-cyan"
              >
                <option value="Standard Chartered Bank">Standard Chartered Bank (SCB)</option>
                <option value="City Bank Ltd">The City Bank Ltd</option>
                <option value="Mutual Trust Bank">Mutual Trust Bank (MTB)</option>
                <option value="bKash (MFS Transfer)">bKash (Mobile Transfer)</option>
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
