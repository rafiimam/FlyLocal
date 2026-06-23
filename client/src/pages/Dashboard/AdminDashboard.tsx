import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { approveAgency, adminApproveDepositBalance } from '../../store/authSlice';
import { approvePendingDeposit, adjustGlobalCommission } from '../../store/bookingSlice';
import { 
  Building2, 
  DollarSign, 
  FileText, 
  Sliders, 
  CheckCircle, 
  ShieldCheck, 
  BarChart3, 
  Percent, 
  Activity, 
  UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  activeTab: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab }) => {
  const dispatch = useAppDispatch();

  // Select Redux States
  const agent = useAppSelector((state) => state.auth.agent);
  const ledger = useAppSelector((state) => state.booking.ledger);
  const bookings = useAppSelector((state) => state.booking.bookings);
  const pendingAgencies = useAppSelector((state) => state.auth.pendingAgencies);
  const commissionRate = useAppSelector((state) => state.booking.commissionRate);

  // Settings State
  const [comValue, setComValue] = useState(commissionRate * 100);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Status updates
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  if (!agent) return null;

  // Filter pending deposits
  const pendingDeposits = ledger.filter(
    (txn) => txn.type === 'Deposit' && txn.status === 'Pending'
  );

  // Stats Calculations
  const totalBookingsCount = bookings.length;
  const totalVolume = bookings.reduce((sum, b) => sum + b.totalClientPaid, 0);
  const totalAgentProfit = bookings.reduce((sum, b) => sum + b.agentProfit, 0);
  
  // Calculate verified agents vs pending
  const activeAgenciesCount = 12; // Static baseline + approved
  const pendingAgenciesCount = pendingAgencies.length;

  const handleApproveDeposit = (txnId: string, amount: number) => {
    // 1. Mark transaction 'Success' in ledger
    dispatch(approvePendingDeposit(txnId));
    // 2. Increase the Agent's wallet balance
    dispatch(adminApproveDepositBalance(amount));

    setActionSuccessMsg(`Approved bank deposit slip BDT ${amount.toLocaleString()} successfully. Balance updated.`);
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  const handleApproveAgency = (agencyId: string, companyName: string) => {
    // Verify agency
    dispatch(approveAgency(agencyId));

    setActionSuccessMsg(`Agency "${companyName}" registration verified. Credentials issued via SMTP.`);
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(adjustGlobalCommission(comValue / 100));
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
          {/* Analytics Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-card rounded-2xl p-5 border-white/5 space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Sales Volume</span>
                <DollarSign className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <span className="text-xl font-bold font-display text-white">৳{(1250000 + totalVolume).toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Aggregated B2B sales volume</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border-white/5 space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Agent Profits</span>
                <Percent className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-xl font-bold font-display text-emerald-400">৳{(87500 + totalAgentProfit).toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block mt-1">API commissions + markups</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border-white/5 space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Active B2B Agencies</span>
                <Building2 className="w-4 h-4 text-brand-cyan" />
              </div>
              <div>
                <span className="text-xl font-bold font-display text-white">{activeAgenciesCount}</span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Approved agencies ({pendingAgenciesCount} pending verify)
                </span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border-white/5 space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Bookings (PNRs)</span>
                <FileText className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <span className="text-xl font-bold font-display text-white">{48 + totalBookingsCount}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Total ticket records issued</span>
              </div>
            </div>

          </div>

          {/* Quick status monitor panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Live API Connections status */}
            <div className="glass-card rounded-2xl p-5 border-white/5 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="font-display font-semibold text-white text-sm">GDS Channel Sync Status</span>
                <Activity className="w-4 h-4 text-brand-cyan" />
              </div>
              <div className="space-y-3 font-mono text-xs">
                {[
                  { name: 'Sabre Flight API Gateway', latency: '95ms', status: 'ONLINE', color: 'text-emerald-400' },
                  { name: 'Amadeus NDC Aggregator', latency: '124ms', status: 'ONLINE', color: 'text-emerald-400' },
                  { name: 'Emirates Direct NDC API', latency: '110ms', status: 'ONLINE', color: 'text-emerald-400' },
                  { name: 'Biman Bangladesh NDC API', latency: '82ms', status: 'ONLINE', color: 'text-emerald-400' },
                  { name: 'Singapore Airlines NDC Gateway', latency: '105ms', status: 'ONLINE', color: 'text-emerald-400' },
                ].map((channel, cIdx) => (
                  <div key={cIdx} className="flex justify-between items-center bg-[#011420] px-3 py-2 rounded-xl border border-white/5">
                    <span>{channel.name}</span>
                    <div className="flex gap-4">
                      <span className="text-slate-500">{channel.latency}</span>
                      <span className={`font-bold ${channel.color}`}>{channel.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform statistics lists */}
            <div className="glass-card rounded-2xl p-5 border-white/5 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="font-display font-semibold text-white text-sm">Active Agencies Rankings</span>
                <BarChart3 className="w-4 h-4 text-amber-500" />
              </div>
              <div className="space-y-3 text-xs">
                {[
                  { name: 'Apex Travel & Tours (Current)', sales: '৳595,500', share: '32%' },
                  { name: 'Universal Booking Hub', sales: '৳420,000', share: '24%' },
                  { name: 'Chittagong Flights Agency', sales: '৳310,000', share: '18%' },
                  { name: 'Royal Globetrotters Inc', sales: '৳180,000', share: '11%' },
                ].map((agency, aIdx) => (
                  <div key={aIdx} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div>
                      <span className="font-semibold text-slate-200 block">{agency.name}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">B2B Volume share: {agency.share}</span>
                    </div>
                    <span className="font-bold text-white font-display">{agency.sales}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. Deposit Approvals Queue Tab */}
      {activeTab === 'admin_deposits' && (
        <div className="glass-card rounded-3xl p-6 border-white/5 space-y-5">
          <div>
            <h3 className="font-display font-semibold text-white text-base">Pending Bank Deposit Slips</h3>
            <p className="text-xs text-slate-400">Review transfer receipts and credit agent wallet balances.</p>
          </div>

          {pendingDeposits.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-display font-semibold text-white text-sm">Approvals Queue Cleared</h4>
              <p className="text-xs text-slate-400">All bank slip deposits are currently approved and processed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">Transaction Ref</th>
                    <th className="py-3 px-2">Request Date</th>
                    <th className="py-3 px-2">Gateway / Bank</th>
                    <th className="py-3 px-2">Slip Ref ID</th>
                    <th className="py-3 px-2">Requested Amount</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingDeposits.map((deposit) => (
                    <tr key={deposit.id} className="border-b border-white/5 hover:bg-white/1 transition-all">
                      <td className="py-4 px-2 font-mono text-slate-400">{deposit.id}</td>
                      <td className="py-4 px-2 text-slate-400">{new Date(deposit.date).toLocaleString()}</td>
                      <td className="py-4 px-2 font-semibold text-white">{deposit.description.split('via ')[1]?.split(' (')[0] || 'Bank Gateway'}</td>
                      <td className="py-4 px-2 font-bold font-mono text-slate-300">{deposit.ref}</td>
                      <td className="py-4 px-2 font-bold text-emerald-400">৳{deposit.amount.toLocaleString()}</td>
                      <td className="py-4 px-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                          {deposit.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button
                          onClick={() => handleApproveDeposit(deposit.id, deposit.amount)}
                          className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-bold transition-all shadow-md shadow-amber-500/10 cursor-pointer"
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
      )}

      {/* 3. Agency Verifications Queue Tab */}
      {activeTab === 'admin_agencies' && (
        <div className="glass-card rounded-3xl p-6 border-white/5 space-y-5">
          <div>
            <h3 className="font-display font-semibold text-white text-base">Agency License Verifications</h3>
            <p className="text-xs text-slate-400">Verify company trade licenses and NID/passport details to activate accounts.</p>
          </div>

          {pendingAgencies.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <UserCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-display font-semibold text-white text-sm">No Pending verifications</h4>
              <p className="text-xs text-slate-400">All registered travel agencies are active and verified.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingAgencies.map((agency) => (
                <div key={agency.id} className="bg-[#011420] border border-white/10 rounded-2xl p-5 space-y-4 hover:border-brand-cyan/20 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-brand-cyan font-bold bg-brand-cyan/10 px-1.5 py-0.5 rounded border border-brand-cyan/20">
                        {agency.entityType}
                      </span>
                      <h4 className="font-display font-bold text-white text-sm mt-1">{agency.companyName}</h4>
                      <span className="text-[10px] text-slate-500 block">Registered: {new Date(agency.registrationDate).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-xs border-b border-white/5 pb-3 text-slate-400">
                    <div>Trade License</div>
                    <div className="text-right font-semibold text-white">{agency.tradeLicense}</div>

                    <div>Representative</div>
                    <div className="text-right font-semibold text-white">{agency.representativeName}</div>

                    <div>Business Email</div>
                    <div className="text-right font-semibold text-white truncate">{agency.businessEmail}</div>

                    <div>Phone Number</div>
                    <div className="text-right font-semibold text-white">{agency.phone}</div>

                    <div>NID / Passport</div>
                    <div className="text-right font-semibold text-white">{agency.nidPassport}</div>
                  </div>

                  {/* Attachment simulation */}
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    <span className="font-semibold font-mono truncate">TradeLicense_Doc_Verified.pdf Attached</span>
                  </div>

                  <button
                    onClick={() => handleApproveAgency(agency.id, agency.companyName)}
                    className="w-full py-2.5 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyan-light transition-all shadow-md shadow-brand-cyan/10"
                  >
                    Approve Trade License & Activate Agent
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Global Booking Logs Tab */}
      {activeTab === 'admin_bookings' && (
        <div className="glass-card rounded-3xl p-6 border-white/5 space-y-5">
          <div>
            <h3 className="font-display font-semibold text-white text-base">Global Bookings Logs</h3>
            <p className="text-xs text-slate-400">Audit flight booking orders and cancellations across the entire B2B portal.</p>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <FileText className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="font-display font-semibold text-white text-sm">No ticket records logs</h4>
              <p className="text-xs text-slate-400">All agent flight ticketing actions will log here for audits.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">Booking ID</th>
                    <th className="py-3 px-2">PNR</th>
                    <th className="py-3 px-2">Sector Routing</th>
                    <th className="py-3 px-2">Passenger details</th>
                    <th className="py-3 px-2">Markup Applied</th>
                    <th className="py-3 px-2">Total Paid</th>
                    <th className="py-3 px-2">Gross Profit</th>
                    <th className="py-3 px-2">Booking Date</th>
                    <th className="py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-white/5 hover:bg-white/1 transition-all">
                      <td className="py-4 px-2 font-mono text-slate-400">{booking.id}</td>
                      <td className="py-4 px-2 font-bold font-mono tracking-widest text-white">{booking.pnr}</td>
                      <td className="py-4 px-2">
                        <span className="font-semibold text-white block">{booking.flight.flightNumber}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {booking.flight.departureAirport} → {booking.flight.arrivalAirport} ({booking.flight.cabinClass})
                        </span>
                      </td>
                      <td className="py-4 px-2 font-semibold">
                        {booking.passengers[0]?.lastName}/{booking.passengers[0]?.firstName}
                      </td>
                      <td className="py-4 px-2">৳{booking.markupApplied.toLocaleString()}</td>
                      <td className="py-4 px-2 font-bold text-white">৳{booking.totalClientPaid.toLocaleString()}</td>
                      <td className="py-4 px-2 font-semibold text-emerald-400">৳{booking.agentProfit.toLocaleString()}</td>
                      <td className="py-4 px-2 text-slate-400">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          booking.status === 'Ticketed'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 5. Global Settings Tab */}
      {activeTab === 'admin_settings' && (
        <div className="max-w-xl mx-auto glass-card rounded-3xl p-6 border-white/5 space-y-6">
          <div>
            <h3 className="font-display font-semibold text-white text-base">Global GDS / NDC Config</h3>
            <p className="text-xs text-slate-400">Adjust standard commission algorithms and API connectivity.</p>
          </div>

          {settingsSaved && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl p-3.5 text-xs flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>GDS commission adjustments saved and synced to API gateways.</span>
            </div>
          )}

          <form onSubmit={handleSaveCommission} className="space-y-5">
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Baseline GDS API Commission (Sabre / Amadeus)</span>
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
              <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase">
                <span>0% Net Cost</span>
                <span>Max (15% Refund)</span>
              </div>
            </div>

            <div className="space-y-3.5 border-t border-white/5 pt-4">
              <span className="text-xs font-bold text-white block">Active API Connectors</span>
              <div className="space-y-2">
                {[
                  { name: 'Sabre GDS Live Connection', enabled: true },
                  { name: 'Amadeus GDS NDC Sync', enabled: true },
                  { name: 'Travelport Galileo cache', enabled: false },
                ].map((api, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">{api.name}</span>
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
              className="w-full py-3 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs hover:bg-brand-cyan-light transition-all shadow-lg shadow-brand-cyan/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Apply GDS Commission Adjustments</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
