// ─── Hotel Domain Data ──────────────────────────────────────────────
// All hotel-related interfaces and mock data for the B2B travel platform.
// Future: Replace mock data with API calls to hotel suppliers/bed banks.

export interface HotelAmenity {
  id: string;
  name: string;
  icon: string; // lucide icon name
  category: 'general' | 'room' | 'dining' | 'wellness' | 'business';
}

export interface HotelImage {
  url: string;
  alt: string;
  category: 'exterior' | 'room' | 'dining' | 'pool' | 'lobby' | 'amenity';
}

export interface BedConfiguration {
  type: 'King' | 'Queen' | 'Twin' | 'Single' | 'Sofa Bed';
  count: number;
}

export interface CancellationPolicy {
  isRefundable: boolean;
  freeCancellationUntil: string | null; // ISO date — null if non-refundable
  penaltyPercentage: number; // % of total if cancelled after deadline
  penaltyAmount: number; // fixed amount in BDT
  description: string;
}

export interface RatePlan {
  id: string;
  roomTypeId: string;
  name: string;
  currency: string;
  basePricePerNight: number;
  taxPerNight: number;
  totalPerNight: number;
  mealPlan: 'Room Only' | 'Bed & Breakfast' | 'Half Board' | 'Full Board' | 'All Inclusive';
  cancellationPolicy: CancellationPolicy;
  inclusions: string[];
  validFrom: string;
  validTo: string;
  minStay: number;
  maxStay: number;
  availableRooms: number;
}

export interface RoomType {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  maxOccupancy: number;
  maxAdults: number;
  maxChildren: number;
  bedConfigurations: BedConfiguration[];
  roomSizeSqm: number;
  amenities: string[];
  images: string[];
  ratePlans: RatePlan[];
}

export interface Hotel {
  id: string;
  name: string;
  starRating: number;
  city: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  amenities: string[];
  images: string[];
  checkInTime: string;
  checkOutTime: string;
  contactEmail: string;
  contactPhone: string;
  supplierCode: string;
  roomTypes: RoomType[];
}

export interface HotelSearchQuery {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
}

export interface HotelBooking {
  id: string;
  confirmationNumber: string;
  hotel: Hotel;
  roomType: RoomType;
  ratePlan: RatePlan;
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  totalBasePrice: number;
  totalTax: number;
  markupApplied: number;
  totalClientPaid: number;
  agentProfit: number;
  bookingDate: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Checked In' | 'Checked Out';
}

export interface HotelFilter {
  starRating: number | null;
  priceRange: [number, number] | null;
  amenities: string[];
  mealPlan: string | null;
  isRefundable: boolean | null;
  sortOrder: 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'nameAsc';
}

// ─── Static Reference Data ──────────────────────────────────────────

export const HOTEL_AMENITIES_LIST: string[] = [
  'Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Restaurant',
  'Room Service', 'Bar/Lounge', 'Airport Shuttle', 'Parking', 'Business Center',
  'Concierge', 'Laundry Service', 'Kids Club', 'Beach Access', 'Rooftop Terrace',
  'Conference Room', 'Valet Parking', 'Pet Friendly', '24h Reception', 'EV Charging'
];

export const POPULAR_HOTEL_DESTINATIONS: { city: string; country: string; code: string }[] = [
  { city: 'Dubai', country: 'United Arab Emirates', code: 'DXB' },
  { city: 'Singapore', country: 'Singapore', code: 'SIN' },
  { city: 'Bangkok', country: 'Thailand', code: 'BKK' },
  { city: 'London', country: 'United Kingdom', code: 'LON' },
  { city: "Cox's Bazar", country: 'Bangladesh', code: 'CXB' },
  { city: 'Kuala Lumpur', country: 'Malaysia', code: 'KUL' },
  { city: 'Tokyo', country: 'Japan', code: 'TYO' },
  { city: 'Sydney', country: 'Australia', code: 'SYD' },
  { city: 'Dhaka', country: 'Bangladesh', code: 'DAC' },
  { city: 'Istanbul', country: 'Turkey', code: 'IST' },
];

