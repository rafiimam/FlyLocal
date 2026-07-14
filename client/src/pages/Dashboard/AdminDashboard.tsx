import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { approveAgency, adminApproveDepositBalance } from '../../store/authSlice';
import { approvePendingDeposit, adjustGlobalCommission } from '../../store/bookingSlice';
import { setHotelMarkupValue } from '../../store/hotelSlice';
import { setTourMarkupValue } from '../../store/tourSlice';
import { ServiceTabs } from '../../components/shared/ServiceTabs';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { HOTELS } from '../../data/hotelData';
import { TOUR_PACKAGES } from '../../data/tourData';

import { 
  Building2, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  ShieldCheck, 
  BarChart3, 
  Percent, 
  Activity, 
  UserCheck,
  Settings,
  Plus,
  TrendingUp,
  MapPin,
  Clock,
  Briefcase
} from 'lucide-react';

interface AdminDashboardProps {
  activeTab: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab }) => {
  const dispatch = useAppDispatch();

  // Select Redux States
  const agent = useAppSelector((state) => state.auth.agent);
  const ledger = useAppSelector((state) => state.booking.ledger);
  
  // Bookings lists
  const flightBookings = useAppSelector((state) => state.booking.bookings);
  const hotelBookings = useAppSelector((state) => state.hotel.hotelBookings);
  const tourBookings = useAppSelector((state) => state.tour.tourBookings);

  const pendingAgencies = useAppSelector((state) => state.auth.pendingAgencies);
  const commissionRate = useAppSelector((state) => state.booking.commissionRate);
  const hotelMarkup = useAppSelector((state) => state.hotel.markupValue);
  const tourMarkup = useAppSelector((state) => state.tour.markupValue);

  // Settings State
  const [comValue, setComValue] = useState(commissionRate * 100);
  const [hotMarkupVal, setHotMarkupVal] = useState(hotelMarkup);
  const [trMarkupVal, setTrMarkupVal] = useState(tourMarkup);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // local active logs tab
  const [activeLogsTab, setActiveLogsTab] = useState<'flights' | 'hotels' | 'tours'>('flights');

  // Status updates
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  if (!agent) return null;

  // Filter pending deposits
  const pendingDeposits = ledger.filter(
    (txn) => txn.type === 'Deposit' && txn.status === 'Pending'
  );

  // Stats Calculations
  const totalBookingsCount = flightBookings.length + hotelBookings.length + tourBookings.length;
  const totalVolume = 
    flightBookings.reduce((sum, b) => sum + b.totalClientPaid, 0) +
    hotelBookings.reduce((sum, b) => sum + b.totalClientPaid, 0) +
    tourBookings.reduce((sum, b) => sum + b.totalClientPaid, 0);

  const totalAgentProfit = 
    flightBookings.reduce((sum, b) => sum + b.agentProfit, 0) +
    hotelBookings.reduce((sum, b) => sum + b.agentProfit, 0) +
    tourBookings.reduce((sum, b) => sum + b.agentProfit, 0);
  
  // Calculate verified agents vs pending
  const activeAgenciesCount = 12; // Static baseline + approved
  const pendingAgenciesCount = pendingAgencies.length;

  const handleApproveDeposit = (txnId: string, amount: number) => {
    dispatch(approvePendingDeposit(txnId));
    dispatch(adminApproveDepositBalance(amount));
    setActionSuccessMsg(`Approved bank deposit slip BDT ${amount.toLocaleString()} successfully. Balance updated.`);
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  const handleApproveAgency = (agencyId: string, companyName: string) => {
    dispatch(approveAgency(agencyId));
    setActionSuccessMsg(`Agency "${companyName}" registration verified. Credentials issued via SMTP.`);
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(adjustGlobalCommission(comValue / 100));
    dispatch(setHotelMarkupValue(hotMarkupVal));
    dispatch(setTourMarkupValue(trMarkupVal));
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Action Alerts */}
      {actionSuccessMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl p-4 text-xs flex items-center gap-2.5 font-medium shadow-lg animate-in slide-in-from-top duration-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* 1. Portal Overview Stats Tab */}
      {activeTab === 'admin_overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border-amber-500/10 space-y-2 hover-lift">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Sales Volume</span>
                <DollarSign className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <span className="text-2xl font-bold font-display text-white">৳{(1250000 + totalVolume).toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Aggregated B2B sales volume</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border-emerald-500/10 space-y-2 hover-lift">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Agent Profits</span>
                <Percent className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-2xl font-bold font-display text-emerald-400">৳{(87500 + totalAgentProfit).toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block mt-1">API commissions + margins</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border-brand-cyan/10 space-y-2 hover-lift">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Active B2B Agencies</span>
                <Building2 className="w-4 h-4 text-brand-cyan" />
              </div>
              <div>
                <span className="text-2xl font-bold font-display text-white">{activeAgenciesCount}</span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Approved agencies ({pendingAgenciesCount} pending verify)
                </span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border-white/5 space-y-2 hover-lift">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Bookings</span>
                <FileText className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <span className="text-2xl font-bold font-display text-white">{48 + totalBookingsCount}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Total PNR & Voucher records</span>
              </div>
            </div>
          </div>

          {/* Quick status monitor panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-5 border-white/5 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="font-display font-semibold text-white text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-cyan" />
                  GDS Channel Sync Status
                </span>
                <span className="text-[10px] font-bold text-emerald-400 animate-pulse bg-emerald-500/10 px-2 py-0.5 rounded">ALL CONNECTORS ONLINE</span>
              </div>
              <div className="space-y-3 font-mono text-xs">
                {[
                  { name: 'Sabre Flight API Gateway', latency: '95ms', status: 'ONLINE', color: 'text-emerald-400' },
                  { name: 'Amadeus NDC Hotel Hub', latency: '138ms', status: 'ONLINE', color: 'text-emerald-400' },
                  { name: 'Travelport Galileo cache', latency: '82ms', status: 'ONLINE', color: 'text-emerald-400' },
                  { name: 'Emirates Direct NDC API', latency: '110ms', status: 'ONLINE', color: 'text-emerald-400' },
                  { name: 'Biman Bangladesh NDC API', latency: '82ms', status: 'ONLINE', color: 'text-emerald-400' },
                  { name: 'Regional Tour Supplier Gateway', latency: '162ms', status: 'ONLINE', color: 'text-emerald-400' },
                ].map((channel, cIdx) => (
                  <div key={cIdx} className="flex justify-between items-center bg-[#011420] px-3 py-2.5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                    <span className="text-slate-300">{channel.name}</span>
                    <div className="flex gap-4">
                      <span className="text-slate-500">{channel.latency}</span>
                      <span className={`font-bold ${channel.color}`}>{channel.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border-white/5 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="font-display font-semibold text-white text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                  Active Agencies Rankings
                </span>
                <span className="text-[10px] text-slate-500">Live share distribution</span>
              </div>
              <div className="space-y-3 text-xs">
                {[
                  { name: 'Apex Travel & Tours', sales: '৳680,200', share: '38%', color: 'from-brand-cyan/20' },
                  { name: 'Universal Booking Hub', sales: '৳420,000', share: '24%', color: 'from-amber-500/10' },
                  { name: 'Chittagong Flights Agency', sales: '৳310,000', share: '18%', color: 'from-emerald-500/10' },
                  { name: 'Royal Globetrotters Inc', sales: '৳180,000', share: '11%', color: 'from-slate-500/10' },
                ].map((agency, aIdx) => (
                  <div key={aIdx} className="flex justify-between items-center border-b border-white/5 pb-2.5 bg-gradient-to-r to-transparent via-transparent rounded-lg p-1 hover:border-white/15 transition-all">
                    <div>
                      <span className="font-semibold text-slate-200 block">{agency.name}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">B2B Volume share: <span className="text-brand-cyan font-semibold">{agency.share}</span></span>
                    </div>
                    <span className="font-bold text-white font-display text-sm">{agency.sales}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Deposit Approvals */}
      {activeTab === 'admin_deposits' && (
        <div className="glass-card rounded-3xl border-white/5 overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-white/5 bg-gradient-to-r from-slate-950/50 to-transparent">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-brand-navy-light flex items-center justify-center border border-white/10">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-base">Pending Bank Deposit Slips</h3>
              <p className="text-[10px] text-slate-400">Review transfer receipts and credit agent wallet balances.</p>
            </div>
          </div>

          <div className="p-6">
            {pendingDeposits.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-display font-semibold text-white text-sm">Approvals Queue Cleared</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">All bank slip deposits are currently approved and processed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3 bg-slate-950/30 rounded-l-lg">Transaction Ref</th>
                      <th className="py-3 px-3 bg-slate-950/30">Request Date</th>
                      <th className="py-3 px-3 bg-slate-950/30">Gateway / Bank</th>
                      <th className="py-3 px-3 bg-slate-950/30">Slip Ref ID</th>
                      <th className="py-3 px-3 bg-slate-950/30">Requested Amount</th>
                      <th className="py-3 px-3 bg-slate-950/30">Status</th>
                      <th className="py-3 px-3 bg-slate-950/30 rounded-r-lg text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingDeposits.map((deposit, idx) => (
                      <tr key={deposit.id} className={`border-b border-white/5 hover:bg-amber-500/5 transition-all ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-950/20'}`}>
                        <td className="py-4 px-3 font-mono text-[10px] text-slate-500">{deposit.id}</td>
                        <td className="py-4 px-3 text-slate-400">
                          <span className="block">{new Date(deposit.date).toLocaleDateString()}</span>
                          <span className="text-[10px] text-slate-500 block">{new Date(deposit.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </td>
                        <td className="py-4 px-3 font-semibold text-white">{deposit.description.split('via ')[1]?.split(' (')[0] || 'Bank Gateway'}</td>
                        <td className="py-4 px-3">
                          <span className="font-bold font-mono text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg text-[10px]">{deposit.ref}</span>
                        </td>
                        <td className="py-4 px-3 font-bold text-emerald-400">৳{deposit.amount.toLocaleString()}</td>
                        <td className="py-4 px-3">
                          <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse inline-block">
                            {deposit.status}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleApproveDeposit(deposit.id, deposit.amount)}
                            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-bold transition-all shadow-md shadow-amber-500/10 cursor-pointer btn-shimmer"
                          >
                            Approve Deposit Slip
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Agency Verifications */}
      {activeTab === 'admin_agencies' && (
        <div className="glass-card rounded-3xl p-6 border-white/5 space-y-5">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 bg-gradient-to-r from-slate-950/50 to-transparent p-4 rounded-t-3xl -mx-6 -mt-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-navy-light flex items-center justify-center border border-white/10">
              <UserCheck className="w-5 h-5 text-brand-cyan" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-base">Agency License Verifications</h3>
              <p className="text-[10px] text-slate-400">Verify company trade licenses and NID/passport details to activate accounts.</p>
            </div>
          </div>

          {pendingAgencies.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                <UserCheck className="w-8 h-8" />
              </div>
              <h4 className="font-display font-semibold text-white text-sm">No Pending verifications</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">All registered travel agencies are active and verified.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingAgencies.map((agency) => (
                <div key={agency.id} className="bg-[#011420] border border-white/10 rounded-2xl p-5 space-y-4 hover:border-brand-cyan/30 transition-all hover-lift">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-brand-cyan font-bold bg-brand-cyan/15 px-2.5 py-0.5 rounded-lg border border-brand-cyan/25 uppercase">
                        {agency.entityType}
                      </span>
                      <h4 className="font-display font-bold text-white text-sm mt-2">{agency.companyName}</h4>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Registered: {new Date(agency.registrationDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-xs border-b border-white/5 pb-3.5 text-slate-400">
                    <div>Trade License</div>
                    <div className="text-right font-semibold text-slate-200">{agency.tradeLicense}</div>

                    <div>Representative</div>
                    <div className="text-right font-semibold text-slate-200">{agency.representativeName}</div>

                    <div>Business Email</div>
                    <div className="text-right font-semibold text-slate-200 truncate">{agency.businessEmail}</div>

                    <div>Phone Number</div>
                    <div className="text-right font-semibold text-slate-200">{agency.phone}</div>

                    <div>NID / Passport</div>
                    <div className="text-right font-semibold text-slate-200 font-mono">{agency.nidPassport}</div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-mono truncate">TradeLicense_Doc_Verified.pdf Attached</span>
                  </div>

                  <button
                    onClick={() => handleApproveAgency(agency.id, agency.companyName)}
                    className="w-full py-3 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyan-light transition-all shadow-md shadow-brand-cyan/10 cursor-pointer btn-shimmer"
                  >
                    Approve Trade License & Activate Agent
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Global Booking Logs */}
      {activeTab === 'admin_bookings' && (
        <div className="glass-card rounded-3xl border-white/5 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-white/5 bg-gradient-to-r from-slate-950/50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-brand-navy-light flex items-center justify-center border border-white/10">
                <FileText className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white text-base">Global Bookings Logs</h3>
                <p className="text-[10px] text-slate-400">Audit all agent bookings and transactions across the portal.</p>
              </div>
            </div>
            <ServiceTabs activeService={activeLogsTab} onChange={setActiveLogsTab} variant="compact" />
          </div>

          <div className="p-6">
            {activeLogsTab === 'flights' && (
              flightBookings.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center mx-auto text-brand-cyan">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-semibold text-white text-sm">No ticket records logs</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">Flight ticketing audit logs will show here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <th className="py-3 px-3 bg-slate-950/30 rounded-l-lg">Booking ID</th>
                        <th className="py-3 px-3 bg-slate-950/30">PNR</th>
                        <th className="py-3 px-3 bg-slate-950/30">Sector Routing</th>
                        <th className="py-3 px-3 bg-slate-950/30">Passenger</th>
                        <th className="py-3 px-3 bg-slate-950/30">Markup</th>
                        <th className="py-3 px-3 bg-slate-950/30">Total Paid</th>
                        <th className="py-3 px-3 bg-slate-950/30">Gross Profit</th>
                        <th className="py-3 px-3 bg-slate-950/30">Booking Date</th>
                        <th className="py-3 px-3 bg-slate-950/30 rounded-r-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flightBookings.map((booking, idx) => (
                        <tr key={booking.id} className={`border-b border-white/5 hover:bg-brand-cyan/5 transition-all ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-950/20'}`}>
                          <td className="py-4 px-3 font-mono text-[10px] text-slate-500">{booking.id}</td>
                          <td className="py-4 px-3">
                            <span className="font-bold font-mono tracking-widest text-brand-cyan bg-brand-cyan/10 px-2 py-1 rounded-lg">{booking.pnr}</span>
                          </td>
                          <td className="py-4 px-3">
                            <span className="font-semibold text-white block">{booking.flight.flightNumber}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{booking.flight.departureAirport} → {booking.flight.arrivalAirport}</span>
                          </td>
                          <td className="py-4 px-3 font-semibold text-slate-200">{booking.passengers[0]?.lastName}/{booking.passengers[0]?.firstName}</td>
                          <td className="py-4 px-3 text-slate-300">৳{booking.markupApplied.toLocaleString()}</td>
                          <td className="py-4 px-3 font-bold text-white">৳{booking.totalClientPaid.toLocaleString()}</td>
                          <td className="py-4 px-3">
                            <span className="font-bold text-emerald-400 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              ৳{booking.agentProfit.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-slate-400">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                          <td className="py-4 px-3">
                            <StatusBadge status={booking.status === 'Ticketed' ? 'Ticketed' : 'Cancelled'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {activeLogsTab === 'hotels' && (
              hotelBookings.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-semibold text-white text-sm">No hotel logs</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">Confirmed hotel reservation audit logs will show here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <th className="py-3 px-3 bg-slate-950/30 rounded-l-lg">Booking ID</th>
                        <th className="py-3 px-3 bg-slate-950/30">Confirmation No</th>
                        <th className="py-3 px-3 bg-slate-950/30">Hotel</th>
                        <th className="py-3 px-3 bg-slate-950/30">Lead Guest</th>
                        <th className="py-3 px-3 bg-slate-950/30">Markup</th>
                        <th className="py-3 px-3 bg-slate-950/30">Total Paid</th>
                        <th className="py-3 px-3 bg-slate-950/30">Booking Date</th>
                        <th className="py-3 px-3 bg-slate-950/30 rounded-r-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotelBookings.map((booking, idx) => (
                        <tr key={booking.id} className={`border-b border-white/5 hover:bg-amber-500/5 transition-all ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-950/20'}`}>
                          <td className="py-4 px-3 font-mono text-[10px] text-slate-500">{booking.id}</td>
                          <td className="py-4 px-3">
                            <span className="font-bold font-mono tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">{booking.confirmationNumber}</span>
                          </td>
                          <td className="py-4 px-3">
                            <span className="font-semibold text-white block">{booking.hotel.name}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{booking.hotel.city} ({booking.nights} nights)</span>
                          </td>
                          <td className="py-4 px-3 font-semibold text-slate-200">{booking.guestName}</td>
                          <td className="py-4 px-3 text-slate-300">৳{booking.markupApplied.toLocaleString()}</td>
                          <td className="py-4 px-3 font-bold text-white">৳{booking.totalClientPaid.toLocaleString()}</td>
                          <td className="py-4 px-3 text-slate-400">{new Date(booking.bookingDate).toLocaleDateString()}</td>
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

            {activeLogsTab === 'tours' && (
              tourBookings.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-semibold text-white text-sm">No tour logs</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">Confirmed tour booking audit logs will show here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <th className="py-3 px-3 bg-slate-950/30 rounded-l-lg">Booking ID</th>
                        <th className="py-3 px-3 bg-slate-950/30">Booking Ref</th>
                        <th className="py-3 px-3 bg-slate-950/30">Tour Package</th>
                        <th className="py-3 px-3 bg-slate-950/30">Lead Traveler</th>
                        <th className="py-3 px-3 bg-slate-950/30">Markup</th>
                        <th className="py-3 px-3 bg-slate-950/30">Total Paid</th>
                        <th className="py-3 px-3 bg-slate-950/30">Booking Date</th>
                        <th className="py-3 px-3 bg-slate-950/30 rounded-r-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tourBookings.map((booking, idx) => (
                        <tr key={booking.id} className={`border-b border-white/5 hover:bg-emerald-500/5 transition-all ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-950/20'}`}>
                          <td className="py-4 px-3 font-mono text-[10px] text-slate-500">{booking.id}</td>
                          <td className="py-4 px-3">
                            <span className="font-bold font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">{booking.confirmationNumber}</span>
                          </td>
                          <td className="py-4 px-3">
                            <span className="font-semibold text-white block">{booking.tourPackage.name}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{booking.tourPackage.destination}</span>
                          </td>
                          <td className="py-4 px-3 font-semibold text-slate-200">{booking.leadTravelerName}</td>
                          <td className="py-4 px-3 text-slate-300">৳{booking.markupApplied.toLocaleString()}</td>
                          <td className="py-4 px-3 font-bold text-white">৳{booking.totalClientPaid.toLocaleString()}</td>
                          <td className="py-4 px-3 text-slate-400">{new Date(booking.bookingDate).toLocaleDateString()}</td>
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
      )}

      {/* 5. Hotel Inventory Management */}
      {activeTab === 'admin_hotels' && (
        <div className="glass-card rounded-3xl p-6 border-white/5 space-y-5">
          <div className="flex justify-between items-center border-b border-white/5 pb-4 bg-gradient-to-r from-slate-950/50 to-transparent p-4 rounded-t-3xl -mx-6 -mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-brand-navy-light flex items-center justify-center border border-white/10">
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white text-base">Hotel Inventory Manager</h3>
                <p className="text-[10px] text-slate-400">View static properties, edit available rate plans and rooms.</p>
              </div>
            </div>
            <button className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10 btn-shimmer">
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HOTELS.map((hotel) => (
              <div key={hotel.id} className="bg-[#011420] border border-white/10 rounded-2xl p-5 space-y-3.5 hover:border-amber-500/30 transition-all hover-lift">
                <div className="flex justify-between items-start">
                  <h4 className="font-display font-bold text-white text-sm hover:text-amber-400 transition-colors leading-tight">{hotel.name}</h4>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg shrink-0">{hotel.roomTypes.length} Room Types</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{hotel.description}</p>
                <div className="text-[10px] text-slate-400 grid grid-cols-2 gap-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> City:</div>
                  <div className="text-right font-semibold text-slate-200">{hotel.city}, {hotel.country}</div>
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500" /> Supplier:</div>
                  <div className="text-right font-semibold text-slate-200 font-mono">{hotel.supplierCode}</div>
                </div>
                <div className="pt-3 border-t border-white/5 flex justify-end gap-2">
                  <button className="px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-slate-300 font-semibold hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                    Manage Rooms
                  </button>
                  <button className="px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-slate-300 font-semibold hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                    Rates & Seasons
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Tour Packages Management */}
      {activeTab === 'admin_tours' && (
        <div className="glass-card rounded-3xl p-6 border-white/5 space-y-5">
          <div className="flex justify-between items-center border-b border-white/5 pb-4 bg-gradient-to-r from-slate-950/50 to-transparent p-4 rounded-t-3xl -mx-6 -mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-brand-navy-light flex items-center justify-center border border-white/10">
                <Briefcase className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white text-base">Tour Packages Manager</h3>
                <p className="text-[10px] text-slate-400">Add or modify standard packages, itineraries, and seasonal pricing.</p>
              </div>
            </div>
            <button className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10 btn-shimmer">
              <Plus className="w-4 h-4" />
              <span>Create Tour</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOUR_PACKAGES.map((tour) => (
              <div key={tour.id} className="bg-[#011420] border border-white/10 rounded-2xl p-5 space-y-3.5 hover:border-emerald-500/30 transition-all hover-lift">
                <div className="flex justify-between items-start">
                  <h4 className="font-display font-bold text-white text-sm hover:text-emerald-400 transition-colors leading-tight">{tour.name}</h4>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg shrink-0 uppercase">{tour.category}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{tour.description}</p>
                <div className="text-[10px] text-slate-400 grid grid-cols-2 gap-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500" /> Duration:</div>
                  <div className="text-right font-semibold text-slate-200">{tour.durationDays} Days / {tour.durationNights} Nights</div>
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> Guide:</div>
                  <div className="text-right font-semibold text-slate-200">{tour.languages.join('/')}</div>
                </div>
                <div className="pt-3 border-t border-white/5 flex justify-end gap-2">
                  <button className="px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-slate-300 font-semibold hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                    Itinerary Planner
                  </button>
                  <button className="px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-slate-300 font-semibold hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                    Pricing Config
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Global Settings */}
      {activeTab === 'admin_settings' && (
        <div className="max-w-xl mx-auto glass-card rounded-3xl p-6 border-white/5 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 bg-gradient-to-r from-slate-950/50 to-transparent p-4 rounded-t-3xl -mx-6 -mt-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-navy-light flex items-center justify-center border border-white/10">
              <Settings className="w-5 h-5 text-brand-cyan" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-base">Global GDS / NDC Config</h3>
              <p className="text-[10px] text-slate-400">Adjust baseline commissions, standard markup targets, and API connectors.</p>
            </div>
          </div>

          {settingsSaved && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl p-3.5 text-xs flex items-center gap-2 font-medium animate-in slide-in-from-top duration-300">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Multi-vertical pricing and commission adjustments saved and synced to API gateways.</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Flight commission */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Baseline Flight GDS Commission</span>
                <span className="text-brand-cyan font-bold font-display text-sm">{comValue}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                step={0.5}
                value={comValue}
                onChange={(e) => setComValue(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-slate-800 accent-brand-cyan cursor-pointer transition-all focus:outline-none"
              />
            </div>

            {/* Hotel markup base */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Standard Hotel B2B Markup Base</span>
                <span className="text-brand-cyan font-bold font-display text-sm">৳{hotMarkupVal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={500}
                max={10000}
                step={250}
                value={hotMarkupVal}
                onChange={(e) => setHotMarkupVal(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-slate-800 accent-brand-cyan cursor-pointer transition-all focus:outline-none"
              />
            </div>

            {/* Tour markup base */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Standard Tour B2B Markup Base</span>
                <span className="text-emerald-400 font-bold font-display text-sm">৳{trMarkupVal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={15000}
                step={500}
                value={trMarkupVal}
                onChange={(e) => setTrMarkupVal(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-slate-800 accent-emerald-500 cursor-pointer transition-all focus:outline-none"
              />
            </div>

            {/* API Switchers */}
            <div className="space-y-3.5 border-t border-white/5 pt-4">
              <span className="text-xs font-bold text-white block">Active API Connectors</span>
              <div className="space-y-3">
                {[
                  { name: 'Sabre GDS Live Connection', enabled: true },
                  { name: 'Amadeus NDC Hotel Hub', enabled: true },
                  { name: 'Regional Tour Supplier Gateway', enabled: true },
                ].map((api, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">{api.name}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={api.enabled}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-cyan" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyan-light transition-all shadow-lg shadow-brand-cyan/20 cursor-pointer flex items-center justify-center gap-1.5 btn-shimmer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Apply Multi-Vertical Configs</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
