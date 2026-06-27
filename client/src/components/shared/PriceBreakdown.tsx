import React from 'react';

interface PriceBreakdownProps {
  basePrice: number;
  tax: number;
  markupAmount: number;
  commission?: number;
  currency?: string;
  label?: string;
  compact?: boolean;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  basePrice,
  tax,
  markupAmount,
  commission = 0,
  currency = 'BDT',
  label = 'Price Breakdown',
  compact = false,
}) => {
  const netCost = basePrice + tax;
  const agentProfit = commission + markupAmount;
  const clientTotal = netCost + markupAmount;

  if (compact) {
    return (
      <div className="space-y-1 text-[11px]">
        <div className="flex justify-between text-slate-400">
          <span>Net Cost</span>
          <span className="text-slate-200">৳{netCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Markup</span>
          <span className="text-brand-cyan">+৳{markupAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-white/5 font-bold">
          <span className="text-white">Client Total</span>
          <span className="text-white">৳{clientTotal.toLocaleString()} {currency}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 space-y-3">
      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block">{label}</span>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Base Price</span>
          <span className="text-slate-200 font-medium">৳{basePrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Taxes & Fees</span>
          <span className="text-slate-200 font-medium">৳{tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center border-t border-white/5 pt-2">
          <span className="text-slate-300 font-semibold">Net Cost (GDS)</span>
          <span className="text-white font-semibold">৳{netCost.toLocaleString()}</span>
        </div>

        {commission > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-emerald-400 font-medium">Commission</span>
            <span className="text-emerald-400 font-medium">-৳{commission.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-brand-cyan font-medium">Your Markup</span>
          <span className="text-brand-cyan font-medium">+৳{markupAmount.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-brand-cyan/20">
          <span className="text-white font-bold">Client Invoice</span>
          <span className="text-lg text-white font-bold font-display">
            ৳{clientTotal.toLocaleString()} <span className="text-xs text-brand-cyan-light">{currency}</span>
          </span>
        </div>

        <div className="flex justify-between items-center bg-emerald-500/10 rounded-xl px-3 py-2 border border-emerald-500/20">
          <span className="text-emerald-400 font-semibold text-[11px]">Your Net Profit</span>
          <span className="text-emerald-400 font-bold text-sm">৳{agentProfit.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
