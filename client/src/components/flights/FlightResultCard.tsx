import React from 'react';
import { useAppDispatch } from '../../store';
import { setSelectedFlight } from '../../store/bookingSlice';
import type { Flight } from '../../data/flightData';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface FlightResultCardProps {
  flight: Flight;
  commissionRate: number;
  markupType: 'fixed' | 'percentage';
  markupValue: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const FlightResultCard: React.FC<FlightResultCardProps> = ({
  flight,
  commissionRate,
  markupType,
  markupValue,
  isExpanded,
  onToggleExpand,
}) => {
  const dispatch = useAppDispatch();

  const baseTotal = flight.basePrice;
  const taxTotal = flight.tax;
  const commission = baseTotal * commissionRate;
  const agentNetCost = (baseTotal + taxTotal) - commission;
  const customMarkup = markupType === 'fixed' ? markupValue : baseTotal * (markupValue / 100);
  const totalCustomerInvoice = agentNetCost + customMarkup;

  return (
    <div
      className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
        isExpanded
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
              onClick={onToggleExpand}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
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
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Flight Routing Segment Details</span>
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
            <Info className="w-4.5 h-4.5 text-brand-cyan shrink-0 mt-0.5" />
            <p>
              <b>Fare Rules:</b> {flight.fareRule} GDS commissions of {(commissionRate * 100).toFixed(0)}% (BDT {commission.toLocaleString()}) are refunded to agent. Custom markup BDT {customMarkup.toLocaleString()} applied.
            </p>
          </div>

        </div>
      )}
    </div>
  );
};
