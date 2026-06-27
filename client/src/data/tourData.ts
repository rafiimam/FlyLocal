// ─── Tour Domain Data ───────────────────────────────────────────────
// All tour-related interfaces and mock data for the B2B travel platform.
// Future: Replace mock data with API calls to tour operators.

export interface TourActivity {
  id: string;
  name: string;
  description: string;
  location: string;
  durationHours: number;
  type: 'Sightseeing' | 'Adventure' | 'Cultural' | 'Food & Drink' | 'Transport' | 'Relaxation' | 'Shopping' | 'Wildlife';
}

export interface TourMeal {
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  venue: string;
  description: string;
}

export interface TourItinerary {
  id: string;
  packageId: string;
  dayNumber: number;
  title: string;
  description: string;
  activities: TourActivity[];
  meals: TourMeal[];
  accommodation: string;
  transportMode: string;
}

export interface TourPricing {
  id: string;
  packageId: string;
  priceType: 'Adult' | 'Child (5-11)' | 'Infant (0-4)' | 'Single Supplement';
  basePrice: number;
  tax: number;
  totalPrice: number;
  currency: string;
  seasonType: 'Peak' | 'Off-Peak' | 'Shoulder';
  validFrom: string;
  validTo: string;
}

export interface TourPackage {
  id: string;
  name: string;
  description: string;
  destination: string;
  country: string;
  durationDays: number;
  durationNights: number;
  category: 'Adventure' | 'Cultural' | 'Beach' | 'Luxury' | 'City Break' | 'Wildlife' | 'Heritage';
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  images: string[];
  groupSizeMin: number;
  groupSizeMax: number;
  departureCity: string;
  languages: string[];
  itinerary: TourItinerary[];
  pricing: TourPricing[];
  availableDates: string[];
  supplierCode: string;
  rating: number;
  reviewCount: number;
}

export interface TourSearchQuery {
  destination: string;
  startDate: string;
  travelers: number;
  category: string;
  duration: string; // '1-3', '4-7', '8-14', '15+'
}

export interface TourBooking {
  id: string;
  confirmationNumber: string;
  tourPackage: TourPackage;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  leadTravelerName: string;
  leadTravelerEmail: string;
  leadTravelerPhone: string;
  specialRequests: string;
  totalBasePrice: number;
  totalTax: number;
  markupApplied: number;
  totalClientPaid: number;
  agentProfit: number;
  bookingDate: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
}

export interface TourFilter {
  category: string | null;
  priceRange: [number, number] | null;
  duration: string | null;
  difficulty: string | null;
  sortOrder: 'priceAsc' | 'priceDesc' | 'durationAsc' | 'ratingDesc';
}

// ─── Static Reference Data ──────────────────────────────────────────

export const TOUR_CATEGORIES: string[] = [
  'Adventure', 'Cultural', 'Beach', 'Luxury', 'City Break', 'Wildlife', 'Heritage'
];

export const POPULAR_TOUR_DESTINATIONS: { destination: string; country: string }[] = [
  { destination: "Cox's Bazar", country: 'Bangladesh' },
  { destination: 'Sundarbans', country: 'Bangladesh' },
  { destination: 'Dubai', country: 'United Arab Emirates' },
  { destination: 'Singapore', country: 'Singapore' },
  { destination: 'Bali', country: 'Indonesia' },
  { destination: 'Bangkok & Pattaya', country: 'Thailand' },
  { destination: 'Kashmir', country: 'India' },
  { destination: 'Maldives', country: 'Maldives' },
  { destination: 'Istanbul', country: 'Turkey' },
  { destination: 'Nepal', country: 'Nepal' },
];

// ─── Helper: Relative Date ──────────────────────────────────────────

const getRelativeDate = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

const generateDepartureDates = (startOffset: number, count: number): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < count; i++) {
    dates.push(getRelativeDate(startOffset + i * 7)); // Weekly departures
  }
  return dates;
};

