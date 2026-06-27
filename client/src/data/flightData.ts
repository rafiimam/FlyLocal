// ─── Flight Domain Data ─────────────────────────────────────────────
// All flight-related interfaces and mock data for the B2B travel platform.
// Future: Replace mock data with API calls to GDS providers.

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  code: string;
  name: string;
  color: string;
}

export interface FlightSegment {
  flightNumber: string;
  airlineCode: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraft: string;
  baggage: string;
}

export interface Flight {
  id: string;
  airlineCode: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  layovers: string[];
  basePrice: number;
  tax: number;
  refundable: boolean;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  seatsLeft: number;
  baggage: string;
  fareRule: string;
  segments: FlightSegment[];
}

// ─── Static Reference Data ──────────────────────────────────────────

export const AIRPORTS: Airport[] = [
  { code: 'DAC', name: 'Hazrat Shahjalal International Airport', city: 'Dhaka', country: 'Bangladesh' },
  { code: 'CGP', name: 'Shah Amanat International Airport', city: 'Chittagong', country: 'Bangladesh' },
  { code: 'CXB', name: "Cox's Bazar Airport", city: "Cox's Bazar", country: 'Bangladesh' },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates' },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia' },
];

export const AIRLINES: Airline[] = [
  { code: 'EK', name: 'Emirates', color: 'from-red-600 to-red-800' },
  { code: 'QR', name: 'Qatar Airways', color: 'from-purple-800 to-amber-900' },
  { code: 'BG', name: 'Biman Bangladesh Airlines', color: 'from-green-600 to-red-600' },
  { code: 'SQ', name: 'Singapore Airlines', color: 'from-yellow-500 to-blue-900' },
  { code: 'TK', name: 'Turkish Airlines', color: 'from-red-500 to-slate-900' },
  { code: 'MH', name: 'Malaysia Airlines', color: 'from-blue-600 to-red-500' },
  { code: 'EY', name: 'Etihad Airways', color: 'from-amber-600 to-stone-800' },
];

// ─── Helper: Relative Date Generator ────────────────────────────────

const getRelativeDateTime = (daysOffset: number, hoursOffset: number, minutesOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hoursOffset);
  date.setMinutes(minutesOffset);
  date.setSeconds(0);
  return date.toISOString();
};

// ─── Mock Flights ───────────────────────────────────────────────────

