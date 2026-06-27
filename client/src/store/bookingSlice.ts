import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Flight } from '../data/flightData';
import type { LedgerTransaction } from '../data/mockData';
import { MOCK_LEDGER } from '../data/mockData';

export interface SearchQuery {
  tripType: 'oneWay' | 'roundTrip' | 'multiCity';
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
}

export interface BookingFilter {
  stops: number | null; // null = all, 0 = direct, 1 = 1 stop, 2 = 2+ stops
  airlines: string[];   // empty = all
  refundable: boolean | null; // null = all
  sortOrder: 'priceAsc' | 'priceDesc' | 'durationAsc' | 'depTimeAsc';
}

export interface Passenger {
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  passportNumber: string;
  passportExpiry: string;
  nationality: string;
}

export interface Booking {
  id: string;
  pnr: string;
  flight: Flight;
  query: SearchQuery;
  passengers: Passenger[];
  markupApplied: number;
  totalClientPaid: number;
  agentProfit: number;
  bookingDate: string;
  status: 'Booked' | 'Ticketed' | 'Cancelled';
}

export interface BookingState {
  searchQuery: SearchQuery;
  flights: Flight[];
  filteredFlights: Flight[];
  selectedFlight: Flight | null;
  ledger: LedgerTransaction[];
  bookings: Booking[];
  filters: BookingFilter;
  markupType: 'fixed' | 'percentage';
  markupValue: number;
  commissionRate: number; // 7% base commission
  isSearching: boolean;
  searchTriggered: boolean;
}

const defaultQuery: SearchQuery = {
  tripType: 'oneWay',
  from: 'DAC',
  to: 'DXB',
  departureDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  returnDate: '',
  adults: 1,
  children: 0,
  infants: 0,
  cabinClass: 'Economy',
};

const defaultFilters: BookingFilter = {
  stops: null,
  airlines: [],
  refundable: null,
  sortOrder: 'priceAsc',
};

const initialState: BookingState = {
  searchQuery: defaultQuery,
  flights: [],
  filteredFlights: [],
  selectedFlight: null,
  ledger: MOCK_LEDGER,
  bookings: [],
  filters: defaultFilters,
  markupType: 'fixed',
  markupValue: 3000,
  commissionRate: 0.07,
  isSearching: false,
  searchTriggered: false,
};

// Helper function to filter and sort flights in slice state
const filterAndSortFlights = (state: BookingState) => {
  let result = [...state.flights];

  // Stops filter
  if (state.filters.stops !== null) {
    if (state.filters.stops === 2) {
      result = result.filter((f) => f.stops >= 2);
    } else {
      result = result.filter((f) => f.stops === state.filters.stops);
    }
  }

  // Airlines filter
  if (state.filters.airlines.length > 0) {
    result = result.filter((f) => state.filters.airlines.includes(f.airlineCode));
  }

  // Refundable filter
  if (state.filters.refundable !== null) {
    result = result.filter((f) => f.refundable === state.filters.refundable);
  }

  // Sorting
  result.sort((a, b) => {
    const priceA = a.basePrice + a.tax;
    const priceB = b.basePrice + b.tax;

    if (state.filters.sortOrder === 'priceAsc') return priceA - priceB;
    if (state.filters.sortOrder === 'priceDesc') return priceB - priceA;
    
    if (state.filters.sortOrder === 'durationAsc') {
      const durA = parseInt(a.duration.split('h')[0]) * 60 + (parseInt(a.duration.split(' ')[1] || '0') || 0);
      const durB = parseInt(b.duration.split('h')[0]) * 60 + (parseInt(b.duration.split(' ')[1] || '0') || 0);
      return durA - durB;
    }

    if (state.filters.sortOrder === 'depTimeAsc') {
      return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
    }

    return 0;
  });

  state.filteredFlights = result;
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    updateSearchQuery: (state, action: PayloadAction<Partial<SearchQuery>>) => {
      state.searchQuery = { ...state.searchQuery, ...action.payload };
    },
    setFlights: (state, action: PayloadAction<Flight[]>) => {
      state.flights = action.payload;
      filterAndSortFlights(state);
    },
    setSelectedFlight: (state, action: PayloadAction<Flight | null>) => {
      state.selectedFlight = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<BookingFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
      filterAndSortFlights(state);
    },
    resetFilters: (state) => {
      state.filters = defaultFilters;
      filterAndSortFlights(state);
    },
    setMarkupType: (state, action: PayloadAction<'fixed' | 'percentage'>) => {
      state.markupType = action.payload;
    },
    setMarkupValue: (state, action: PayloadAction<number>) => {
      state.markupValue = action.payload;
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setSearchTriggered: (state, action: PayloadAction<boolean>) => {
      state.searchTriggered = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings = [action.payload, ...state.bookings];
    },
    addLedgerTransaction: (state, action: PayloadAction<LedgerTransaction>) => {
      state.ledger = [action.payload, ...state.ledger];
    },
    voidBookingTicket: (state, action: PayloadAction<{ bookingId: string; refundAmount: number; newTxn: LedgerTransaction }>) => {
      const { bookingId, newTxn } = action.payload;
      state.bookings = state.bookings.map((b) => 
        b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b
      );
      state.ledger = [newTxn, ...state.ledger];
    },
    approvePendingDeposit: (state, action: PayloadAction<string>) => {
      const txnId = action.payload;
      state.ledger = state.ledger.map((txn) => {
        if (txn.id === txnId) {
          return { 
            ...txn, 
            status: 'Success' as const,
            balanceAfter: txn.balanceAfter + txn.amount // Update historical balance calculation
          };
        }
        return txn;
      });
    },
    adjustGlobalCommission: (state, action: PayloadAction<number>) => {
      state.commissionRate = action.payload;
    }
  },
});

export const {
  updateSearchQuery,
  setFlights,
  setSelectedFlight,
  updateFilters,
  resetFilters,
  setMarkupType,
  setMarkupValue,
  setIsSearching,
  setSearchTriggered,
  addBooking,
  addLedgerTransaction,
  voidBookingTicket,
  approvePendingDeposit,
  adjustGlobalCommission,
} = bookingSlice.actions;

export default bookingSlice.reducer;