// ─── Helper: Relative Date ──────────────────────────────────────────

const getRelativeDate = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

// ─── Mock Hotels ────────────────────────────────────────────────────

export const HOTELS: Hotel[] = [
  {
    id: 'HTL-001',
    name: 'Jumeirah Beach Hotel',
    starRating: 5,
    city: 'Dubai',
    country: 'United Arab Emirates',
    address: 'Jumeirah Beach Road, Umm Suqeim 3, Dubai',
    latitude: 25.1412,
    longitude: 55.1855,
    description: 'An iconic wave-shaped 5-star beachfront resort overlooking the Arabian Gulf. Features a private beach, 19 restaurants, Wild Wadi Waterpark access, and panoramic views of Burj Al Arab.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Restaurant', 'Room Service', 'Bar/Lounge', 'Beach Access', 'Kids Club', 'Concierge', 'Valet Parking', 'Business Center'],
    images: ['/hotels/jumeirah-1.jpg', '/hotels/jumeirah-2.jpg'],
    checkInTime: '15:00',
    checkOutTime: '12:00',
    contactEmail: 'reservations@jumeirah.com',
    contactPhone: '+971 4 348 0000',
    supplierCode: 'AMZ-DXB-001',
    roomTypes: [
      {
        id: 'RT-001-A',
        hotelId: 'HTL-001',
        name: 'Ocean Deluxe Room',
        description: 'Spacious room with breathtaking Arabian Gulf views, marble bathroom, and private balcony.',
        maxOccupancy: 3,
        maxAdults: 2,
        maxChildren: 1,
        bedConfigurations: [{ type: 'King', count: 1 }],
        roomSizeSqm: 48,
        amenities: ['Ocean View', 'Mini Bar', 'Smart TV', 'Rain Shower', 'Balcony', 'Safe'],
        images: ['/hotels/jumeirah-room-1.jpg'],
        ratePlans: [
          {
            id: 'RP-001-A1',
            roomTypeId: 'RT-001-A',
            name: 'B2B Net — Room Only',
            currency: 'BDT',
            basePricePerNight: 28500,
            taxPerNight: 5700,
            totalPerNight: 34200,
            mealPlan: 'Room Only',
            cancellationPolicy: {
              isRefundable: true,
              freeCancellationUntil: getRelativeDate(5),
              penaltyPercentage: 100,
              penaltyAmount: 0,
              description: 'Free cancellation until 48h before check-in. Full charge after.'
            },
            inclusions: ['Free WiFi', 'Wild Wadi Waterpark access', 'Beach access'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 1,
            maxStay: 30,
            availableRooms: 6
          },
          {
            id: 'RP-001-A2',
            roomTypeId: 'RT-001-A',
            name: 'B2B Net — Bed & Breakfast',
            currency: 'BDT',
            basePricePerNight: 33800,
            taxPerNight: 6760,
            totalPerNight: 40560,
            mealPlan: 'Bed & Breakfast',
            cancellationPolicy: {
              isRefundable: true,
              freeCancellationUntil: getRelativeDate(5),
              penaltyPercentage: 100,
              penaltyAmount: 0,
              description: 'Free cancellation until 48h before check-in.'
            },
            inclusions: ['Free WiFi', 'Breakfast buffet', 'Wild Wadi access', 'Beach access'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 1,
            maxStay: 30,
            availableRooms: 4
          }
        ]
      },
      {
        id: 'RT-001-B',
        hotelId: 'HTL-001',
        name: 'Presidential Suite',
        description: 'Ultra-luxury suite with separate living area, private dining room, panoramic ocean views, and butler service.',
        maxOccupancy: 4,
        maxAdults: 3,
        maxChildren: 2,
        bedConfigurations: [{ type: 'King', count: 1 }, { type: 'Sofa Bed', count: 1 }],
        roomSizeSqm: 145,
        amenities: ['Ocean View', 'Butler Service', 'Private Dining', 'Jacuzzi', 'Walk-in Closet', 'Smart TV', 'Grand Piano'],
        images: ['/hotels/jumeirah-suite-1.jpg'],
        ratePlans: [
          {
            id: 'RP-001-B1',
            roomTypeId: 'RT-001-B',
            name: 'B2B Net — All Inclusive',
            currency: 'BDT',
            basePricePerNight: 125000,
            taxPerNight: 25000,
            totalPerNight: 150000,
            mealPlan: 'All Inclusive',
            cancellationPolicy: {
              isRefundable: true,
              freeCancellationUntil: getRelativeDate(7),
              penaltyPercentage: 50,
              penaltyAmount: 0,
              description: 'Free cancellation 72h before check-in. 50% charge after.'
            },
            inclusions: ['All meals', 'Premium beverages', 'Butler service', 'Airport transfer', 'Spa credit ৳15,000'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 2,
            maxStay: 14,
            availableRooms: 1
          }
        ]
      }
    ]
  },
  {
    id: 'HTL-002',
    name: 'Marina Bay Sands',
    starRating: 5,
    city: 'Singapore',
    country: 'Singapore',
    address: '10 Bayfront Avenue, Singapore 018956',
    latitude: 1.2834,
    longitude: 103.8607,
    description: 'The world-famous integrated resort featuring the iconic SkyPark infinity pool, world-class casino, shopping mall, and convention center on Marina Bay.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Restaurant', 'Room Service', 'Bar/Lounge', 'Business Center', 'Concierge', 'Rooftop Terrace', 'Parking'],
    images: ['/hotels/mbs-1.jpg', '/hotels/mbs-2.jpg'],
    checkInTime: '15:00',
    checkOutTime: '11:00',
    contactEmail: 'reservations@marinabaysands.com',
    contactPhone: '+65 6688 8868',
    supplierCode: 'AMZ-SIN-001',
    roomTypes: [
      {
        id: 'RT-002-A',
        hotelId: 'HTL-002',
        name: 'Deluxe City View Room',
        description: 'Modern room with floor-to-ceiling windows overlooking the Singapore skyline and Gardens by the Bay.',
        maxOccupancy: 3,
        maxAdults: 2,
        maxChildren: 1,
        bedConfigurations: [{ type: 'King', count: 1 }],
        roomSizeSqm: 39,
        amenities: ['City View', 'SkyPark Access', 'Mini Bar', 'Smart TV', 'Rain Shower'],
        images: ['/hotels/mbs-room-1.jpg'],
        ratePlans: [
          {
            id: 'RP-002-A1',
            roomTypeId: 'RT-002-A',
            name: 'B2B Net — Room Only',
            currency: 'BDT',
            basePricePerNight: 32000,
            taxPerNight: 6400,
            totalPerNight: 38400,
            mealPlan: 'Room Only',
            cancellationPolicy: {
              isRefundable: true,
              freeCancellationUntil: getRelativeDate(3),
              penaltyPercentage: 100,
              penaltyAmount: 0,
              description: 'Free cancellation 24h before check-in.'
            },
            inclusions: ['SkyPark Infinity Pool access', 'Free WiFi'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 1,
            maxStay: 14,
            availableRooms: 8
          },
          {
            id: 'RP-002-A2',
            roomTypeId: 'RT-002-A',
            name: 'B2B Net — Bed & Breakfast',
            currency: 'BDT',
            basePricePerNight: 37500,
            taxPerNight: 7500,
            totalPerNight: 45000,
            mealPlan: 'Bed & Breakfast',
            cancellationPolicy: {
              isRefundable: false,
              freeCancellationUntil: null,
              penaltyPercentage: 100,
              penaltyAmount: 0,
              description: 'Non-refundable. Best price guaranteed.'
            },
            inclusions: ['SkyPark access', 'Breakfast at RISE restaurant', 'Free WiFi'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 2,
            maxStay: 14,
            availableRooms: 5
          }
        ]
      },
      {
        id: 'RT-002-B',
        hotelId: 'HTL-002',
        name: 'Sands Premier Suite',
        description: 'Lavish suite with panoramic bay views, separate living room, and exclusive Club access with complimentary cocktails.',
        maxOccupancy: 4,
        maxAdults: 3,
        maxChildren: 2,
        bedConfigurations: [{ type: 'King', count: 1 }, { type: 'Sofa Bed', count: 1 }],
        roomSizeSqm: 82,
        amenities: ['Bay View', 'Club Lounge Access', 'Living Room', 'Jacuzzi Tub', 'Smart TV', 'Nespresso Machine'],
        images: ['/hotels/mbs-suite-1.jpg'],
        ratePlans: [
          {
            id: 'RP-002-B1',
            roomTypeId: 'RT-002-B',
            name: 'B2B Net — Half Board',
            currency: 'BDT',
            basePricePerNight: 78000,
            taxPerNight: 15600,
            totalPerNight: 93600,
            mealPlan: 'Half Board',
            cancellationPolicy: {
              isRefundable: true,
              freeCancellationUntil: getRelativeDate(5),
              penaltyPercentage: 50,
              penaltyAmount: 0,
              description: 'Free cancellation 48h before. 50% penalty after.'
            },
            inclusions: ['Breakfast & Dinner', 'Club Lounge access', 'Airport transfer', 'SkyPark'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 2,
            maxStay: 14,
            availableRooms: 2
          }
        ]
      }
    ]
  },
  {
    id: 'HTL-003',
    name: 'Centara Grand at Central World',
    starRating: 5,
    city: 'Bangkok',
    country: 'Thailand',
    address: '999/99 Rama I Road, Pathumwan, Bangkok 10330',
    latitude: 13.7465,
    longitude: 100.5395,
    description: 'A luxury urban resort in the heart of Bangkok, directly connected to Central World shopping complex. Features a stunning rooftop bar, spa, and multiple dining venues.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Restaurant', 'Room Service', 'Bar/Lounge', 'Business Center', 'Rooftop Terrace', 'Concierge'],
    images: ['/hotels/centara-1.jpg'],
    checkInTime: '14:00',
    checkOutTime: '12:00',
    contactEmail: 'reservations@centara.com',
    contactPhone: '+66 2 100 1234',
    supplierCode: 'AMZ-BKK-001',
    roomTypes: [
      {
        id: 'RT-003-A',
        hotelId: 'HTL-003',
        name: 'Superior World Room',
        description: 'Contemporary room with city skyline views, complimentary mini bar, and direct mall access.',
        maxOccupancy: 2,
        maxAdults: 2,
        maxChildren: 1,
        bedConfigurations: [{ type: 'King', count: 1 }],
        roomSizeSqm: 38,
        amenities: ['City View', 'Mini Bar', 'Smart TV', 'Bathtub', 'Free Minibar'],
        images: ['/hotels/centara-room-1.jpg'],
        ratePlans: [
          {
            id: 'RP-003-A1',
            roomTypeId: 'RT-003-A',
            name: 'B2B Net — Bed & Breakfast',
            currency: 'BDT',
            basePricePerNight: 11200,
            taxPerNight: 2240,
            totalPerNight: 13440,
            mealPlan: 'Bed & Breakfast',
            cancellationPolicy: {
              isRefundable: true,
              freeCancellationUntil: getRelativeDate(3),
              penaltyPercentage: 100,
              penaltyAmount: 0,
              description: 'Free cancellation 24h before check-in.'
            },
            inclusions: ['Breakfast buffet', 'Pool access', 'Free WiFi', 'Complimentary minibar'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 1,
            maxStay: 30,
            availableRooms: 15
          }
        ]
      },
      {
        id: 'RT-003-B',
        hotelId: 'HTL-003',
        name: 'Club Suite',
        description: 'Executive suite with Club access, separate living area, and evening cocktail hour.',
        maxOccupancy: 3,
        maxAdults: 2,
        maxChildren: 1,
        bedConfigurations: [{ type: 'King', count: 1 }],
        roomSizeSqm: 65,
        amenities: ['Club Lounge', 'Living Room', 'City View', 'Nespresso', 'Smart TV', 'Walk-in Shower'],
        images: ['/hotels/centara-suite-1.jpg'],
        ratePlans: [
          {
            id: 'RP-003-B1',
            roomTypeId: 'RT-003-B',
            name: 'B2B Net — Full Board',
            currency: 'BDT',
            basePricePerNight: 24000,
            taxPerNight: 4800,
            totalPerNight: 28800,
            mealPlan: 'Full Board',
            cancellationPolicy: {
              isRefundable: true,
              freeCancellationUntil: getRelativeDate(5),
              penaltyPercentage: 50,
              penaltyAmount: 0,
              description: 'Free cancellation 48h before. 50% penalty after.'
            },
            inclusions: ['All meals', 'Club Lounge access', 'Evening cocktails', 'Pool access'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 2,
            maxStay: 14,
            availableRooms: 4
          }
        ]
      }
    ]
  },
  {
    id: 'HTL-004',
    name: 'The Savoy London',
    starRating: 5,
    city: 'London',
    country: 'United Kingdom',
    address: 'Strand, London WC2R 0EZ, United Kingdom',
    latitude: 51.5103,
    longitude: -0.1204,
    description: 'A legendary Art Deco luxury hotel on the Strand, overlooking the Thames. Home to the world-famous American Bar, Kaspar\'s seafood restaurant, and a rich history of hosting royalty and celebrities.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Restaurant', 'Room Service', 'Bar/Lounge', 'Business Center', 'Concierge', 'Valet Parking', 'Laundry Service'],
    images: ['/hotels/savoy-1.jpg'],
    checkInTime: '15:00',
    checkOutTime: '12:00',
    contactEmail: 'savoy@fairmont.com',
    contactPhone: '+44 20 7836 4343',
    supplierCode: 'AMZ-LON-001',
    roomTypes: [
      {
        id: 'RT-004-A',
        hotelId: 'HTL-004',
        name: 'Superior Queen Room',
        description: 'Elegantly appointed room with Art Deco furnishings, marble bathroom, and classic London charm.',
        maxOccupancy: 2,
        maxAdults: 2,
        maxChildren: 0,
        bedConfigurations: [{ type: 'Queen', count: 1 }],
        roomSizeSqm: 28,
        amenities: ['City View', 'Mini Bar', 'Smart TV', 'Marble Bathroom', 'Luxury Toiletries'],
        images: ['/hotels/savoy-room-1.jpg'],
        ratePlans: [
          {
            id: 'RP-004-A1',
            roomTypeId: 'RT-004-A',
            name: 'B2B Net — Bed & Breakfast',
            currency: 'BDT',
            basePricePerNight: 52000,
            taxPerNight: 10400,
            totalPerNight: 62400,
            mealPlan: 'Bed & Breakfast',
            cancellationPolicy: {
              isRefundable: true,
              freeCancellationUntil: getRelativeDate(5),
              penaltyPercentage: 100,
              penaltyAmount: 0,
              description: 'Free cancellation until 48h before check-in.'
            },
            inclusions: ['English breakfast', 'Free WiFi', 'Pool & Spa access'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 1,
            maxStay: 14,
            availableRooms: 5
          }
        ]
      }
    ]
  },
  {
    id: 'HTL-005',
    name: 'Royal Tulip Sea Pearl Beach Resort',
    starRating: 5,
    city: "Cox's Bazar",
    country: 'Bangladesh',
    address: 'Inani Road, Cox\'s Bazar 4700, Bangladesh',
    latitude: 21.4272,
    longitude: 92.0058,
    description: 'A stunning beachfront resort on the world\'s longest natural sea beach. Features infinity pool, private beach, multiple restaurants, and traditional Bengali spa treatments.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Restaurant', 'Room Service', 'Beach Access', 'Kids Club', 'Parking', 'Airport Shuttle', 'Concierge'],
    images: ['/hotels/seapearl-1.jpg'],
    checkInTime: '14:00',
    checkOutTime: '12:00',
    contactEmail: 'reservations@seapearlbeach.com',
    contactPhone: '+880 341 63333',
    supplierCode: 'LOCAL-CXB-001',
    roomTypes: [
      {
        id: 'RT-005-A',
        hotelId: 'HTL-005',
        name: 'Ocean View Deluxe',
        description: 'Spacious room with panoramic Bay of Bengal views, private balcony, and modern Bengali-inspired decor.',
        maxOccupancy: 3,
        maxAdults: 2,
        maxChildren: 1,
        bedConfigurations: [{ type: 'King', count: 1 }],
        roomSizeSqm: 42,
        amenities: ['Ocean View', 'Balcony', 'Mini Bar', 'Smart TV', 'Rain Shower'],
        images: ['/hotels/seapearl-room-1.jpg'],
        ratePlans: [
          {
            id: 'RP-005-A1',
            roomTypeId: 'RT-005-A',
            name: 'B2B Net — Half Board',
            currency: 'BDT',
            basePricePerNight: 8500,
            taxPerNight: 1700,
            totalPerNight: 10200,
            mealPlan: 'Half Board',
            cancellationPolicy: {
              isRefundable: true,
              freeCancellationUntil: getRelativeDate(2),
              penaltyPercentage: 50,
              penaltyAmount: 0,
              description: 'Free cancellation 24h before. 50% charge after.'
            },
            inclusions: ['Breakfast & Dinner', 'Pool access', 'Beach access', 'Free WiFi'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 1,
            maxStay: 30,
            availableRooms: 12
          },
          {
            id: 'RP-005-A2',
            roomTypeId: 'RT-005-A',
            name: 'B2B Net — All Inclusive',
            currency: 'BDT',
            basePricePerNight: 12000,
            taxPerNight: 2400,
            totalPerNight: 14400,
            mealPlan: 'All Inclusive',
            cancellationPolicy: {
              isRefundable: false,
              freeCancellationUntil: null,
              penaltyPercentage: 100,
              penaltyAmount: 0,
              description: 'Non-refundable. Best value rate.'
            },
            inclusions: ['All meals', 'Soft beverages', 'Pool & Beach', 'Spa discount 20%', 'Free WiFi'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 2,
            maxStay: 14,
            availableRooms: 8
          }
        ]
      },
      {
        id: 'RT-005-B',
        hotelId: 'HTL-005',
        name: 'Royal Beach Villa',
        description: 'Private beachfront villa with plunge pool, outdoor deck, and personal butler service.',
        maxOccupancy: 4,
        maxAdults: 2,
        maxChildren: 2,
        bedConfigurations: [{ type: 'King', count: 1 }, { type: 'Twin', count: 1 }],
        roomSizeSqm: 95,
        amenities: ['Private Beach', 'Plunge Pool', 'Butler Service', 'Outdoor Deck', 'Mini Kitchen'],
        images: ['/hotels/seapearl-villa-1.jpg'],
        ratePlans: [
          {
            id: 'RP-005-B1',
            roomTypeId: 'RT-005-B',
            name: 'B2B Net — All Inclusive Villa',
            currency: 'BDT',
            basePricePerNight: 25000,
            taxPerNight: 5000,
            totalPerNight: 30000,
            mealPlan: 'All Inclusive',
            cancellationPolicy: {
              isRefundable: true,
              freeCancellationUntil: getRelativeDate(7),
              penaltyPercentage: 100,
              penaltyAmount: 0,
              description: 'Free cancellation 72h before. Full charge after.'
            },
            inclusions: ['All meals', 'All beverages', 'Butler service', 'Private beach section', 'Airport transfer'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 3,
            maxStay: 14,
            availableRooms: 2
          }
        ]
      }
    ]
  },
  {
    id: 'HTL-006',
    name: 'Shangri-La Kuala Lumpur',
    starRating: 5,
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    address: '11 Jalan Sultan Ismail, 50250 Kuala Lumpur',
    latitude: 3.1537,
    longitude: 101.7119,
    description: 'Iconic luxury hotel in the heart of KL\'s Golden Triangle, overlooking KLCC park and Petronas Twin Towers. World-class dining, expansive spa, and tropical gardens.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Restaurant', 'Room Service', 'Bar/Lounge', 'Business Center', 'Concierge', 'Parking'],
    images: ['/hotels/shangrila-kl-1.jpg'],
    checkInTime: '15:00',
    checkOutTime: '12:00',
    contactEmail: 'slkl@shangri-la.com',
    contactPhone: '+60 3 2032 2388',
    supplierCode: 'AMZ-KUL-001',
    roomTypes: [
      {
        id: 'RT-006-A',
        hotelId: 'HTL-006',
        name: 'Deluxe Twin Towers View',
        description: 'Luxurious room with direct views of Petronas Towers and KLCC park from floor-to-ceiling windows.',
        maxOccupancy: 3,
        maxAdults: 2,
        maxChildren: 1,
        bedConfigurations: [{ type: 'King', count: 1 }],
        roomSizeSqm: 40,
        amenities: ['Tower View', 'Mini Bar', 'Smart TV', 'Marble Bathroom', 'Bathrobe & Slippers'],
        images: ['/hotels/shangrila-kl-room-1.jpg'],
        ratePlans: [
          {
            id: 'RP-006-A1',
            roomTypeId: 'RT-006-A',
            name: 'B2B Net — Bed & Breakfast',
            currency: 'BDT',
            basePricePerNight: 16500,
            taxPerNight: 3300,
            totalPerNight: 19800,
            mealPlan: 'Bed & Breakfast',
            cancellationPolicy: {
              isRefundable: true,
              freeCancellationUntil: getRelativeDate(3),
              penaltyPercentage: 100,
              penaltyAmount: 0,
              description: 'Free cancellation 24h before check-in.'
            },
            inclusions: ['Breakfast', 'Pool access', 'Gym access', 'Free WiFi'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 1,
            maxStay: 21,
            availableRooms: 10
          }
        ]
      }
    ]
  },
  {
    id: 'HTL-007',
    name: 'Pan Pacific Dhaka',
    starRating: 5,
    city: 'Dhaka',
    country: 'Bangladesh',
    address: 'Sonargaon Road, Dhaka 1205, Bangladesh',
    latitude: 23.7461,
    longitude: 90.3937,
    description: 'The premier luxury hotel in Dhaka\'s diplomatic zone. Features international dining, executive club lounge, outdoor pool, and a prime location near Gulshan business district.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Restaurant', 'Room Service', 'Bar/Lounge', 'Business Center', 'Concierge', 'Parking', 'Airport Shuttle', '24h Reception'],
    images: ['/hotels/panpacific-dhaka-1.jpg'],
    checkInTime: '14:00',
    checkOutTime: '12:00',
    contactEmail: 'enquiry.ppdh@panpacific.com',
    contactPhone: '+880 2 8432 111',
    supplierCode: 'LOCAL-DAC-001',
    roomTypes: [
      {
        id: 'RT-007-A',
        hotelId: 'HTL-007',
        name: 'Pacific Deluxe Room',
        description: 'Well-appointed room with city views, work desk, and modern amenities in Dhaka\'s finest address.',
        maxOccupancy: 2,
        maxAdults: 2,
        maxChildren: 1,
        bedConfigurations: [{ type: 'King', count: 1 }],
        roomSizeSqm: 35,
        amenities: ['City View', 'Mini Bar', 'Smart TV', 'Work Desk', 'Rain Shower'],
        images: ['/hotels/panpacific-room-1.jpg'],
        ratePlans: [
          {
            id: 'RP-007-A1',
            roomTypeId: 'RT-007-A',
            name: 'B2B Net — Bed & Breakfast',
            currency: 'BDT',
            basePricePerNight: 9500,
            taxPerNight: 1900,
            totalPerNight: 11400,
            mealPlan: 'Bed & Breakfast',
            cancellationPolicy: {
              isRefundable: true,
              freeCancellationUntil: getRelativeDate(1),
              penaltyPercentage: 100,
              penaltyAmount: 0,
              description: 'Free cancellation same day until 18:00.'
            },
            inclusions: ['Breakfast', 'Pool access', 'Gym access', 'Free WiFi', 'Airport shuttle'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 1,
            maxStay: 30,
            availableRooms: 20
          }
        ]
      },
      {
        id: 'RT-007-B',
        hotelId: 'HTL-007',
        name: 'Pacific Club Suite',
        description: 'Spacious suite with club lounge access, separate living area, and panoramic Dhaka skyline views.',
        maxOccupancy: 3,
        maxAdults: 2,
        maxChildren: 1,
        bedConfigurations: [{ type: 'King', count: 1 }],
        roomSizeSqm: 60,
        amenities: ['Club Lounge', 'Living Room', 'City View', 'Bathtub', 'Nespresso', 'Smart TV'],
        images: ['/hotels/panpacific-suite-1.jpg'],
        ratePlans: [
          {
            id: 'RP-007-B1',
            roomTypeId: 'RT-007-B',
            name: 'B2B Net — Full Board Club',
            currency: 'BDT',
            basePricePerNight: 18000,
            taxPerNight: 3600,
            totalPerNight: 21600,
            mealPlan: 'Full Board',
            cancellationPolicy: {
              isRefundable: true,
              freeCancellationUntil: getRelativeDate(3),
              penaltyPercentage: 50,
              penaltyAmount: 0,
              description: 'Free cancellation 24h before. 50% after.'
            },
            inclusions: ['All meals', 'Club Lounge access', 'Evening cocktails', 'Pool & Gym', 'Airport shuttle'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 1,
            maxStay: 14,
            availableRooms: 5
          }
        ]
      }
    ]
  },
  {
    id: 'HTL-008',
    name: 'Aman Tokyo',
    starRating: 5,
    city: 'Tokyo',
    country: 'Japan',
    address: 'The Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku, Tokyo',
    latitude: 35.6867,
    longitude: 139.7651,
    description: 'Ultra-luxury minimalist retreat in the sky above Tokyo\'s financial district. Blends Japanese ryokan tradition with modern sophistication across the top six floors of Otemachi Tower.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Restaurant', 'Room Service', 'Bar/Lounge', 'Business Center', 'Concierge', 'Valet Parking'],
    images: ['/hotels/aman-tokyo-1.jpg'],
    checkInTime: '15:00',
    checkOutTime: '12:00',
    contactEmail: 'amantokyo@aman.com',
    contactPhone: '+81 3 5224 3333',
    supplierCode: 'AMZ-TYO-001',
    roomTypes: [
      {
        id: 'RT-008-A',
        hotelId: 'HTL-008',
        name: 'Deluxe Room — Imperial Garden View',
        description: 'Zen-inspired room with traditional Japanese elements, deep soaking tub, and stunning Imperial Palace garden views.',
        maxOccupancy: 2,
        maxAdults: 2,
        maxChildren: 0,
        bedConfigurations: [{ type: 'King', count: 1 }],
        roomSizeSqm: 71,
        amenities: ['Garden View', 'Deep Soaking Tub', 'Tatami Area', 'Smart TV', 'Japanese Tea Set', 'Yukata'],
        images: ['/hotels/aman-tokyo-room-1.jpg'],
        ratePlans: [
          {
            id: 'RP-008-A1',
            roomTypeId: 'RT-008-A',
            name: 'B2B Net — Room Only',
            currency: 'BDT',
            basePricePerNight: 85000,
            taxPerNight: 17000,
            totalPerNight: 102000,
            mealPlan: 'Room Only',
            cancellationPolicy: {
              isRefundable: true,
              freeCancellationUntil: getRelativeDate(7),
              penaltyPercentage: 100,
              penaltyAmount: 0,
              description: 'Free cancellation 72h before check-in.'
            },
            inclusions: ['Free WiFi', 'Spa access', 'Pool access', 'Japanese tea ceremony'],
            validFrom: getRelativeDate(0),
            validTo: getRelativeDate(90),
            minStay: 1,
            maxStay: 14,
            availableRooms: 3
          }
        ]
      }
    ]
  }
];