export const FLIGHTS: Flight[] = [
  // Dhaka -> Dubai (Direct and Stops)
  {
    id: 'FL-001',
    airlineCode: 'EK',
    flightNumber: 'EK-585',
    departureAirport: 'DAC',
    arrivalAirport: 'DXB',
    departureTime: getRelativeDateTime(1, 10, 15),
    arrivalTime: getRelativeDateTime(1, 13, 30),
    duration: '5h 15m',
    stops: 0,
    layovers: [],
    basePrice: 42000,
    tax: 8500,
    refundable: true,
    cabinClass: 'Economy',
    seatsLeft: 9,
    baggage: '35 Kg + 7 Kg Cabin',
    fareRule: 'Refundable with BDT 3,500 penalty. Date change fee BDT 2,000.',
    segments: [
      {
        flightNumber: 'EK-585',
        airlineCode: 'EK',
        departureAirport: 'DAC',
        arrivalAirport: 'DXB',
        departureTime: getRelativeDateTime(1, 10, 15),
        arrivalTime: getRelativeDateTime(1, 13, 30),
        duration: '5h 15m',
        aircraft: 'Boeing 777-300ER',
        baggage: '35 Kg',
      }
    ]
  },
  {
    id: 'FL-002',
    airlineCode: 'BG',
    flightNumber: 'BG-347',
    departureAirport: 'DAC',
    arrivalAirport: 'DXB',
    departureTime: getRelativeDateTime(1, 18, 30),
    arrivalTime: getRelativeDateTime(1, 22, 0),
    duration: '5h 30m',
    stops: 0,
    layovers: [],
    basePrice: 38000,
    tax: 7900,
    refundable: false,
    cabinClass: 'Economy',
    seatsLeft: 14,
    baggage: '30 Kg + 7 Kg Cabin',
    fareRule: 'Non-Refundable. Date change fee BDT 4,500.',
    segments: [
      {
        flightNumber: 'BG-347',
        airlineCode: 'BG',
        departureAirport: 'DAC',
        arrivalAirport: 'DXB',
        departureTime: getRelativeDateTime(1, 18, 30),
        arrivalTime: getRelativeDateTime(1, 22, 0),
        duration: '5h 30m',
        aircraft: 'Boeing 787-8 Dreamliner',
        baggage: '30 Kg',
      }
    ]
  },
  {
    id: 'FL-003',
    airlineCode: 'QR',
    flightNumber: 'QR-641',
    departureAirport: 'DAC',
    arrivalAirport: 'DXB',
    departureTime: getRelativeDateTime(1, 3, 45),
    arrivalTime: getRelativeDateTime(1, 10, 15),
    duration: '8h 30m',
    stops: 1,
    layovers: ['DOH'],
    basePrice: 48000,
    tax: 9200,
    refundable: true,
    cabinClass: 'Economy',
    seatsLeft: 5,
    baggage: '35 Kg + 7 Kg Cabin',
    fareRule: 'Refundable with BDT 4,000 penalty. Date change fee BDT 2,500.',
    segments: [
      {
        flightNumber: 'QR-641',
        airlineCode: 'QR',
        departureAirport: 'DAC',
        arrivalAirport: 'DOH',
        departureTime: getRelativeDateTime(1, 3, 45),
        arrivalTime: getRelativeDateTime(1, 6, 30),
        duration: '4h 45m',
        aircraft: 'Airbus A350-900',
        baggage: '35 Kg',
      },
      {
        flightNumber: 'QR-1018',
        airlineCode: 'QR',
        departureAirport: 'DOH',
        arrivalAirport: 'DXB',
        departureTime: getRelativeDateTime(1, 9, 0),
        arrivalTime: getRelativeDateTime(1, 10, 15),
        duration: '1h 15m',
        aircraft: 'Boeing 777-300ER',
        baggage: '35 Kg',
      }
    ]
  },

  // Dhaka -> London (LHR)
  {
    id: 'FL-004',
    airlineCode: 'BG',
    flightNumber: 'BG-201',
    departureAirport: 'DAC',
    arrivalAirport: 'LHR',
    departureTime: getRelativeDateTime(2, 11, 30),
    arrivalTime: getRelativeDateTime(2, 18, 45),
    duration: '12h 15m',
    stops: 1,
    layovers: ['Sylhet (ZYL)'],
    basePrice: 75000,
    tax: 15400,
    refundable: true,
    cabinClass: 'Economy',
    seatsLeft: 7,
    baggage: '40 Kg + 7 Kg Cabin',
    fareRule: 'Refundable with penalty BDT 5,000.',
    segments: [
      {
        flightNumber: 'BG-201',
        airlineCode: 'BG',
        departureAirport: 'DAC',
        arrivalAirport: 'ZYL',
        departureTime: getRelativeDateTime(2, 11, 30),
        arrivalTime: getRelativeDateTime(2, 12, 15),
        duration: '0h 45m',
        aircraft: 'Boeing 787-9',
        baggage: '40 Kg',
      },
      {
        flightNumber: 'BG-201',
        airlineCode: 'BG',
        departureAirport: 'ZYL',
        arrivalAirport: 'LHR',
        departureTime: getRelativeDateTime(2, 13, 30),
        arrivalTime: getRelativeDateTime(2, 18, 45),
        duration: '10h 15m',
        aircraft: 'Boeing 787-9',
        baggage: '40 Kg',
      }
    ]
  },
  {
    id: 'FL-005',
    airlineCode: 'QR',
    flightNumber: 'QR-639',
    departureAirport: 'DAC',
    arrivalAirport: 'LHR',
    departureTime: getRelativeDateTime(2, 19, 40),
    arrivalTime: getRelativeDateTime(3, 6, 25),
    duration: '15h 45m',
    stops: 1,
    layovers: ['DOH'],
    basePrice: 82000,
    tax: 18900,
    refundable: true,
    cabinClass: 'Economy',
    seatsLeft: 4,
    baggage: '35 Kg + 7 Kg Cabin',
    fareRule: 'Refundable. Penalty BDT 3,000.',
    segments: [
      {
        flightNumber: 'QR-639',
        airlineCode: 'QR',
        departureAirport: 'DAC',
        arrivalAirport: 'DOH',
        departureTime: getRelativeDateTime(2, 19, 40),
        arrivalTime: getRelativeDateTime(2, 22, 35),
        duration: '4h 55m',
        aircraft: 'Boeing 777-300ER',
        baggage: '35 Kg',
      },
      {
        flightNumber: 'QR-003',
        airlineCode: 'QR',
        departureAirport: 'DOH',
        arrivalAirport: 'LHR',
        departureTime: getRelativeDateTime(3, 1, 15),
        arrivalTime: getRelativeDateTime(3, 6, 25),
        duration: '7h 10m',
        aircraft: 'Airbus A380-800',
        baggage: '35 Kg',
      }
    ]
  },
  {
    id: 'FL-006',
    airlineCode: 'EK',
    flightNumber: 'EK-587',
    departureAirport: 'DAC',
    arrivalAirport: 'LHR',
    departureTime: getRelativeDateTime(2, 19, 30),
    arrivalTime: getRelativeDateTime(3, 7, 20),
    duration: '16h 50m',
    stops: 1,
    layovers: ['DXB'],
    basePrice: 195000,
    tax: 32000,
    refundable: true,
    cabinClass: 'Business',
    seatsLeft: 2,
    baggage: '45 Kg + 14 Kg Cabin',
    fareRule: 'Fully Refundable before departure.',
    segments: [
      {
        flightNumber: 'EK-587',
        airlineCode: 'EK',
        departureAirport: 'DAC',
        arrivalAirport: 'DXB',
        departureTime: getRelativeDateTime(2, 19, 30),
        arrivalTime: getRelativeDateTime(2, 22, 50),
        duration: '5h 20m',
        aircraft: 'Boeing 777-300ER',
        baggage: '45 Kg',
      },
      {
        flightNumber: 'EK-029',
        airlineCode: 'EK',
        departureAirport: 'DXB',
        arrivalAirport: 'LHR',
        departureTime: getRelativeDateTime(3, 2, 40),
        arrivalTime: getRelativeDateTime(3, 7, 20),
        duration: '7h 40m',
        aircraft: 'Airbus A380-800',
        baggage: '45 Kg',
      }
    ]
  },

  // Dhaka -> Singapore (SIN)
  {
    id: 'FL-007',
    airlineCode: 'SQ',
    flightNumber: 'SQ-449',
    departureAirport: 'DAC',
    arrivalAirport: 'SIN',
    departureTime: getRelativeDateTime(1, 12, 40),
    arrivalTime: getRelativeDateTime(1, 18, 55),
    duration: '4h 15m',
    stops: 0,
    layovers: [],
    basePrice: 38000,
    tax: 9100,
    refundable: true,
    cabinClass: 'Economy',
    seatsLeft: 12,
    baggage: '30 Kg + 7 Kg Cabin',
    fareRule: 'Refundable with penalty BDT 4,000.',
    segments: [
      {
        flightNumber: 'SQ-449',
        airlineCode: 'SQ',
        departureAirport: 'DAC',
        arrivalAirport: 'SIN',
        departureTime: getRelativeDateTime(1, 12, 40),
        arrivalTime: getRelativeDateTime(1, 18, 55),
        duration: '4h 15m',
        aircraft: 'Airbus A350-900',
        baggage: '30 Kg',
      }
    ]
  },
  {
    id: 'FL-008',
    airlineCode: 'SQ',
    flightNumber: 'SQ-447',
    departureAirport: 'DAC',
    arrivalAirport: 'SIN',
    departureTime: getRelativeDateTime(1, 23, 50),
    arrivalTime: getRelativeDateTime(2, 6, 0),
    duration: '4h 10m',
    stops: 0,
    layovers: [],
    basePrice: 112000,
    tax: 15600,
    refundable: true,
    cabinClass: 'Business',
    seatsLeft: 4,
    baggage: '40 Kg + 14 Kg Cabin',
    fareRule: 'Refundable with BDT 2,000 penalty.',
    segments: [
      {
        flightNumber: 'SQ-447',
        airlineCode: 'SQ',
        departureAirport: 'DAC',
        arrivalAirport: 'SIN',
        departureTime: getRelativeDateTime(1, 23, 50),
        arrivalTime: getRelativeDateTime(2, 6, 0),
        duration: '4h 10m',
        aircraft: 'Boeing 787-10',
        baggage: '40 Kg',
      }
    ]
  },

  // Dhaka -> Chittagong (Domestic)
  {
    id: 'FL-009',
    airlineCode: 'BG',
    flightNumber: 'BG-411',
    departureAirport: 'DAC',
    arrivalAirport: 'CGP',
    departureTime: getRelativeDateTime(1, 7, 30),
    arrivalTime: getRelativeDateTime(1, 8, 20),
    duration: '0h 50m',
    stops: 0,
    layovers: [],
    basePrice: 4200,
    tax: 800,
    refundable: true,
    cabinClass: 'Economy',
    seatsLeft: 22,
    baggage: '20 Kg + 7 Kg Cabin',
    fareRule: 'Refundable. Change fee BDT 1,000.',
    segments: [
      {
        flightNumber: 'BG-411',
        airlineCode: 'BG',
        departureAirport: 'DAC',
        arrivalAirport: 'CGP',
        departureTime: getRelativeDateTime(1, 7, 30),
        arrivalTime: getRelativeDateTime(1, 8, 20),
        duration: '0h 50m',
        aircraft: 'Dash 8-Q400',
        baggage: '20 Kg',
      }
    ]
  },
  {
    id: 'FL-010',
    airlineCode: 'BG',
    flightNumber: 'BG-435',
    departureAirport: 'DAC',
    arrivalAirport: 'CXB',
    departureTime: getRelativeDateTime(1, 10, 30),
    arrivalTime: getRelativeDateTime(1, 11, 35),
    duration: '1h 05m',
    stops: 0,
    layovers: [],
    basePrice: 5100,
    tax: 900,
    refundable: false,
    cabinClass: 'Economy',
    seatsLeft: 18,
    baggage: '20 Kg + 7 Kg Cabin',
    fareRule: 'Non-Refundable. Date change fee BDT 1,500.',
    segments: [
      {
        flightNumber: 'BG-435',
        airlineCode: 'BG',
        departureAirport: 'DAC',
        arrivalAirport: 'CXB',
        departureTime: getRelativeDateTime(1, 10, 30),
        arrivalTime: getRelativeDateTime(1, 11, 35),
        duration: '1h 05m',
        aircraft: 'Dash 8-Q400',
        baggage: '20 Kg',
      }
    ]
  }
];
