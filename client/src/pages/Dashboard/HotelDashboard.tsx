import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { setSelectedHotel, setSelectedRoom } from '../../store/hotelSlice';
import { HotelSearchPanel } from '../../components/hotels/HotelSearchPanel';
import { HotelResultsList } from '../../components/hotels/HotelResultsList';
import { HotelDetailModal } from '../../components/hotels/HotelDetailModal';
import { HotelCheckout } from '../../components/hotels/HotelCheckout';
import { MarkupSlider } from '../../components/MarkupSlider';
import { CheckCircle2 } from 'lucide-react';
import type { Hotel, RoomType, RatePlan } from '../../data/hotelData';

export const HotelDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedHotel = useAppSelector((state) => state.hotel.selectedHotel);
  const searchQuery = useAppSelector((state) => state.hotel.searchQuery);
  const searchTriggered = useAppSelector((state) => state.hotel.searchTriggered);
  const filteredHotels = useAppSelector((state) => state.hotel.filteredHotels);

  const [checkoutBooking, setCheckoutBooking] = useState<{
    hotel: Hotel;
    roomType: RoomType;
    ratePlan: RatePlan;
  } | null>(null);
  const [successConf, setSuccessConf] = useState<string | null>(null);

  const nights = (() => {
    const ci = new Date(searchQuery.checkIn);
    const co = new Date(searchQuery.checkOut);
    const diff = Math.ceil((co.getTime() - ci.getTime()) / 86400000);
    return diff > 0 ? diff : 1;
  })();

  const handleSelectRoom = (roomType: RoomType, ratePlan: RatePlan) => {
    dispatch(setSelectedRoom({ roomTypeId: roomType.id, ratePlanId: ratePlan.id }));
    setCheckoutBooking({
      hotel: selectedHotel!,
      roomType,
      ratePlan,
    });
    dispatch(setSelectedHotel(null)); // Close modal
  };

  const handleCheckoutSuccess = (confNum: string) => {
    setSuccessConf(confNum);
    setCheckoutBooking(null);
  };

  return (
    <div className="space-y-6">
      {successConf && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 text-center space-y-4 max-w-md mx-auto animate-in zoom-in-95 duration-300">
          <div className="w-12 h-12 rounded-full bg-emerald-500/25 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Booking Confirmed!</h3>
            <p className="text-xs text-slate-400 mt-1">
              Your hotel booking has been successfully confirmed.
            </p>
          </div>
          <div className="bg-slate-950/50 rounded-2xl p-4 text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Confirmation No:</span>
              <span className="font-bold text-white font-mono">{successConf}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="font-bold text-emerald-400">SUCCESS</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessConf(null)}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      )}

      {!checkoutBooking && !successConf && (
        <>
          <HotelSearchPanel />

          {searchTriggered && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
              {/* Sidebar */}
              {filteredHotels.length > 0 && (
                <div className="lg:col-span-4 space-y-6">
                  <MarkupSlider
                    basePrice={
                      Math.min(
                        ...filteredHotels[0].roomTypes.flatMap((rt) =>
                          rt.ratePlans.map((rp) => rp.totalPerNight)
                        )
                      ) * nights
                    }
                    tax={0} // Included or handled inside slice/markup slider
                  />
                </div>
              )}

              {/* Results List */}
              <div className={filteredHotels.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}>
                <HotelResultsList onSelectHotel={() => {}} />
              </div>
            </div>
          )}
        </>
      )}

      {checkoutBooking && !successConf && (
        <HotelCheckout
          hotel={checkoutBooking.hotel}
          roomType={checkoutBooking.roomType}
          ratePlan={checkoutBooking.ratePlan}
          nights={nights}
          rooms={searchQuery.rooms}
          onBack={() => {
            dispatch(setSelectedHotel(checkoutBooking.hotel));
            setCheckoutBooking(null);
          }}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {selectedHotel && (
        <HotelDetailModal
          hotel={selectedHotel}
          nights={nights}
          onClose={() => dispatch(setSelectedHotel(null))}
          onSelectRoom={handleSelectRoom}
        />
      )}
    </div>
  );
};
