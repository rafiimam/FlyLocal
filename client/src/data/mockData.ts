// ─── Shared Data & Re-Exports ───────────────────────────────────────
// Central data hub that re-exports domain-specific data and contains shared types.
// Future: Replace with API endpoints. Imports here serve as the single source of truth.

// Re-export all flight domain types and data
export type { Airport, Airline, FlightSegment, Flight } from './flightData';
export { AIRPORTS, AIRLINES, FLIGHTS } from './flightData';

// Re-export all hotel domain types and data
export type {
  HotelAmenity, HotelImage, BedConfiguration, CancellationPolicy,
  RatePlan, RoomType, Hotel, HotelSearchQuery, HotelBooking, HotelFilter
} from './hotelData';
export { HOTELS, HOTEL_AMENITIES_LIST, POPULAR_HOTEL_DESTINATIONS } from './hotelData';

// Re-export all tour domain types and data
export type {
  TourActivity, TourMeal, TourItinerary, TourPricing,
  TourPackage, TourSearchQuery, TourBooking, TourFilter
} from './tourData';
export { TOUR_PACKAGES, TOUR_CATEGORIES, POPULAR_TOUR_DESTINATIONS } from './tourData';

// ─── Shared Types ───────────────────────────────────────────────────

export type ServiceType = 'flights' | 'hotels' | 'tours';

export type TransactionType =
  | 'Deposit'
  | 'Issue Ticket'
  | 'Void Ticket'
  | 'Refund'
  | 'Hotel Booking'
  | 'Hotel Cancellation'
  | 'Tour Booking'
  | 'Tour Cancellation';

export interface LedgerTransaction {
  id: string;
  ref: string;
  date: string;
  type: TransactionType;
  description: string;
  amount: number;
  balanceAfter: number;
  status: 'Success' | 'Pending' | 'Failed';
  serviceType?: ServiceType; // Which vertical this belongs to
}

// ─── Mock Ledger (Shared Across Verticals) ──────────────────────────

export const MOCK_LEDGER: LedgerTransaction[] = [
  {
    id: 'TXN-101',
    ref: 'DEP-77301',
    date: '2026-06-15T09:30:00Z',
    type: 'Deposit',
    description: 'Bank Transfer Deposit Approved - Standard Chartered',
    amount: 500000,
    balanceAfter: 500000,
    status: 'Success',
  },
  {
    id: 'TXN-102',
    ref: 'PNR-EK585Z',
    date: '2026-06-16T14:15:00Z',
    type: 'Issue Ticket',
    description: 'Ticket Issued for PNR EK585Z (DAC-DXB, Pax: Rahman/Anisur)',
    amount: -50500,
    balanceAfter: 449500,
    status: 'Success',
    serviceType: 'flights',
  },
  {
    id: 'TXN-103',
    ref: 'PNR-SQ449A',
    date: '2026-06-17T11:02:00Z',
    type: 'Issue Ticket',
    description: 'Ticket Issued for PNR SQ449A (DAC-SIN, Pax: Islam/Kamrul)',
    amount: -47100,
    balanceAfter: 402400,
    status: 'Success',
    serviceType: 'flights',
  },
  {
    id: 'TXN-104',
    ref: 'REF-88301',
    date: '2026-06-18T16:40:00Z',
    type: 'Refund',
    description: 'Refund processed for PNR SQ449A (Refund penalty BDT 4,000)',
    amount: 43100,
    balanceAfter: 445500,
    status: 'Success',
    serviceType: 'flights',
  },
  {
    id: 'TXN-105',
    ref: 'DEP-77421',
    date: '2026-06-19T08:00:00Z',
    type: 'Deposit',
    description: 'Mobile Financial Services (bKash) Deposit Auto-Approved',
    amount: 150000,
    balanceAfter: 595500,
    status: 'Success',
  },
  {
    id: 'TXN-106',
    ref: 'DEP-77501',
    date: '2026-06-20T12:00:00Z',
    type: 'Deposit',
    description: 'Bank Deposit Request - City Bank',
    amount: 250000,
    balanceAfter: 595500,
    status: 'Pending',
  },
  {
    id: 'TXN-107',
    ref: 'HTL-MBS-4421',
    date: '2026-06-21T10:30:00Z',
    type: 'Hotel Booking',
    description: 'Hotel Booking: Marina Bay Sands, Singapore (2 nights, 1 room)',
    amount: -76800,
    balanceAfter: 518700,
    status: 'Success',
    serviceType: 'hotels',
  },
  {
    id: 'TXN-108',
    ref: 'TOUR-DXB-8822',
    date: '2026-06-22T15:45:00Z',
    type: 'Tour Booking',
    description: 'Tour Booking: Dubai Luxury City Experience (2 Adults)',
    amount: -163200,
    balanceAfter: 355500,
    status: 'Success',
    serviceType: 'tours',
  },
];
