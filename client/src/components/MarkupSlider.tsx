import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setMarkupType, setMarkupValue } from '../store/bookingSlice';
import { TrendingUp, DollarSign, Percent, Calculator, Info } from 'lucide-react';

interface MarkupSliderProps {
  basePrice: number;
  tax: number;
  quantity?: number;
}

export const MarkupSlider: React.FC<MarkupSliderProps> = ({ basePrice, tax, quantity = 1 }) => {
  const dispatch = useAppDispatch();
  const markupType = useAppSelector((state) => state.booking.markupType);
  const markupValue = useAppSelector((state) => state.booking.markupValue);
  const commissionRate = useAppSelector((state) => state.booking.commissionRate);

  // Totals for calculations
  const totalBase = basePrice * quantity;
  const totalTax = tax * quantity;
  
  // Base B2B commission (7% of base fare)
  const baseCommission = totalBase * commissionRate;
  
  // Net agent cost: (Base + Tax) - Commission
  const agentNetCost = (totalBase + totalTax) - baseCommission;
  
  // Custom agent markup
  const customMarkup = markupType === 'fixed' 
    ? markupValue * quantity 
    : totalBase * (markupValue / 100);
  
  // Customer total fare: Net cost + Custom markup
  const totalCustomerPaid = agentNetCost + customMarkup;
  
  // Agent gross profit: Base commission + Custom markup
  const agentTotalProfit = baseCommission + customMarkup;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMarkupValue(Number(e.target.value)));
  };

  const handleTypeChange = (type: 'fixed' | 'percentage') => {
    dispatch(setMarkupType(type));
    // Reset defaults when changing modes to avoid extreme values
    dispatch(setMarkupValue(type === 'fixed' ? 3000 : 5));
  };

  const maxSliderValue = markupType === 'fixed' ? 15000 : 25;
  const minSliderValue = 0;
  const stepValue = markupType === 'fixed' ? 500 : 0.5;

  return (
    <div className="glass-card rounded-2xl p-5 border-brand-cyan/20 space-y-5">
      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-cyan" />
          <h3 className="font-display font-semibold text-white text-base">B2B Markup Manager</h3>
        </div>

        {/* Fixed/Percent Toggle */}
        <div className="flex bg-slate-900 border border-white/10 rounded-xl p-1 shrink-0">
          <button
            type="button"
            onClick={() => handleTypeChange('fixed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              markupType === 'fixed'
                ? 'bg-brand-cyan text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Fixed (BDT)</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('percentage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              markupType === 'percentage'
                ? 'bg-brand-cyan text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Percentage</span>
          </button>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-400">Custom Profit Markup</span>
          <span className="text-brand-cyan font-bold font-display text-sm">
            {markupType === 'fixed' 
              ? `+ ৳${markupValue.toLocaleString()}` 
              : `+ ${markupValue}% (৳${customMarkup.toLocaleString()})`}
          </span>
        </div>

        <input
          type="range"
          min={minSliderValue}
          max={maxSliderValue}
          step={stepValue}
          value={markupValue}
          onChange={handleSliderChange}
          className="w-full h-1.5 rounded-lg bg-slate-800 accent-brand-cyan cursor-pointer transition-all focus:outline-none"
        />

        <div className="flex justify-between text-[10px] text-slate-500 font-semibold uppercase">
          <span>Min (৳0)</span>
          <span>{markupType === 'fixed' ? 'Max (+৳15K)' : 'Max (+25%)'}</span>
        </div>
      </div>

      {/* Ledger Breakdown Calculations */}
      <div className="bg-[#011420]/80 border border-white/5 rounded-xl p-4 space-y-3.5">
        <div className="flex items-center gap-1.5 text-xs text-brand-cyan-light font-semibold uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5" />
          <span>B2B Fare Calculator Breakout</span>
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-xs border-b border-white/5 pb-2.5">
          <div className="text-slate-400">Base Net Fare (Agent)</div>
          <div className="text-right font-medium text-white">৳{totalBase.toLocaleString()}</div>

          <div className="text-slate-400">Taxes & Fees</div>
          <div className="text-right font-medium text-white">৳{totalTax.toLocaleString()}</div>

          <div className="text-slate-400 flex items-center gap-1">
            <span>Base API Commission</span>
            <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">7%</span>
          </div>
          <div className="text-right font-semibold text-emerald-400">- ৳{baseCommission.toLocaleString()}</div>
        </div>

        <div className="grid grid-cols-2 gap-y-2.5 text-xs">
          <div className="text-slate-400 font-medium">B2B Agent Net Cost</div>
          <div className="text-right font-bold text-white font-display text-sm">৳{agentNetCost.toLocaleString()}</div>

          <div className="text-slate-400">Applied Agent Markup</div>
          <div className="text-right font-semibold text-brand-cyan">+ ৳{customMarkup.toLocaleString()}</div>

          <div className="border-t border-white/10 pt-2.5 text-slate-200 font-bold text-sm">
            Total Customer Invoice
          </div>
          <div className="border-t border-white/10 pt-2.5 text-right font-bold text-white font-display text-base text-glow">
            ৳{totalCustomerPaid.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Gross Profit Callout */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Gross Agency Profit</span>
            <span className="text-xs text-slate-300">Commission + Markup</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-emerald-400 font-bold font-display text-base block">
            ৳{agentTotalProfit.toLocaleString()}
          </span>
          <span className="text-[9px] text-slate-400 block">
            ({((agentTotalProfit / totalCustomerPaid) * 100).toFixed(1)}% margin)
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2 text-[10px] text-slate-400 bg-white/5 rounded-xl p-3 border border-white/5 leading-relaxed">
        <Info className="w-4.5 h-4.5 text-brand-cyan shrink-0 mt-0.5" />
        <p>
          B2B portal rules apply: The agent is billed the <b>B2B Net Cost</b> from their wallet balance. The customer is ticketed with the <b>Total Customer Invoice</b>, enabling custom agent margin control.
        </p>
      </div>
    </div>
  );
};
