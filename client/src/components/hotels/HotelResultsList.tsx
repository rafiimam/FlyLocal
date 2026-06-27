import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { setSelectedHotel } from '../../store/hotelSlice';
import { HotelResultCard } from './HotelResultCard';
import { EmptyState } from '../shared/EmptyState';
import type { Hotel } from '../../data/hotelData';

interface HotelResultsListProps {
  onSelectHotel: (hotel: Hotel) => void;
}

export const HotelResultsList: React.FC<HotelResultsListProps> = ({ onSelectHotel }) => {
  const dispatch = useAppDispatch();
  const filteredHotels = useAppSelector((state) => state.hotel.filteredHotels);
  const searchTriggered = useAppSelector((state) => state.hotel.searchTriggered);
  const isSearching = useAppSelector((state) => state.hotel.isSearching);
  const searchQuery = useAppSelector((state) => state.hotel.searchQuery);

  const nights = (() => {
    const ci = new Date(searchQuery.checkIn);
    const co = new Date(searchQuery.checkOut);
    const diff = Math.ceil((co.getTime() - ci.getTime()) / 86400000);
    return diff > 0 ? diff : 1;
  })();

  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
        <span className="text-sm text-slate-400">Searching hotel inventory...</span>
      </div>
    );
  }

  if (!searchTriggered) {
    return null;
  }

  if (filteredHotels.length === 0) {
    return (
      <EmptyState
        variant="hotels"
        title="No Hotels Found"
        description="No hotels match your search criteria. Try a different destination or adjust your dates."
      />
    );
  }

  const handleSelect = (hotel: Hotel) => {
    dispatch(setSelectedHotel(hotel));
    onSelectHotel(hotel);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          <span className="font-bold text-white">{filteredHotels.length}</span> hotels found in{' '}
          <span className="text-amber-400 font-semibold">{searchQuery.destination}</span>
        </span>
        <span className="text-[10px] text-slate-500">{nights} night{nights > 1 ? 's' : ''} · {searchQuery.rooms} room{searchQuery.rooms > 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHotels.map((hotel) => (
          <HotelResultCard
            key={hotel.id}
            hotel={hotel}
            onSelect={handleSelect}
            nights={nights}
          />
        ))}
      </div>
    </div>
  );
};
