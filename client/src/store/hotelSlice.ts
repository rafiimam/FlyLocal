import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Hotel, HotelSearchQuery, HotelBooking, HotelFilter } from '../data/hotelData';
import { HOTELS } from '../data/hotelData';

// ─── State Interface ────────────────────────────────────────────────

export interface HotelState {
  searchQuery: HotelSearchQuery;
  hotels: Hotel[];
  filteredHotels: Hotel[];
  selectedHotel: Hotel | null;
  selectedRoomTypeId: string | null;
  selectedRatePlanId: string | null;
  hotelBookings: HotelBooking[];
  filters: HotelFilter;
  isSearching: boolean;
  searchTriggered: boolean;
  markupType: 'fixed' | 'percentage';
  markupValue: number;
}

// ─── Default Values ─────────────────────────────────────────────────

const defaultSearchQuery: HotelSearchQuery = {
  destination: 'Dubai',
  checkIn: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  checkOut: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
  rooms: 1,
  adults: 2,
  children: 0,
};

const defaultFilters: HotelFilter = {
  starRating: null,
  priceRange: null,
  amenities: [],
  mealPlan: null,
  isRefundable: null,
  sortOrder: 'priceAsc',
};

const initialState: HotelState = {
  searchQuery: defaultSearchQuery,
  hotels: [],
  filteredHotels: [],
  selectedHotel: null,
  selectedRoomTypeId: null,
  selectedRatePlanId: null,
  hotelBookings: [],
  filters: defaultFilters,
  isSearching: false,
  searchTriggered: false,
  markupType: 'fixed',
  markupValue: 2500,
};

// ─── Filter & Sort Helper ───────────────────────────────────────────

const filterAndSortHotels = (state: HotelState) => {
  let result = [...state.hotels];

  // Star rating filter
  if (state.filters.starRating !== null) {
    result = result.filter((h) => h.starRating >= state.filters.starRating!);
  }

  // Amenities filter
  if (state.filters.amenities.length > 0) {
    result = result.filter((h) =>
      state.filters.amenities.every((amenity) => h.amenities.includes(amenity))
    );
  }

  // Meal plan filter (check any room type's rate plan)
  if (state.filters.mealPlan) {
    result = result.filter((h) =>
      h.roomTypes.some((rt) =>
        rt.ratePlans.some((rp) => rp.mealPlan === state.filters.mealPlan)
      )
    );
  }

  // Refundable filter
  if (state.filters.isRefundable !== null) {
    result = result.filter((h) =>
      h.roomTypes.some((rt) =>
        rt.ratePlans.some((rp) => rp.cancellationPolicy.isRefundable === state.filters.isRefundable)
      )
    );
  }

  // Price range filter (check lowest rate plan price)
  if (state.filters.priceRange) {
    const [min, max] = state.filters.priceRange;
    result = result.filter((h) => {
      const lowestPrice = Math.min(
        ...h.roomTypes.flatMap((rt) => rt.ratePlans.map((rp) => rp.totalPerNight))
      );
      return lowestPrice >= min && lowestPrice <= max;
    });
  }

  // Sorting
  result.sort((a, b) => {
    const priceA = Math.min(...a.roomTypes.flatMap((rt) => rt.ratePlans.map((rp) => rp.totalPerNight)));
    const priceB = Math.min(...b.roomTypes.flatMap((rt) => rt.ratePlans.map((rp) => rp.totalPerNight)));

    if (state.filters.sortOrder === 'priceAsc') return priceA - priceB;
    if (state.filters.sortOrder === 'priceDesc') return priceB - priceA;
    if (state.filters.sortOrder === 'ratingDesc') return b.starRating - a.starRating;
    if (state.filters.sortOrder === 'nameAsc') return a.name.localeCompare(b.name);
    return 0;
  });

  state.filteredHotels = result;
};

// ─── Slice ──────────────────────────────────────────────────────────

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    updateHotelSearch: (state, action: PayloadAction<Partial<HotelSearchQuery>>) => {
      state.searchQuery = { ...state.searchQuery, ...action.payload };
    },
    searchHotels: (state) => {
      // Simulate search: filter HOTELS by destination city
      const dest = state.searchQuery.destination.toLowerCase();
      const results = HOTELS.filter(
        (h) => h.city.toLowerCase().includes(dest) || h.country.toLowerCase().includes(dest)
      );
      state.hotels = results;
      filterAndSortHotels(state);
      state.isSearching = false;
      state.searchTriggered = true;
    },
    setHotels: (state, action: PayloadAction<Hotel[]>) => {
      state.hotels = action.payload;
      filterAndSortHotels(state);
    },
    setSelectedHotel: (state, action: PayloadAction<Hotel | null>) => {
      state.selectedHotel = action.payload;
      state.selectedRoomTypeId = null;
      state.selectedRatePlanId = null;
    },
    setSelectedRoom: (state, action: PayloadAction<{ roomTypeId: string; ratePlanId: string }>) => {
      state.selectedRoomTypeId = action.payload.roomTypeId;
      state.selectedRatePlanId = action.payload.ratePlanId;
    },
    updateHotelFilters: (state, action: PayloadAction<Partial<HotelFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
      filterAndSortHotels(state);
    },
    resetHotelFilters: (state) => {
      state.filters = defaultFilters;
      filterAndSortHotels(state);
    },
    addHotelBooking: (state, action: PayloadAction<HotelBooking>) => {
      state.hotelBookings = [action.payload, ...state.hotelBookings];
    },
    cancelHotelBooking: (state, action: PayloadAction<string>) => {
      state.hotelBookings = state.hotelBookings.map((b) =>
        b.id === action.payload ? { ...b, status: 'Cancelled' as const } : b
      );
    },
    setHotelSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setHotelMarkupType: (state, action: PayloadAction<'fixed' | 'percentage'>) => {
      state.markupType = action.payload;
    },
    setHotelMarkupValue: (state, action: PayloadAction<number>) => {
      state.markupValue = action.payload;
    },
  },
});

export const {
  updateHotelSearch,
  searchHotels,
  setHotels,
  setSelectedHotel,
  setSelectedRoom,
  updateHotelFilters,
  resetHotelFilters,
  addHotelBooking,
  cancelHotelBooking,
  setHotelSearching,
  setHotelMarkupType,
  setHotelMarkupValue,
} = hotelSlice.actions;

export default hotelSlice.reducer;
