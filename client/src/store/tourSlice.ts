import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TourPackage, TourSearchQuery, TourBooking, TourFilter } from '../data/tourData';
import { TOUR_PACKAGES } from '../data/tourData';

// ─── State Interface ────────────────────────────────────────────────

export interface TourState {
  searchQuery: TourSearchQuery;
  tours: TourPackage[];
  filteredTours: TourPackage[];
  selectedTour: TourPackage | null;
  tourBookings: TourBooking[];
  filters: TourFilter;
  isSearching: boolean;
  searchTriggered: boolean;
  markupType: 'fixed' | 'percentage';
  markupValue: number;
}

// ─── Default Values ─────────────────────────────────────────────────

const defaultSearchQuery: TourSearchQuery = {
  destination: '',
  startDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  travelers: 2,
  category: '',
  duration: '',
};

const defaultFilters: TourFilter = {
  category: null,
  priceRange: null,
  duration: null,
  difficulty: null,
  sortOrder: 'priceAsc',
};

const initialState: TourState = {
  searchQuery: defaultSearchQuery,
  tours: [],
  filteredTours: [],
  selectedTour: null,
  tourBookings: [],
  filters: defaultFilters,
  isSearching: false,
  searchTriggered: false,
  markupType: 'fixed',
  markupValue: 3000,
};

// ─── Filter & Sort Helper ───────────────────────────────────────────

const filterAndSortTours = (state: TourState) => {
  let result = [...state.tours];

  // Category filter
  if (state.filters.category) {
    result = result.filter((t) => t.category === state.filters.category);
  }

  // Difficulty filter
  if (state.filters.difficulty) {
    result = result.filter((t) => t.difficulty === state.filters.difficulty);
  }

  // Duration filter
  if (state.filters.duration) {
    const dur = state.filters.duration;
    result = result.filter((t) => {
      if (dur === '1-3') return t.durationDays >= 1 && t.durationDays <= 3;
      if (dur === '4-7') return t.durationDays >= 4 && t.durationDays <= 7;
      if (dur === '8-14') return t.durationDays >= 8 && t.durationDays <= 14;
      if (dur === '15+') return t.durationDays >= 15;
      return true;
    });
  }

  // Price range filter (adult price)
  if (state.filters.priceRange) {
    const [min, max] = state.filters.priceRange;
    result = result.filter((t) => {
      const adultPrice = t.pricing.find((p) => p.priceType === 'Adult');
      if (!adultPrice) return false;
      return adultPrice.totalPrice >= min && adultPrice.totalPrice <= max;
    });
  }

  // Sorting
  result.sort((a, b) => {
    const priceA = a.pricing.find((p) => p.priceType === 'Adult')?.totalPrice ?? 0;
    const priceB = b.pricing.find((p) => p.priceType === 'Adult')?.totalPrice ?? 0;

    if (state.filters.sortOrder === 'priceAsc') return priceA - priceB;
    if (state.filters.sortOrder === 'priceDesc') return priceB - priceA;
    if (state.filters.sortOrder === 'durationAsc') return a.durationDays - b.durationDays;
    if (state.filters.sortOrder === 'ratingDesc') return b.rating - a.rating;
    return 0;
  });

  state.filteredTours = result;
};

// ─── Slice ──────────────────────────────────────────────────────────

const tourSlice = createSlice({
  name: 'tour',
  initialState,
  reducers: {
    updateTourSearch: (state, action: PayloadAction<Partial<TourSearchQuery>>) => {
      state.searchQuery = { ...state.searchQuery, ...action.payload };
    },
    searchTours: (state) => {
      // Simulate search: filter by destination and category
      const dest = state.searchQuery.destination.toLowerCase();
      const cat = state.searchQuery.category;
      
      let results = [...TOUR_PACKAGES];
      
      if (dest) {
        results = results.filter(
          (t) =>
            t.destination.toLowerCase().includes(dest) ||
            t.country.toLowerCase().includes(dest)
        );
      }
      
      if (cat) {
        results = results.filter((t) => t.category === cat);
      }

      // Duration filter from search query
      if (state.searchQuery.duration) {
        const dur = state.searchQuery.duration;
        results = results.filter((t) => {
          if (dur === '1-3') return t.durationDays >= 1 && t.durationDays <= 3;
          if (dur === '4-7') return t.durationDays >= 4 && t.durationDays <= 7;
          if (dur === '8-14') return t.durationDays >= 8 && t.durationDays <= 14;
          if (dur === '15+') return t.durationDays >= 15;
          return true;
        });
      }

      state.tours = results;
      filterAndSortTours(state);
      state.isSearching = false;
      state.searchTriggered = true;
    },
    setTours: (state, action: PayloadAction<TourPackage[]>) => {
      state.tours = action.payload;
      filterAndSortTours(state);
    },
    setSelectedTour: (state, action: PayloadAction<TourPackage | null>) => {
      state.selectedTour = action.payload;
    },
    updateTourFilters: (state, action: PayloadAction<Partial<TourFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
      filterAndSortTours(state);
    },
    resetTourFilters: (state) => {
      state.filters = defaultFilters;
      filterAndSortTours(state);
    },
    addTourBooking: (state, action: PayloadAction<TourBooking>) => {
      state.tourBookings = [action.payload, ...state.tourBookings];
    },
    cancelTourBooking: (state, action: PayloadAction<string>) => {
      state.tourBookings = state.tourBookings.map((b) =>
        b.id === action.payload ? { ...b, status: 'Cancelled' as const } : b
      );
    },
    setTourSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setTourMarkupType: (state, action: PayloadAction<'fixed' | 'percentage'>) => {
      state.markupType = action.payload;
    },
    setTourMarkupValue: (state, action: PayloadAction<number>) => {
      state.markupValue = action.payload;
    },
  },
});

export const {
  updateTourSearch,
  searchTours,
  setTours,
  setSelectedTour,
  updateTourFilters,
  resetTourFilters,
  addTourBooking,
  cancelTourBooking,
  setTourSearching,
  setTourMarkupType,
  setTourMarkupValue,
} = tourSlice.actions;

export default tourSlice.reducer;
