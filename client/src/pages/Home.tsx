import React, { useState } from 'react';
import { 
  Plane, 
  ArrowRight, 
  Compass, 
  Calculator, 
  FileText, 
  BadgePercent, 
  ChevronRight,
  Building2,
  Map
} from 'lucide-react';

interface HomeProps {
  onEnterPortal: () => void;
}

export const Home: React.FC<HomeProps> = ({ onEnterPortal }) => {
  const [simulatedMarkup, setSimulatedMarkup] = useState(3000);

  const trendingDeals = [
    {
      from: 'Dhaka',
      fromCode: 'DAC',
      to: 'Singapore',
      toCode: 'SIN',
      airline: 'Singapore Airlines',
      airlineCode: 'SQ',
      priceNet: 38000,
      priceRetail: 47100,
      stops: 0,
      duration: '4h 15m',
      badge: 'Highly Demanded',
      gradient: 'from-amber-600/20 to-blue-900/30'
    },
    {
      from: 'Dhaka',
      fromCode: 'DAC',
      to: 'Dubai',
      toCode: 'DXB',
      airline: 'Emirates',
      airlineCode: 'EK',
      priceNet: 42000,
      priceRetail: 50500,
      stops: 0,
      duration: '5h 15m',
      badge: 'Best Net Fare',
      gradient: 'from-rose-600/20 to-stone-900/30'
    },
    {
      from: 'Dhaka',
      fromCode: 'DAC',
      to: 'London',
      toCode: 'LHR',
      airline: 'Biman Bangladesh',
      airlineCode: 'BG',
      priceNet: 75000,
      priceRetail: 90400,
      stops: 1,
      duration: '12h 15m',
      badge: 'LCC Aggregated',
      gradient: 'from-green-600/20 to-red-950/30'
    }
  ];

  return (
    <div className="min-h-screen bg-[#01111a] text-slate-200 selection:bg-brand-cyan selection:text-slate-950">
      
      {/* Navigation Bar */}
      <nav className="border-b border-white/5 bg-[#01111a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-navy flex items-center justify-center shadow-lg shadow-brand-cyan/25">
              <Plane className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div>
              <span className="font-display font-bold text-xl text-white tracking-wider block">FLYLOCAL</span>
              <span className="text-[9px] text-brand-cyan font-bold tracking-widest uppercase block">B2B Travel Network</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#services" className="hover:text-white transition-colors">Our Services</a>
            <a href="#trending-deals" className="hover:text-white transition-colors">Agent Hot Deals</a>
            <a href="#agency-features" className="hover:text-white transition-colors">Portal features</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onEnterPortal}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white"
            >
              Sign In
            </button>
            <button
              onClick={onEnterPortal}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-cyan hover:bg-brand-cyan-light transition-all text-slate-950 shadow-lg shadow-brand-cyan/15 flex items-center gap-1.5"
            >
              <span>Onboard Agency</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 max-w-7xl mx-auto px-6 space-y-12">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-brand-navy-light/10 blur-[120px] pointer-events-none -z-10" />

        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Premium B2B Multi-Vertical Travel Portal</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Flights · Hotels · Tours. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan-light to-brand-cyan text-glow">
              Issue Bookings Instantly.
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            The unified B2B agent workspace for Bangladeshi travel operators. Lock in live air ticket seats, global hotel rooms, and complete tour packages at net supplier cost. Adjust client invoice markups on-the-fly and reconcile invoices instantly.
          </p>
        </div>

        {/* Futuristic Platform Preview Dashboard Teaser */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch select-none">
          
          {/* Left Column: Interactive Markup Simulator */}
          <div className="lg:col-span-7 bg-[#021825]/95 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden bg-gradient-to-br from-brand-navy-dark to-[#011420]/95 flex flex-col justify-between">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan px-3 py-1 rounded-full">
                  Interactive Simulator
                </span>
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-brand-cyan rounded-full animate-pulse" />
                  Try live markup adjustments
                </span>
              </div>
              
              <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
                Exclusive GDS Live Markup Controller
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adjust your customer markup in real-time. Calculate invoice prices, GDS base commissions, and your exact agency profit margins before issuing tickets.
              </p>
            </div>

            <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 my-6 space-y-4">
              {/* Fare breakdown */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">GDS Net Seat Cost</span>
                  <span className="text-sm font-semibold text-white mt-1 block">৳45,000 BDT</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Base Commission (7%)</span>
                  <span className="text-sm font-semibold text-emerald-400 mt-1 block">- ৳3,150 BDT</span>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Your Custom Agent Markup</span>
                  <span className="text-sm font-bold text-brand-cyan">৳{simulatedMarkup.toLocaleString()} BDT</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15000"
                  step="500"
                  value={simulatedMarkup}
                  onChange={(e) => setSimulatedMarkup(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#011d2c] border border-white/10 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                />
              </div>

              {/* Outputs */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Total Customer Invoice</span>
                  <span className="text-base font-bold text-white mt-1 block">
                    ৳{(45000 - 3150 + simulatedMarkup).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Stated Agent Net Profit</span>
                  <span className="text-base font-bold text-emerald-400 mt-1 block text-glow">
                    ৳{(3150 + simulatedMarkup).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onEnterPortal}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-cyan-light hover:from-brand-cyan-light hover:to-brand-cyan text-slate-950 font-bold text-xs shadow-lg shadow-brand-cyan/15 hover:shadow-brand-cyan/25 flex items-center justify-center gap-2 transition-all cursor-pointer font-sans"
            >
              <span>Onboard Your Agency to Start Booking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Column: Platform Ledger & Feature Teaser */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Wallet Ledger Card */}
            <div className="bg-[#021825]/95 border border-white/10 rounded-3xl p-5 bg-gradient-to-br from-brand-navy-dark to-[#011420]/95 flex-1 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 max-w-fit block">
                  Agent Wallet ledger
                </span>
                <h4 className="font-display font-bold text-white text-base">Automatic Wallet Reconciliation</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Real-time transaction tracking. Submit deposit slips, issue seats, void bookings, and check logs instantly.
                </p>
              </div>

              {/* Mock Statement Feed */}
              <div className="space-y-2 mt-4 text-[10px]">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/45 border border-white/5 text-left">
                  <div>
                    <span className="font-bold text-slate-200 block">Seat Issue (BG-088)</span>
                    <span className="text-[9px] text-slate-500">PNR: YQ4B92 | Pax: 1</span>
                  </div>
                  <span className="font-bold text-rose-400 font-sans">- ৳41,850</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/45 border border-white/5 text-left">
                  <div>
                    <span className="font-bold text-slate-200 block">Bank Deposit Approved</span>
                    <span className="text-[9px] text-slate-500">Ref: SCB-883921</span>
                  </div>
                  <span className="font-bold text-emerald-400 font-sans">+ ৳100,000</span>
                </div>
              </div>
            </div>

            {/* Quick Stats list Card */}
            <div className="bg-[#021825]/95 border border-white/10 rounded-3xl p-5 bg-gradient-to-br from-brand-navy-dark to-[#011420]/95 flex-1 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-brand-cyan bg-brand-cyan/10 px-2.5 py-0.5 rounded-full border border-brand-cyan/20 max-w-fit block">
                  Why flylocal?
                </span>
                <h4 className="font-display font-bold text-white text-base">Sabre & Amadeus Live Hub</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Compare exclusive GDS net fares side-by-side with NDC airline inventories. Lock in flight seats with zero intermediate markup fees.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2 rounded-xl bg-slate-950/30 border border-white/5">
                  <span className="text-sm font-bold text-white block">7%</span>
                  <span className="text-[8px] text-slate-400 uppercase tracking-wider block">Base Margin</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/30 border border-white/5">
                  <span className="text-sm font-bold text-brand-cyan block">1-Click</span>
                  <span className="text-[8px] text-slate-400 uppercase tracking-wider block">Ticket Voids</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/30 border border-white/5">
                  <span className="text-sm font-bold text-emerald-400 block">Instant</span>
                  <span className="text-[8px] text-slate-400 uppercase tracking-wider block">Reconcile</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Services Showcase Cards */}
      <section id="services" className="py-16 max-w-7xl mx-auto px-6 space-y-12 scroll-mt-20">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Multi-Vertical B2B Inventory
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Access direct API feeds across flight carriers, international hotels, and tour suppliers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Flights Card */}
          <div className="bg-[#021825]/80 border border-white/10 rounded-3xl p-6 bg-gradient-to-br from-[#012235]/50 to-slate-950/50 hover:border-brand-cyan/35 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/25 flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform">
              <Plane className="w-6 h-6 transform -rotate-45" />
            </div>
            <h3 className="font-display font-bold text-white text-base">GDS Flight Desk</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly search, book, and issue seats from Sabre, Amadeus, and NDC carriers. Profit from standard 7% agent commissions refunded to your wallet automatically.
            </p>
            <div className="text-[10px] font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <span>Sync latency &lt; 100ms</span>
            </div>
          </div>

          {/* Hotels Card */}
          <div className="bg-[#021825]/80 border border-white/10 rounded-3xl p-6 bg-gradient-to-br from-[#012235]/50 to-slate-950/50 hover:border-brand-cyan/35 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/25 flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-white text-base">Global Hotel Bed-Banks</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browse over 500,000 properties ranging from local luxury resorts in Cox's Bazar to Art Deco suites in London. Live room blocks, meal plans, and instant confirmations.
            </p>
            <div className="text-[10px] font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <span>Real-time Voucher Generation</span>
            </div>
          </div>

          {/* Tours Card */}
          <div className="bg-[#021825]/80 border border-white/10 rounded-3xl p-6 bg-gradient-to-br from-[#012235]/50 to-slate-950/50 hover:border-brand-cyan/35 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/25 flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-white text-base">Curated Tour Packages</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Offer pre-packaged multi-day tours with day-by-day itineraries, inclusions, meals, and private transport options. Expand your product line to increase agency profits.
            </p>
            <div className="text-[10px] font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <span>Comprehensive PDF Itineraries</span>
            </div>
          </div>
        </div>
      </section>

      {/*curated Trending Deals flight booking list cards */}
      <section id="trending-deals" className="py-20 bg-slate-950/30 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Top B2B Agent Net Fares This Week
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Compare retail rates against FlyLocal exclusive B2B Net Cost. Earn higher margins on ticket issues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingDeals.map((deal, idx) => (
              <div
                key={idx}
                className="glass-card rounded-3xl border border-white/5 hover:border-white/15 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className={`bg-gradient-to-br ${deal.gradient} p-6 space-y-4`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase tracking-wider font-bold bg-brand-cyan/15 text-brand-cyan px-2 py-0.5 rounded-full border border-brand-cyan/25">
                      {deal.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{deal.duration}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-base font-bold text-white block">{deal.from}</h4>
                      <span className="text-xs text-slate-400 font-bold bg-slate-950/60 px-1.5 py-0.5 rounded mt-1 inline-block">
                        {deal.fromCode}
                      </span>
                    </div>
                    <div className="h-0.5 flex-1 bg-white/10 mx-4 relative">
                      <Plane className="w-3.5 h-3.5 text-brand-cyan absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                    </div>
                    <div className="text-right">
                      <h4 className="text-base font-bold text-white block">{deal.to}</h4>
                      <span className="text-xs text-slate-400 font-bold bg-slate-950/60 px-1.5 py-0.5 rounded mt-1 inline-block">
                        {deal.toCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Retail Market Price:</span>
                    <span className="line-through text-slate-500">৳{deal.priceRetail.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-xs text-slate-200 font-bold">B2B Agent Net Fare:</span>
                    <span className="text-lg font-bold text-brand-cyan font-display text-glow">
                      ৳{deal.priceNet.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                      Save ৳{(deal.priceRetail - deal.priceNet).toLocaleString()} / seat
                    </span>
                    <button
                      type="button"
                      onClick={onEnterPortal}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-xs font-bold text-white flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Issue Seat</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Agency Features Showcase */}
      <section id="agency-features" className="py-20 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Engineered for B2B Agency Growth
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Take absolute control over your travel operators margins and account statements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-6 border-white/5 space-y-4 hover:border-white/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
              <Calculator className="w-5 h-5" />
            </div>
            <h4 className="font-display font-semibold text-white text-base">B2B Markup Slider</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adjust customer prices live using range sliders. Toggle fixed and percentage modes. Auto-calculate gross profit margins and GDS commissions instantly before ticketing.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border-white/5 space-y-4 hover:border-white/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-display font-semibold text-white text-base">Centralized Statement Ledger</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audit wallet transactions in real time. Submit bank deposit slips or mobile transfer details directly to get credit approvals. Generate statement balances tables.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border-white/5 space-y-4 hover:border-white/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
              <BadgePercent className="w-5 h-5" />
            </div>
            <h4 className="font-display font-semibold text-white text-base">Instant Ticket Voids</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cancel flight tickets in the queue. Auto-refund the B2B agent net cost back into your portal wallet balance minus GDS cancellation penalties immediately.
            </p>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="border-t border-white/5 py-10 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand-cyan/15 flex items-center justify-center">
              <Plane className="w-3 h-3 text-brand-cyan transform -rotate-45" />
            </div>
            <span>© 2026 FlyLocal B2B Travel Network Ltd. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Agent Agreement</span>
            <span className="hover:text-slate-400 cursor-pointer">B2B SLA Guarantee</span>
            <span className="hover:text-slate-400 cursor-pointer">Portal SLA Help</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
