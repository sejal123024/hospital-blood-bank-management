export interface Hospital {
  id: string;
  name: string;
  location: string;
  distance: string;
  beds: {
    icu: number;
    general: number;
  };
  contact: string;
  last_updated: string;
}

export interface BloodBank {
  id: string;
  name: string;
  location: string;
  distance: string;
  blood_inventory: {
    "A+": string;
    "B+": string;
    "O-": string;
    "AB+": string;
  };
  contact: string;
  last_updated: string;
}

export interface Ambulance {
  id: string;
  name: string;
  location: string;
  distance: string;
  eta: string;
  available: boolean;
  contact: string;
  type: string;
}

export type CategoryData = Hospital | BloodBank | Ambulance;

export const hospitalsData: Hospital[] = [
  {
    id: "hosp_1",
    name: "Central Memorial Hospital",
    location: "Downtown Medical District",
    distance: "2.4 miles",
    beds: { icu: 12, general: 145 },
    contact: "555-0192",
    last_updated: "2 mins ago"
  },
  {
    id: "hosp_2",
    name: "Westside Trauma Center",
    location: "West Ave, Sector 4",
    distance: "5.1 miles",
    beds: { icu: 0, general: 32 },
    contact: "555-0211",
    last_updated: "10 mins ago"
  },
  {
    id: "hosp_3",
    name: "St. John's Regional",
    location: "Northern Suburbs",
    distance: "8.7 miles",
    beds: { icu: 4, general: 88 },
    contact: "555-0304",
    last_updated: "1 min ago"
  }
];

export const bloodBanksData: BloodBank[] = [
  {
    id: "bb_1",
    name: "City Blood Repository",
    location: "Downtown Medical District",
    distance: "1.5 miles",
    blood_inventory: { "A+": "High", "B+": "Adequate", "O-": "Critical", "AB+": "Adequate" },
    contact: "555-0455",
    last_updated: "4 mins ago"
  },
  {
    id: "bb_2",
    name: "LifeStream Blood Center",
    location: "Eastside Commercial Park",
    distance: "4.2 miles",
    blood_inventory: { "A+": "Adequate", "B+": "High", "O-": "Adequate", "AB+": "Low" },
    contact: "555-0677",
    last_updated: "15 mins ago"
  }
];

export const ambulancesData: Ambulance[] = [
  {
    id: "amb_1",
    name: "City EMS - Unit 42",
    location: "Station 5, Mid-town",
    distance: "1.2 miles",
    eta: "4 mins",
    available: true,
    contact: "Standard 911 Dispatch",
    type: "Advanced Life Support (ALS)"
  },
  {
    id: "amb_2",
    name: "Rapid Care Transport",
    location: "Westside Hospital Depot",
    distance: "3.8 miles",
    eta: "11 mins",
    available: true,
    contact: "555-0899",
    type: "Basic Life Support (BLS)"
  },
  {
    id: "amb_3",
    name: "AeroMed Helicopter Evac",
    location: "Central Hospital Helipad",
    distance: "5.0 miles",
    eta: "6 mins",
    available: false,
    contact: "555-0900",
    type: "Air Ambulance"
  }
];

// Async mock fetcher to simulate API
// Usage: GET /api/search?type=hospital
export async function searchResources(type: string): Promise<CategoryData[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (type === "hospitals" || type === "icu") {
        resolve(hospitalsData);
      } else if (type === "blood") {
        resolve(bloodBanksData);
      } else if (type === "ambulance" || type === "emergency") {
        resolve(ambulancesData);
      } else {
        resolve([]);
      }
    }, 600); // simulate network delay
  });
}