// ─── Mock Tour Packages ─────────────────────────────────────────────

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'TOUR-001',
    name: "Cox's Bazar Beach Getaway",
    description: "Experience the world's longest natural sea beach with this curated 4-day getaway. Enjoy pristine beaches, local seafood, Buddhist temples, and the stunning Inani Beach coral formations.",
    destination: "Cox's Bazar",
    country: 'Bangladesh',
    durationDays: 4,
    durationNights: 3,
    category: 'Beach',
    difficulty: 'Easy',
    highlights: [
      "World's longest natural sea beach",
      'Inani Beach coral formations',
      'Himchari waterfall trek',
      'Buddhist monastery visit',
      'Fresh seafood dining experience',
      'Sunset cruise on Bakkhali River'
    ],
    inclusions: [
      'Return flights (DAC-CXB)',
      '3 nights beachfront hotel',
      'Daily breakfast & dinner',
      'Airport transfers',
      'Local guide',
      'Himchari & Inani tour',
      'Sunset river cruise'
    ],
    exclusions: [
      'Lunch',
      'Personal expenses',
      'Tips & gratuities',
      'Travel insurance',
      'Optional water sports'
    ],
    images: ['/tours/coxs-bazar-1.jpg', '/tours/coxs-bazar-2.jpg'],
    groupSizeMin: 2,
    groupSizeMax: 20,
    departureCity: 'Dhaka',
    languages: ['English', 'Bengali'],
    itinerary: [
      {
        id: 'IT-001-1',
        packageId: 'TOUR-001',
        dayNumber: 1,
        title: 'Arrival & Beach Welcome',
        description: 'Fly from Dhaka to Cox\'s Bazar. Transfer to beachfront resort. Evening beach walk and welcome dinner with local seafood.',
        activities: [
          { id: 'ACT-001-1-1', name: 'Airport Transfer', description: 'Private transfer from CXB airport to resort', location: "Cox's Bazar Airport", durationHours: 0.5, type: 'Transport' },
          { id: 'ACT-001-1-2', name: 'Beach Walk & Orientation', description: 'Guided walk along Laboni beach with sunset views', location: 'Laboni Beach', durationHours: 1.5, type: 'Sightseeing' },
          { id: 'ACT-001-1-3', name: 'Welcome Dinner', description: 'Fresh seafood dinner at resort restaurant', location: 'Resort Restaurant', durationHours: 1.5, type: 'Food & Drink' }
        ],
        meals: [
          { type: 'Dinner', venue: 'Resort Restaurant', description: 'Welcome dinner with local seafood specialties' }
        ],
        accommodation: 'Royal Tulip Sea Pearl Beach Resort',
        transportMode: 'Flight + Private Car'
      },
      {
        id: 'IT-001-2',
        packageId: 'TOUR-001',
        dayNumber: 2,
        title: 'Inani Beach & Himchari Exploration',
        description: 'Full day exploring the stunning coral formations at Inani Beach followed by a trek to Himchari National Park and its famous waterfall.',
        activities: [
          { id: 'ACT-001-2-1', name: 'Inani Beach Tour', description: 'Explore unique coral rock formations and crystal-clear tide pools', location: 'Inani Beach', durationHours: 3, type: 'Sightseeing' },
          { id: 'ACT-001-2-2', name: 'Himchari Waterfall Trek', description: 'Light trek through national park to the cascading waterfall', location: 'Himchari National Park', durationHours: 2.5, type: 'Adventure' },
          { id: 'ACT-001-2-3', name: 'Local Market Visit', description: 'Browse Burmese Market for local crafts and dried fish', location: 'Burmese Market', durationHours: 1, type: 'Shopping' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Resort', description: 'Buffet breakfast' },
          { type: 'Dinner', venue: 'Local Restaurant', description: 'Bengali cuisine dinner' }
        ],
        accommodation: 'Royal Tulip Sea Pearl Beach Resort',
        transportMode: 'Private Car + Walking'
      },
      {
        id: 'IT-001-3',
        packageId: 'TOUR-001',
        dayNumber: 3,
        title: 'Buddhist Heritage & Sunset Cruise',
        description: 'Visit ancient Buddhist monasteries and temples, then enjoy a magical sunset cruise on the Bakkhali River.',
        activities: [
          { id: 'ACT-001-3-1', name: 'Ramu Buddhist Monastery', description: 'Visit one of the oldest Buddhist monasteries in Bangladesh', location: 'Ramu', durationHours: 2, type: 'Cultural' },
          { id: 'ACT-001-3-2', name: 'Aggmeda Khyang Temple', description: 'Explore the ornate wooden Buddhist temple', location: 'Ramu', durationHours: 1, type: 'Cultural' },
          { id: 'ACT-001-3-3', name: 'Sunset River Cruise', description: 'Scenic cruise on Bakkhali River with tea and snacks', location: 'Bakkhali River', durationHours: 2, type: 'Sightseeing' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Resort', description: 'Buffet breakfast' },
          { type: 'Dinner', venue: 'Resort', description: 'Farewell BBQ dinner on the beach' }
        ],
        accommodation: 'Royal Tulip Sea Pearl Beach Resort',
        transportMode: 'Private Car + Boat'
      },
      {
        id: 'IT-001-4',
        packageId: 'TOUR-001',
        dayNumber: 4,
        title: 'Departure Day',
        description: 'Leisurely breakfast, last morning walk on the beach, and transfer to Cox\'s Bazar Airport for return flight.',
        activities: [
          { id: 'ACT-001-4-1', name: 'Morning Beach Walk', description: 'Final sunrise walk along the beach', location: 'Laboni Beach', durationHours: 1, type: 'Relaxation' },
          { id: 'ACT-001-4-2', name: 'Airport Transfer', description: 'Private transfer to airport', location: 'Hotel to CXB Airport', durationHours: 0.5, type: 'Transport' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Resort', description: 'Buffet breakfast' }
        ],
        accommodation: 'N/A — Departure',
        transportMode: 'Private Car + Flight'
      }
    ],
    pricing: [
      { id: 'TP-001-A', packageId: 'TOUR-001', priceType: 'Adult', basePrice: 25000, tax: 5000, totalPrice: 30000, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
      { id: 'TP-001-B', packageId: 'TOUR-001', priceType: 'Child (5-11)', basePrice: 18000, tax: 3600, totalPrice: 21600, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
      { id: 'TP-001-C', packageId: 'TOUR-001', priceType: 'Infant (0-4)', basePrice: 5000, tax: 1000, totalPrice: 6000, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
    ],
    availableDates: generateDepartureDates(7, 8),
    supplierCode: 'FLY-TOUR-BD',
    rating: 4.6,
    reviewCount: 284
  },
  {
    id: 'TOUR-002',
    name: 'Sundarbans Mangrove Safari',
    description: "Venture into the world's largest mangrove forest and UNESCO World Heritage Site. Track the elusive Royal Bengal Tiger, spot exotic wildlife, and cruise through mysterious tidal waterways.",
    destination: 'Sundarbans',
    country: 'Bangladesh',
    durationDays: 3,
    durationNights: 2,
    category: 'Wildlife',
    difficulty: 'Moderate',
    highlights: [
      'UNESCO World Heritage mangrove forest',
      'Royal Bengal Tiger territory safari',
      'Spotted deer and crocodile sighting',
      'Overnight on traditional houseboat',
      'Karamjal Wildlife Centre',
      'Local fishermen village visit'
    ],
    inclusions: [
      'Launch cruise from Mongla',
      '2 nights on luxury houseboat',
      'All meals onboard',
      'Forest entry permits',
      'Armed forest guide',
      'Wildlife spotting boat trips',
      'Karamjal Centre visit'
    ],
    exclusions: [
      'Transport to Mongla (from Dhaka)',
      'Personal expenses',
      'Tips',
      'Travel insurance',
      'Camera permits for commercial use'
    ],
    images: ['/tours/sundarbans-1.jpg', '/tours/sundarbans-2.jpg'],
    groupSizeMin: 4,
    groupSizeMax: 16,
    departureCity: 'Khulna',
    languages: ['English', 'Bengali'],
    itinerary: [
      {
        id: 'IT-002-1', packageId: 'TOUR-002', dayNumber: 1,
        title: 'Embarkation & Forest Entry',
        description: 'Board the luxury houseboat from Mongla port. Cruise into the Sundarbans through Pasur River. First wildlife spotting session.',
        activities: [
          { id: 'ACT-002-1-1', name: 'Houseboat Embarkation', description: 'Board at Mongla Ghat', location: 'Mongla Port', durationHours: 1, type: 'Transport' },
          { id: 'ACT-002-1-2', name: 'Karamjal Wildlife Centre', description: 'Visit crocodile breeding centre and deer habitat', location: 'Karamjal', durationHours: 2, type: 'Sightseeing' },
          { id: 'ACT-002-1-3', name: 'Sunset Wildlife Spotting', description: 'Spot kingfishers, monitor lizards, and deer from the boat deck', location: 'Pasur River', durationHours: 1.5, type: 'Sightseeing' }
        ],
        meals: [
          { type: 'Lunch', venue: 'Houseboat', description: 'Traditional Bengali fish curry' },
          { type: 'Dinner', venue: 'Houseboat', description: 'Grilled river fish and rice' }
        ],
        accommodation: 'Luxury Houseboat (Private Cabin)',
        transportMode: 'Houseboat'
      },
      {
        id: 'IT-002-2', packageId: 'TOUR-002', dayNumber: 2,
        title: 'Deep Forest Tiger Territory',
        description: 'Full-day exploration of tiger territory. Guided walks on forest trails with armed rangers. Visit a fishing village.',
        activities: [
          { id: 'ACT-002-2-1', name: 'Dawn Safari Walk', description: 'Guided forest walk in tiger territory with armed rangers', location: 'Kotka Forest', durationHours: 3, type: 'Adventure' },
          { id: 'ACT-002-2-2', name: 'Fishing Village Visit', description: 'Meet local honey collectors and fishermen', location: 'Dublar Char', durationHours: 2, type: 'Cultural' },
          { id: 'ACT-002-2-3', name: 'Night Safari', description: 'Spot nocturnal wildlife from the boat with spotlights', location: 'Sundarbans Waterways', durationHours: 1.5, type: 'Adventure' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Houseboat', description: 'Full breakfast' },
          { type: 'Lunch', venue: 'Houseboat', description: 'Bengali lunch' },
          { type: 'Dinner', venue: 'Houseboat', description: 'BBQ on deck' }
        ],
        accommodation: 'Luxury Houseboat (Private Cabin)',
        transportMode: 'Houseboat + Walking'
      },
      {
        id: 'IT-002-3', packageId: 'TOUR-002', dayNumber: 3,
        title: 'Final Cruise & Departure',
        description: 'Early morning birdwatching cruise. Final wildlife spotting. Return to Mongla port by noon.',
        activities: [
          { id: 'ACT-002-3-1', name: 'Dawn Birdwatching', description: 'Spot rare species from the observation deck', location: 'Sundarbans', durationHours: 2, type: 'Sightseeing' },
          { id: 'ACT-002-3-2', name: 'Return Cruise', description: 'Scenic return through the delta channels', location: 'Pasur River', durationHours: 3, type: 'Transport' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Houseboat', description: 'Full breakfast' },
          { type: 'Lunch', venue: 'Houseboat', description: 'Farewell lunch' }
        ],
        accommodation: 'N/A — Departure',
        transportMode: 'Houseboat'
      }
    ],
    pricing: [
      { id: 'TP-002-A', packageId: 'TOUR-002', priceType: 'Adult', basePrice: 22000, tax: 4400, totalPrice: 26400, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
      { id: 'TP-002-B', packageId: 'TOUR-002', priceType: 'Child (5-11)', basePrice: 15000, tax: 3000, totalPrice: 18000, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
    ],
    availableDates: generateDepartureDates(10, 6),
    supplierCode: 'FLY-TOUR-BD',
    rating: 4.8,
    reviewCount: 192
  },
  {
    id: 'TOUR-003',
    name: 'Dubai Luxury City Experience',
    description: 'An opulent 5-day Dubai city tour including Burj Khalifa, desert safari, Dubai Marina yacht cruise, shopping at Dubai Mall, and traditional Dhow dinner cruise.',
    destination: 'Dubai',
    country: 'United Arab Emirates',
    durationDays: 5,
    durationNights: 4,
    category: 'Luxury',
    difficulty: 'Easy',
    highlights: [
      'Burj Khalifa 148th floor observation',
      'Desert safari with BBQ dinner',
      'Dubai Marina luxury yacht cruise',
      'Gold Souk & Spice Market tour',
      'The Palm Jumeirah & Atlantis',
      'Traditional Dhow dinner cruise'
    ],
    inclusions: [
      '4 nights 5-star hotel',
      'Daily breakfast',
      'Airport transfers',
      'Burj Khalifa At The Top ticket',
      'Desert safari with BBQ',
      'Dubai city tour',
      'Dhow dinner cruise',
      'English-speaking guide'
    ],
    exclusions: [
      'International flights',
      'Visa fees',
      'Lunch & dinner (except mentioned)',
      'Personal expenses',
      'Travel insurance',
      'Shopping expenses'
    ],
    images: ['/tours/dubai-1.jpg', '/tours/dubai-2.jpg'],
    groupSizeMin: 2,
    groupSizeMax: 15,
    departureCity: 'Dubai',
    languages: ['English', 'Arabic', 'Bengali'],
    itinerary: [
      {
        id: 'IT-003-1', packageId: 'TOUR-003', dayNumber: 1,
        title: 'Arrival & Dubai Marina Evening',
        description: 'Arrive at DXB, hotel check-in, evening stroll at Dubai Marina Walk, and welcome dinner at a waterfront restaurant.',
        activities: [
          { id: 'ACT-003-1-1', name: 'Airport VIP Transfer', description: 'Private luxury vehicle transfer to hotel', location: 'DXB Airport', durationHours: 1, type: 'Transport' },
          { id: 'ACT-003-1-2', name: 'Dubai Marina Walk', description: 'Evening walk along the stunning Marina promenade', location: 'Dubai Marina', durationHours: 2, type: 'Sightseeing' }
        ],
        meals: [
          { type: 'Dinner', venue: 'Marina Waterfront Restaurant', description: 'Welcome dinner with views of Ain Dubai' }
        ],
        accommodation: 'Jumeirah Beach Hotel',
        transportMode: 'Private Luxury Vehicle'
      },
      {
        id: 'IT-003-2', packageId: 'TOUR-003', dayNumber: 2,
        title: 'Iconic Dubai City Tour',
        description: 'Full-day tour covering Burj Khalifa, Dubai Mall, Old Dubai souks, and Jumeirah Mosque.',
        activities: [
          { id: 'ACT-003-2-1', name: 'Burj Khalifa At The Top', description: 'Visit the 148th floor observation deck', location: 'Burj Khalifa', durationHours: 2, type: 'Sightseeing' },
          { id: 'ACT-003-2-2', name: 'Dubai Mall & Fountain Show', description: 'Shopping and spectacular water & light fountain show', location: 'Dubai Mall', durationHours: 2.5, type: 'Shopping' },
          { id: 'ACT-003-2-3', name: 'Old Dubai Heritage Tour', description: 'Visit Gold Souk, Spice Souk, and Abra boat ride across Creek', location: 'Deira', durationHours: 2.5, type: 'Cultural' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Hotel', description: 'Buffet breakfast' }
        ],
        accommodation: 'Jumeirah Beach Hotel',
        transportMode: 'Private Vehicle + Walking'
      },
      {
        id: 'IT-003-3', packageId: 'TOUR-003', dayNumber: 3,
        title: 'Desert Safari Adventure',
        description: 'Thrilling desert dune bashing, camel rides, sandboarding, and a spectacular BBQ dinner under the stars with belly dancing entertainment.',
        activities: [
          { id: 'ACT-003-3-1', name: 'Dune Bashing', description: 'Exhilarating 4x4 ride over the desert dunes', location: 'Dubai Desert', durationHours: 1.5, type: 'Adventure' },
          { id: 'ACT-003-3-2', name: 'Camel Ride & Sandboarding', description: 'Traditional camel ride and sandboarding on the dunes', location: 'Desert Camp', durationHours: 1.5, type: 'Adventure' },
          { id: 'ACT-003-3-3', name: 'Desert BBQ & Entertainment', description: 'BBQ dinner with belly dancing, tanoura, and fire shows', location: 'Desert Camp', durationHours: 3, type: 'Food & Drink' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Hotel', description: 'Buffet breakfast' },
          { type: 'Dinner', venue: 'Desert Camp', description: 'BBQ under the stars' }
        ],
        accommodation: 'Jumeirah Beach Hotel',
        transportMode: '4x4 Safari Vehicle'
      },
      {
        id: 'IT-003-4', packageId: 'TOUR-003', dayNumber: 4,
        title: 'Palm Jumeirah & Dhow Cruise',
        description: 'Visit The Palm and Atlantis hotel, afternoon at leisure, and evening traditional Dhow dinner cruise along Dubai Creek.',
        activities: [
          { id: 'ACT-003-4-1', name: 'Palm Jumeirah Tour', description: 'Explore The Palm island and Atlantis hotel lobby', location: 'Palm Jumeirah', durationHours: 2, type: 'Sightseeing' },
          { id: 'ACT-003-4-2', name: 'Dhow Dinner Cruise', description: 'Traditional wooden dhow cruise with dinner and live entertainment', location: 'Dubai Creek', durationHours: 2.5, type: 'Food & Drink' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Hotel', description: 'Buffet breakfast' },
          { type: 'Dinner', venue: 'Dhow Boat', description: 'Multi-course dinner with live music' }
        ],
        accommodation: 'Jumeirah Beach Hotel',
        transportMode: 'Private Vehicle + Dhow Boat'
      },
      {
        id: 'IT-003-5', packageId: 'TOUR-003', dayNumber: 5,
        title: 'Departure',
        description: 'Leisurely breakfast, last-minute shopping, and airport transfer.',
        activities: [
          { id: 'ACT-003-5-1', name: 'Airport Transfer', description: 'Private luxury vehicle to DXB airport', location: 'Hotel to DXB', durationHours: 1, type: 'Transport' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Hotel', description: 'Buffet breakfast' }
        ],
        accommodation: 'N/A — Departure',
        transportMode: 'Private Luxury Vehicle'
      }
    ],
    pricing: [
      { id: 'TP-003-A', packageId: 'TOUR-003', priceType: 'Adult', basePrice: 68000, tax: 13600, totalPrice: 81600, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
      { id: 'TP-003-B', packageId: 'TOUR-003', priceType: 'Child (5-11)', basePrice: 48000, tax: 9600, totalPrice: 57600, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
      { id: 'TP-003-C', packageId: 'TOUR-003', priceType: 'Single Supplement', basePrice: 32000, tax: 6400, totalPrice: 38400, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
    ],
    availableDates: generateDepartureDates(5, 10),
    supplierCode: 'FLY-TOUR-INT',
    rating: 4.7,
    reviewCount: 458
  },
  {
    id: 'TOUR-004',
    name: 'Singapore Explorer',
    description: 'A vibrant 4-day city exploration covering Gardens by the Bay, Sentosa Island, cultural neighbourhoods, and the best street food in Southeast Asia.',
    destination: 'Singapore',
    country: 'Singapore',
    durationDays: 4,
    durationNights: 3,
    category: 'City Break',
    difficulty: 'Easy',
    highlights: [
      'Gardens by the Bay Supertree Grove',
      'Sentosa Island adventure day',
      'Marina Bay Sands SkyPark view',
      'Chinatown & Little India food trail',
      'Night Safari at Singapore Zoo',
      'Clarke Quay riverside dining'
    ],
    inclusions: [
      '3 nights 4-star hotel',
      'Daily breakfast',
      'Airport transfers',
      'Gardens by the Bay ticket',
      'Sentosa Island day pass',
      'Night Safari ticket',
      'Local food trail guide',
      'All local transport'
    ],
    exclusions: [
      'International flights',
      'Visa (if applicable)',
      'Lunch & dinner (except food trail)',
      'Personal expenses',
      'Travel insurance'
    ],
    images: ['/tours/singapore-1.jpg', '/tours/singapore-2.jpg'],
    groupSizeMin: 2,
    groupSizeMax: 20,
    departureCity: 'Singapore',
    languages: ['English', 'Bengali', 'Mandarin'],
    itinerary: [
      {
        id: 'IT-004-1', packageId: 'TOUR-004', dayNumber: 1,
        title: 'Arrival & Marina Bay Evening',
        description: 'Arrive in Singapore, check in, and spend the evening at Marina Bay with the spectacular light and water show.',
        activities: [
          { id: 'ACT-004-1-1', name: 'Airport Transfer', description: 'Private transfer from Changi Airport', location: 'Changi Airport', durationHours: 0.5, type: 'Transport' },
          { id: 'ACT-004-1-2', name: 'Marina Bay Evening Walk', description: 'Merlion, Helix Bridge, and Spectra light show', location: 'Marina Bay', durationHours: 2, type: 'Sightseeing' }
        ],
        meals: [],
        accommodation: 'Park Hotel Clarke Quay',
        transportMode: 'Private Car + MRT'
      },
      {
        id: 'IT-004-2', packageId: 'TOUR-004', dayNumber: 2,
        title: 'Gardens by the Bay & Cultural Neighbourhoods',
        description: 'Morning at Gardens by the Bay, afternoon exploring Chinatown and Little India with a guided food trail.',
        activities: [
          { id: 'ACT-004-2-1', name: 'Gardens by the Bay', description: 'Supertree Grove, Cloud Forest, and Flower Dome', location: 'Gardens by the Bay', durationHours: 3, type: 'Sightseeing' },
          { id: 'ACT-004-2-2', name: 'Chinatown Food Trail', description: 'Guided hawker food tasting — Hainanese chicken rice, laksa, char kway teow', location: 'Chinatown', durationHours: 2, type: 'Food & Drink' },
          { id: 'ACT-004-2-3', name: 'Little India Walk', description: 'Explore vibrant streets, Sri Veeramakaliamman Temple', location: 'Little India', durationHours: 1.5, type: 'Cultural' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Hotel', description: 'Buffet breakfast' },
          { type: 'Lunch', venue: 'Chinatown hawkers', description: 'Guided food trail (included)' }
        ],
        accommodation: 'Park Hotel Clarke Quay',
        transportMode: 'MRT + Walking'
      },
      {
        id: 'IT-004-3', packageId: 'TOUR-004', dayNumber: 3,
        title: 'Sentosa Island & Night Safari',
        description: 'Full day at Sentosa Island — beaches, Universal Studios area, cable car. Evening at Singapore Night Safari.',
        activities: [
          { id: 'ACT-004-3-1', name: 'Sentosa Island Day', description: 'Cable car ride, Siloso Beach, S.E.A. Aquarium', location: 'Sentosa Island', durationHours: 5, type: 'Adventure' },
          { id: 'ACT-004-3-2', name: 'Night Safari', description: 'Tram ride through nocturnal animal habitats', location: 'Singapore Zoo', durationHours: 2.5, type: 'Wildlife' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Hotel', description: 'Buffet breakfast' }
        ],
        accommodation: 'Park Hotel Clarke Quay',
        transportMode: 'MRT + Cable Car'
      },
      {
        id: 'IT-004-4', packageId: 'TOUR-004', dayNumber: 4,
        title: 'Departure',
        description: 'Final breakfast, optional morning shopping at Orchard Road, airport transfer.',
        activities: [
          { id: 'ACT-004-4-1', name: 'Airport Transfer', description: 'Private transfer to Changi Airport', location: 'Hotel to SIN', durationHours: 0.5, type: 'Transport' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Hotel', description: 'Buffet breakfast' }
        ],
        accommodation: 'N/A — Departure',
        transportMode: 'Private Car'
      }
    ],
    pricing: [
      { id: 'TP-004-A', packageId: 'TOUR-004', priceType: 'Adult', basePrice: 42000, tax: 8400, totalPrice: 50400, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
      { id: 'TP-004-B', packageId: 'TOUR-004', priceType: 'Child (5-11)', basePrice: 30000, tax: 6000, totalPrice: 36000, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
    ],
    availableDates: generateDepartureDates(7, 8),
    supplierCode: 'FLY-TOUR-INT',
    rating: 4.5,
    reviewCount: 325
  },
  {
    id: 'TOUR-005',
    name: 'Thailand Beach & Temple Trail',
    description: "7-day immersive Thailand experience combining Bangkok's golden temples with Pattaya's tropical beaches, floating markets, and vibrant nightlife.",
    destination: 'Bangkok & Pattaya',
    country: 'Thailand',
    durationDays: 7,
    durationNights: 6,
    category: 'Cultural',
    difficulty: 'Easy',
    highlights: [
      'Grand Palace & Wat Phra Kaew',
      'Floating Market boat tour',
      'Pattaya Coral Island snorkeling',
      'Sanctuary of Truth visit',
      'Nong Nooch Tropical Garden',
      'Thai cooking class',
      'Alcazar Cabaret Show'
    ],
    inclusions: [
      '3 nights Bangkok + 3 nights Pattaya hotel',
      'Daily breakfast',
      'Airport transfers',
      'Bangkok temples tour',
      'Floating market trip',
      'Coral Island day trip',
      'Thai cooking class',
      'English-speaking guide',
      'All internal transfers'
    ],
    exclusions: [
      'International flights',
      'Visa on arrival fee',
      'Lunch & dinner (except cooking class)',
      'Personal expenses',
      'Travel insurance',
      'Optional shows'
    ],
    images: ['/tours/thailand-1.jpg', '/tours/thailand-2.jpg'],
    groupSizeMin: 2,
    groupSizeMax: 18,
    departureCity: 'Bangkok',
    languages: ['English', 'Bengali', 'Thai'],
    itinerary: [
      {
        id: 'IT-005-1', packageId: 'TOUR-005', dayNumber: 1,
        title: 'Bangkok Arrival',
        description: 'Arrive at BKK, transfer to hotel, evening street food exploration at Khao San Road.',
        activities: [
          { id: 'ACT-005-1-1', name: 'Airport Transfer', description: 'Private transfer from Suvarnabhumi Airport', location: 'BKK Airport', durationHours: 1, type: 'Transport' },
          { id: 'ACT-005-1-2', name: 'Khao San Road Evening', description: 'Explore the famous backpacker street and try pad thai, mango sticky rice', location: 'Khao San Road', durationHours: 2, type: 'Food & Drink' }
        ],
        meals: [],
        accommodation: 'Centara Grand at Central World',
        transportMode: 'Private Vehicle'
      },
      {
        id: 'IT-005-2', packageId: 'TOUR-005', dayNumber: 2,
        title: 'Bangkok Temple Trail',
        description: 'Full day visiting the Grand Palace, Wat Phra Kaew (Emerald Buddha), Wat Pho (Reclining Buddha), and Wat Arun across the river.',
        activities: [
          { id: 'ACT-005-2-1', name: 'Grand Palace & Wat Phra Kaew', description: 'Thailand\'s most sacred Buddhist temple and former royal residence', location: 'Grand Palace', durationHours: 2.5, type: 'Cultural' },
          { id: 'ACT-005-2-2', name: 'Wat Pho', description: 'Home of the giant Reclining Buddha and traditional Thai massage school', location: 'Wat Pho', durationHours: 1.5, type: 'Cultural' },
          { id: 'ACT-005-2-3', name: 'Wat Arun', description: 'Cross the Chao Phraya River to the iconic Temple of Dawn', location: 'Wat Arun', durationHours: 1.5, type: 'Cultural' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Hotel', description: 'Buffet breakfast' }
        ],
        accommodation: 'Centara Grand at Central World',
        transportMode: 'Private Vehicle + River Boat'
      },
      {
        id: 'IT-005-3', packageId: 'TOUR-005', dayNumber: 3,
        title: 'Floating Market & Cooking Class',
        description: 'Morning at Damnoen Saduak Floating Market, afternoon Thai cooking class.',
        activities: [
          { id: 'ACT-005-3-1', name: 'Floating Market', description: 'Long-tail boat tour through the colorful floating market', location: 'Damnoen Saduak', durationHours: 3, type: 'Cultural' },
          { id: 'ACT-005-3-2', name: 'Thai Cooking Class', description: 'Learn to cook Tom Yum, Green Curry, and Pad Thai', location: 'Bangkok Cooking Studio', durationHours: 3, type: 'Food & Drink' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Hotel', description: 'Buffet breakfast' },
          { type: 'Lunch', venue: 'Cooking Class', description: 'Your own creations!' }
        ],
        accommodation: 'Centara Grand at Central World',
        transportMode: 'Private Vehicle + Long-tail Boat'
      },
      {
        id: 'IT-005-4', packageId: 'TOUR-005', dayNumber: 4,
        title: 'Transfer to Pattaya',
        description: 'Morning transfer to Pattaya, afternoon beach time, evening Walking Street exploration.',
        activities: [
          { id: 'ACT-005-4-1', name: 'Transfer to Pattaya', description: 'Scenic 2-hour drive from Bangkok', location: 'Bangkok to Pattaya', durationHours: 2, type: 'Transport' },
          { id: 'ACT-005-4-2', name: 'Pattaya Beach Afternoon', description: 'Relax at Jomtien Beach', location: 'Jomtien Beach', durationHours: 3, type: 'Relaxation' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Hotel', description: 'Buffet breakfast' }
        ],
        accommodation: 'Hilton Pattaya',
        transportMode: 'Private Vehicle'
      },
      {
        id: 'IT-005-5', packageId: 'TOUR-005', dayNumber: 5,
        title: 'Coral Island Snorkeling',
        description: 'Full day at Coral Island (Koh Larn) with snorkeling, jet skiing, and beachside lunch.',
        activities: [
          { id: 'ACT-005-5-1', name: 'Coral Island Trip', description: 'Speedboat to Koh Larn, snorkeling in crystal-clear waters', location: 'Koh Larn', durationHours: 5, type: 'Adventure' },
          { id: 'ACT-005-5-2', name: 'Water Sports', description: 'Jet skiing, parasailing, and banana boat rides', location: 'Koh Larn', durationHours: 2, type: 'Adventure' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Hotel', description: 'Buffet breakfast' }
        ],
        accommodation: 'Hilton Pattaya',
        transportMode: 'Speedboat'
      },
      {
        id: 'IT-005-6', packageId: 'TOUR-005', dayNumber: 6,
        title: 'Sanctuary of Truth & Nong Nooch Garden',
        description: 'Visit the stunning all-wood Sanctuary of Truth and the beautiful Nong Nooch Tropical Garden with cultural shows.',
        activities: [
          { id: 'ACT-005-6-1', name: 'Sanctuary of Truth', description: 'Marvel at the intricate all-wood carved temple on the coast', location: 'Sanctuary of Truth', durationHours: 2, type: 'Cultural' },
          { id: 'ACT-005-6-2', name: 'Nong Nooch Garden', description: 'Tropical gardens, elephant show, and Thai cultural dance', location: 'Nong Nooch', durationHours: 3, type: 'Sightseeing' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Hotel', description: 'Buffet breakfast' }
        ],
        accommodation: 'Hilton Pattaya',
        transportMode: 'Private Vehicle'
      },
      {
        id: 'IT-005-7', packageId: 'TOUR-005', dayNumber: 7,
        title: 'Departure',
        description: 'Final breakfast, transfer from Pattaya to Bangkok airport.',
        activities: [
          { id: 'ACT-005-7-1', name: 'Airport Transfer', description: 'Transfer from Pattaya to Suvarnabhumi Airport', location: 'Pattaya to BKK', durationHours: 2.5, type: 'Transport' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Hotel', description: 'Buffet breakfast' }
        ],
        accommodation: 'N/A — Departure',
        transportMode: 'Private Vehicle'
      }
    ],
    pricing: [
      { id: 'TP-005-A', packageId: 'TOUR-005', priceType: 'Adult', basePrice: 52000, tax: 10400, totalPrice: 62400, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
      { id: 'TP-005-B', packageId: 'TOUR-005', priceType: 'Child (5-11)', basePrice: 38000, tax: 7600, totalPrice: 45600, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
      { id: 'TP-005-C', packageId: 'TOUR-005', priceType: 'Single Supplement', basePrice: 25000, tax: 5000, totalPrice: 30000, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
    ],
    availableDates: generateDepartureDates(7, 8),
    supplierCode: 'FLY-TOUR-INT',
    rating: 4.6,
    reviewCount: 512
  },
  {
    id: 'TOUR-006',
    name: 'Maldives Island Paradise',
    description: 'A luxurious 5-day all-inclusive Maldives beach resort experience with water villa, snorkeling, dolphin watching, and sunset fishing.',
    destination: 'Maldives',
    country: 'Maldives',
    durationDays: 5,
    durationNights: 4,
    category: 'Beach',
    difficulty: 'Easy',
    highlights: [
      'Overwater villa accommodation',
      'Crystal-clear lagoon snorkeling',
      'Dolphin watching sunset cruise',
      'Traditional Maldivian fishing trip',
      'Private sandbank picnic',
      'All-inclusive dining experience'
    ],
    inclusions: [
      '4 nights overwater villa',
      'All-inclusive meals & beverages',
      'Speedboat airport transfers',
      'Snorkeling equipment',
      'Dolphin sunset cruise',
      'Fishing trip',
      'Sandbank excursion',
      'Non-motorized water sports'
    ],
    exclusions: [
      'International flights',
      'Spa treatments',
      'Motorized water sports',
      'Premium beverages',
      'Travel insurance',
      'Tips'
    ],
    images: ['/tours/maldives-1.jpg', '/tours/maldives-2.jpg'],
    groupSizeMin: 2,
    groupSizeMax: 2,
    departureCity: 'Malé',
    languages: ['English'],
    itinerary: [
      {
        id: 'IT-006-1', packageId: 'TOUR-006', dayNumber: 1,
        title: 'Arrival in Paradise',
        description: 'Arrive at Velana International Airport, speedboat transfer to resort, villa check-in, sunset cocktails.',
        activities: [
          { id: 'ACT-006-1-1', name: 'Speedboat Transfer', description: 'Scenic speedboat ride through turquoise atolls', location: 'Malé to Resort', durationHours: 1, type: 'Transport' },
          { id: 'ACT-006-1-2', name: 'Resort Orientation', description: 'Welcome drink, villa tour, and resort facilities introduction', location: 'Resort', durationHours: 1, type: 'Relaxation' }
        ],
        meals: [
          { type: 'Dinner', venue: 'Beach Restaurant', description: 'Candlelit beach dinner' }
        ],
        accommodation: 'Overwater Villa',
        transportMode: 'Speedboat'
      },
      {
        id: 'IT-006-2', packageId: 'TOUR-006', dayNumber: 2,
        title: 'Lagoon Snorkeling & Island Life',
        description: 'Morning snorkeling in house reef, afternoon at leisure, evening dolphin sunset cruise.',
        activities: [
          { id: 'ACT-006-2-1', name: 'House Reef Snorkeling', description: 'Snorkel among colorful coral and tropical fish', location: 'House Reef', durationHours: 2, type: 'Adventure' },
          { id: 'ACT-006-2-2', name: 'Dolphin Sunset Cruise', description: 'Spot pods of spinner dolphins at golden hour', location: 'Open Ocean', durationHours: 2, type: 'Sightseeing' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Overwater Restaurant', description: 'Floating breakfast in villa' },
          { type: 'Lunch', venue: 'Beach Bar', description: 'Beachside grills' },
          { type: 'Dinner', venue: 'Main Restaurant', description: 'International buffet' }
        ],
        accommodation: 'Overwater Villa',
        transportMode: 'Dhoni Boat'
      },
      {
        id: 'IT-006-3', packageId: 'TOUR-006', dayNumber: 3,
        title: 'Sandbank Picnic & Fishing',
        description: 'Morning excursion to a private sandbank for a champagne picnic. Afternoon traditional line fishing trip.',
        activities: [
          { id: 'ACT-006-3-1', name: 'Private Sandbank Picnic', description: 'Exclusive sandbank with champagne, fruit, and snorkeling', location: 'Private Sandbank', durationHours: 3, type: 'Relaxation' },
          { id: 'ACT-006-3-2', name: 'Traditional Fishing', description: 'Maldivian-style line fishing from a traditional dhoni', location: 'Open Sea', durationHours: 2, type: 'Adventure' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Villa', description: 'In-villa breakfast' },
          { type: 'Lunch', venue: 'Sandbank', description: 'Picnic on the sandbank' },
          { type: 'Dinner', venue: 'Seafood Restaurant', description: 'Fresh catch grilled dinner' }
        ],
        accommodation: 'Overwater Villa',
        transportMode: 'Speedboat + Dhoni'
      },
      {
        id: 'IT-006-4', packageId: 'TOUR-006', dayNumber: 4,
        title: 'Day at Leisure',
        description: 'Full day to enjoy the resort at your own pace. Optional spa, water sports, or simply relax in your overwater villa.',
        activities: [
          { id: 'ACT-006-4-1', name: 'Free Day', description: 'Kayaking, paddleboarding, beach volleyball, or simply relax', location: 'Resort', durationHours: 8, type: 'Relaxation' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Villa', description: 'Floating breakfast' },
          { type: 'Lunch', venue: 'Pool Bar', description: 'Poolside dining' },
          { type: 'Dinner', venue: 'Overwater Restaurant', description: 'Farewell dinner with underwater views' }
        ],
        accommodation: 'Overwater Villa',
        transportMode: 'N/A'
      },
      {
        id: 'IT-006-5', packageId: 'TOUR-006', dayNumber: 5,
        title: 'Departure',
        description: 'Final breakfast, speedboat transfer back to Malé airport.',
        activities: [
          { id: 'ACT-006-5-1', name: 'Airport Transfer', description: 'Speedboat to Velana International Airport', location: 'Resort to Malé', durationHours: 1, type: 'Transport' }
        ],
        meals: [
          { type: 'Breakfast', venue: 'Villa', description: 'Final breakfast' }
        ],
        accommodation: 'N/A — Departure',
        transportMode: 'Speedboat'
      }
    ],
    pricing: [
      { id: 'TP-006-A', packageId: 'TOUR-006', priceType: 'Adult', basePrice: 145000, tax: 29000, totalPrice: 174000, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
      { id: 'TP-006-B', packageId: 'TOUR-006', priceType: 'Child (5-11)', basePrice: 95000, tax: 19000, totalPrice: 114000, currency: 'BDT', seasonType: 'Off-Peak', validFrom: getRelativeDate(0), validTo: getRelativeDate(90) },
    ],
    availableDates: generateDepartureDates(14, 6),
    supplierCode: 'FLY-TOUR-INT',
    rating: 4.9,
    reviewCount: 187
  }
];
