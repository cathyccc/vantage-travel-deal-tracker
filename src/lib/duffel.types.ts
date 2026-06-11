export interface DuffelSlice {
  id: string;
  duration: string;
  segments: DuffelSegment[];
  origin: DuffelLocation;
  destination: DuffelLocation;
  fare_brand_name?: string | null;
  marketing_carrier_flight_number: string | null;
}

export interface DuffelSegment {
  origin_terminal: string;
  destination_terminal: string;
  aircraft: string | null;
  departing_at: string;
  arriving_at: string;
  operating_carrier: DuffelCarrier;
  marketing_carrier: DuffelCarrier;
  passengers: DuffelPassenger[];
  duration: string;
  destination: DuffelLocation;
  origin: DuffelLocation;
}

export interface DuffelCarrier {
  name: string;
  id: string;
  logo_symbol_url: string;
}

export interface DuffelPassenger {
  id: string;
  type: "adult" | "child" | "infant_without_seat";
  age: string;
  baggages: Array<{ type: "checked" | "carry_on", quantity: number }>;
  cabin_class_marketing_name: string;
  cabin: {
    amenities: DuffelAmenities,
    cabin_class: "business" | "economy"
  };
}

export interface DuffelAmenities {
  wifi: { cost: "paid" | "free" | "n/a", available: boolean },
  seat: { type: string, legroom: "standard" | "more" | "n/a" },
  power: { available: boolean }
}

export interface DuffelLocation {
  city_name: string;
  time_zone: string;
  name: string;
  iata_code: string;
}

export interface DuffelOffer {
  id: string;
  total_amount: string;
  total_currency: string;
  slices: DuffelSlice[];
  cabin_class_marketing_name: string;
  cabin_class_marketing_name_long: string;
  booking_conditions: {
    refundable: boolean;
    change_penalties: boolean;
    cancellation_penalties: boolean;
  }
  passengers: DuffelPassenger[];
}