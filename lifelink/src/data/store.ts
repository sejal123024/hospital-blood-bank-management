import { create } from 'zustand';

export interface BaseResource {
  id: string;
  name: string;
  location: string;
  distance: string;
  contact: string;
  last_updated: string;
  coords: [number, number];
}

export interface Hospital extends BaseResource {
  type: 'hospital';
  beds: {
    icu: number;
    general: number;
  };
}

export interface BloodBank extends BaseResource {
  type: 'bloodbank';
  blood_inventory: {
    "A+": string;
    "B+": string;
    "O-": string;
    "AB+": string;
  };
}

export interface Ambulance extends BaseResource {
  type: 'ambulance';
  eta: string;
  available: boolean;
  vehicleType: string;
}

export type ResourceData = Hospital | BloodBank | Ambulance;

interface StoreState {
  searchResults: ResourceData[];
  selectedService: string;
  isLoading: boolean;
  setSearchResults: (results: ResourceData[]) => void;
  setSelectedService: (service: string) => void;
  fetchData: (service: string) => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  searchResults: [],
  selectedService: 'hospitals',
  isLoading: false,
  setSearchResults: (results) => set({ searchResults: results }),
  setSelectedService: (service) => set({ selectedService: service }),
  fetchData: async (service) => {
    set({ isLoading: true, selectedService: service, searchResults: [] });
    try {
      let endpoint = '';
      if (service === 'hospitals' || service === 'icu') {
        endpoint = '/api/hospitals';
      } else if (service === 'blood') {
        endpoint = '/api/bloodbanks';
      } else if (service === 'ambulance' || service === 'emergency') {
        endpoint = '/api/ambulance';
      }
      
      if (!endpoint) {
        set({ isLoading: false });
        return;
      }

      const res = await fetch(endpoint);
      const data = await res.json();
      set({ searchResults: data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      set({ isLoading: false });
    }
  }
}));
