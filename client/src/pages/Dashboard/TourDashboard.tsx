import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { setSelectedTour } from '../../store/tourSlice';
import { TourSearchPanel } from '../../components/tours/TourSearchPanel';
import { TourPackagesList } from '../../components/tours/TourPackagesList';
import { TourDetailModal } from '../../components/tours/TourDetailModal';
import { TourCheckout } from '../../components/tours/TourCheckout';
import { MarkupSlider } from '../../components/MarkupSlider';
import { CheckCircle2 } from 'lucide-react';
import type { TourPackage } from '../../data/tourData';

export const TourDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedTour = useAppSelector((state) => state.tour.selectedTour);
  const searchTriggered = useAppSelector((state) => state.tour.searchTriggered);
  const filteredTours = useAppSelector((state) => state.tour.filteredTours);

  const [checkoutConfig, setCheckoutConfig] = useState<{
    tour: TourPackage;
    startDate: string;
    adultsCount: number;
    childrenCount: number;
    singleSupplement: boolean;
  } | null>(null);
  
  const [successConf, setSuccessConf] = useState<string | null>(null);

  const handleSelectBooking = (date: string, adults: number, children: number, singleSupp: boolean) => {
    setCheckoutConfig({
      tour: selectedTour!,
      startDate: date,
      adultsCount: adults,
      childrenCount: children,
      singleSupplement: singleSupp,
    });
    dispatch(setSelectedTour(null)); // Close modal
  };

  const handleCheckoutSuccess = (confNum: string) => {
    setSuccessConf(confNum);
    setCheckoutConfig(null);
  };

  return (
    <div className="space-y-6">
      {successConf && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 text-center space-y-4 max-w-md mx-auto animate-in zoom-in-95 duration-300">
          <div className="w-12 h-12 rounded-full bg-emerald-500/25 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Tour Package Booked!</h3>
            <p className="text-xs text-slate-400 mt-1">
              Your tour booking has been successfully confirmed.
            </p>
          </div>
          <div className="bg-slate-950/50 rounded-2xl p-4 text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Booking Reference:</span>
              <span className="font-bold text-white font-mono">{successConf}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="font-bold text-emerald-400">CONFIRMED</span>
            </div>
          </div>
          <button
            onClick={() => setSuccessConf(null)}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      )}

      {!checkoutConfig && !successConf && (
        <>
          <TourSearchPanel />

          {searchTriggered && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
              {/* Sidebar */}
              {filteredTours.length > 0 && (
                <div className="lg:col-span-4 space-y-6">
                  <MarkupSlider
                    basePrice={
                      filteredTours[0].pricing.find((p) => p.priceType === 'Adult')?.totalPrice ?? 0
                    }
                    tax={0}
                  />
                </div>
              )}

              {/* Results List */}
              <div className={filteredTours.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}>
                <TourPackagesList onSelectTour={(tour) => dispatch(setSelectedTour(tour))} />
              </div>
            </div>
          )}
        </>
      )}

      {checkoutConfig && !successConf && (
        <TourCheckout
          tour={checkoutConfig.tour}
          startDate={checkoutConfig.startDate}
          adultsCount={checkoutConfig.adultsCount}
          childrenCount={checkoutConfig.childrenCount}
          singleSupplement={checkoutConfig.singleSupplement}
          onBack={() => {
            dispatch(setSelectedTour(checkoutConfig.tour));
            setCheckoutConfig(null);
          }}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {selectedTour && (
        <TourDetailModal
          tour={selectedTour}
          onClose={() => dispatch(setSelectedTour(null))}
          onSelectBooking={handleSelectBooking}
        />
      )}
    </div>
  );
};
