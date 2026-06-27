import React from 'react';
import { useAppSelector } from '../../store';
import { TourPackageCard } from './TourPackageCard';
import { EmptyState } from '../shared/EmptyState';
import type { TourPackage } from '../../data/tourData';

interface TourPackagesListProps {
  onSelectTour: (tour: TourPackage) => void;
}

export const TourPackagesList: React.FC<TourPackagesListProps> = ({ onSelectTour }) => {
  const filteredTours = useAppSelector((state) => state.tour.filteredTours);
  const searchTriggered = useAppSelector((state) => state.tour.searchTriggered);
  const isSearching = useAppSelector((state) => state.tour.isSearching);
  const searchQuery = useAppSelector((state) => state.tour.searchQuery);

  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mb-4" />
        <span className="text-sm text-slate-400">Searching tour packages...</span>
      </div>
    );
  }

  if (!searchTriggered) {
    return null;
  }

  if (filteredTours.length === 0) {
    return (
      <EmptyState
        variant="tours"
        title="No Tours Found"
        description="No tour packages match your criteria. Try a different destination or category."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          <span className="font-bold text-white">{filteredTours.length}</span> tour packages found
          {searchQuery.destination && (
            <> in <span className="text-emerald-400 font-semibold">{searchQuery.destination}</span></>
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTours.map((tour) => (
          <TourPackageCard
            key={tour.id}
            tour={tour}
            onSelect={onSelectTour}
          />
        ))}
      </div>
    </div>
  );
};
