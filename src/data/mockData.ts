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
  coords: [number, number];
  mapLink: string;
  type?: string;
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
  coords: [number, number];
  mapLink: string;
  type?: string;
}

export interface Ambulance {
  id: string;
  name: string;
  location: string;
  distance: string;
  eta: string;
  available: boolean;
  contact: string;
  vehicleType: string;
  last_updated: string;
  coords: [number, number];
  mapLink: string;
  type?: string;
}

export type CategoryData = Hospital | BloodBank | Ambulance;

export const hospitalsData: Hospital[] = [
  {
    id: "hosp_1",
    type: "hospital",
    name: "Lilavati Hospital and Research Centre",
    location: "Bandra West, Mumbai",
    distance: "2.4 km",
    beds: { icu: 15, general: 120 },
    contact: "022-2666-6666",
    last_updated: "2 mins ago",
    coords: [19.0507, 72.8285],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Lilavati+Hospital,+Mumbai"
  },
  {
    id: "hosp_2",
    type: "hospital",
    name: "Kokilaben Dhirubhai Ambani Hospital",
    location: "Andheri West, Mumbai",
    distance: "5.1 km",
    beds: { icu: 5, general: 80 },
    contact: "022-3099-9999",
    last_updated: "10 mins ago",
    coords: [19.1311, 72.8251],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Kokilaben+Dhirubhai+Ambani+Hospital,+Mumbai"
  },
  {
    id: "hosp_3",
    type: "hospital",
    name: "Hinduja Hospital",
    location: "Mahim West, Mumbai",
    distance: "8.7 km",
    beds: { icu: 8, general: 150 },
    contact: "022-2445-1515",
    last_updated: "1 min ago",
    coords: [19.0344, 72.8398],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Hinduja+Hospital,+Mumbai"
  },
  {
    id: "hosp_4",
    type: "hospital",
    name: "Nanavati Super Speciality Hospital",
    location: "Vile Parle West, Mumbai",
    distance: "3.2 km",
    beds: { icu: 2, general: 45 },
    contact: "022-2626-7500",
    last_updated: "5 mins ago",
    coords: [19.0963, 72.8399],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Nanavati+Super+Speciality+Hospital,+Mumbai"
  },
  {
    id: "hosp_5",
    type: "hospital",
    name: "Breach Candy Hospital",
    location: "Breach Candy, Mumbai",
    distance: "12.5 km",
    beds: { icu: 10, general: 200 },
    contact: "022-2366-7788",
    last_updated: "Just now",
    coords: [18.9715, 72.8051],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Breach+Candy+Hospital,+Mumbai"
  }
];

export const bloodBanksData: BloodBank[] = [
  {
    id: "bb_1",
    type: "bloodbank",
    name: "Mahatma Gandhi Blood Bank",
    location: "Bandra West, Mumbai",
    distance: "1.5 km",
    blood_inventory: { "A+": "High", "B+": "Adequate", "O-": "Critical", "AB+": "Adequate" },
    contact: "022-2642-2222",
    last_updated: "4 mins ago",
    coords: [19.0551, 72.8360],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Mahatma+Gandhi+Blood+Bank,+Mumbai"
  },
  {
    id: "bb_2",
    type: "bloodbank",
    name: "Bombay City Red Cross Blood Bank",
    location: "Fort, Mumbai",
    distance: "14.2 km",
    blood_inventory: { "A+": "Adequate", "B+": "High", "O-": "Adequate", "AB+": "Low" },
    contact: "022-2266-1234",
    last_updated: "15 mins ago",
    coords: [18.9322, 72.8317],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Bombay+City+Red+Cross+Blood+Bank,+Mumbai"
  },
  {
    id: "bb_3",
    type: "bloodbank",
    name: "Tata Memorial Blood Bank",
    location: "Parel, Mumbai",
    distance: "9.2 km",
    blood_inventory: { "A+": "Adequate", "B+": "Critical", "O-": "Adequate", "AB+": "Adequate" },
    contact: "022-2417-7000",
    last_updated: "1 min ago",
    coords: [19.0068, 72.8443],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Tata+Memorial+Blood+Bank,+Mumbai"
  }
];

export const ambulancesData: Ambulance[] = [
  {
    id: "amb_1",
    type: "ambulance",
    name: "108 Mumbai Emergency Services",
    location: "Dadar, Mumbai",
    distance: "1.2 km",
    eta: "4 mins",
    available: true,
    contact: "108",
    vehicleType: "Advanced Life Support (ALS)",
    last_updated: "1 min ago",
    coords: [19.0178, 72.8437],
    mapLink: "https://www.google.com/maps/search/?api=1&query=108+Mumbai+Emergency+Services"
  },
  {
    id: "amb_2",
    type: "ambulance",
    name: "Helitroop Air Ambulance",
    location: "Juhu Airport, Mumbai",
    distance: "6.8 km",
    eta: "11 mins",
    available: true,
    contact: "022-2661-1234",
    vehicleType: "Air Ambulance",
    last_updated: "2 mins ago",
    coords: [19.0975, 72.8282],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Helitroop+Air+Ambulance+Mumbai"
  },
  {
    id: "amb_3",
    type: "ambulance",
    name: "Ziqitza Health Care Limited",
    location: "Andheri East, Mumbai",
    distance: "5.0 km",
    eta: "6 mins",
    available: false,
    contact: "022-1234-5678",
    vehicleType: "Basic Life Support (BLS)",
    last_updated: "Just now",
    coords: [19.1136, 72.8697],
    mapLink: "https://www.google.com/maps/search/?api=1&query=Ziqitza+Health+Care+Limited+Mumbai"
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
