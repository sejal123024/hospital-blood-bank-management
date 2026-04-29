import { create } from 'zustand';

export interface BaseResource {
  id: string;
  name: string;
  location: string;
  distance: string;
  contact: string;
  last_updated: string;
  coords: [number, number];
  mapLink?: string;
}

export interface Hospital extends BaseResource {
  type: 'hospital';
  beds: {
    icu: { total: number; available: number };
    general: { total: number; available: number };
    emergency: { total: number; available: number };
    pediatric: { total: number; available: number };
    oxygen: { total: number; available: number };
    ventilator: { total: number; available: number };
  };
}

export interface BloodBank extends BaseResource {
  type: 'bloodbank';
  blood_inventory: {
    "A+": string | number;
    "A-": string | number;
    "B+": string | number;
    "B-": string | number;
    "AB+": string | number;
    "AB-": string | number;
    "O+": string | number;
    "O-": string | number;
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

      const res = await fetch(`${endpoint}?t=${Date.now()}`, { cache: 'no-store' });
      let data = await res.json();

      // Inject Central Hub connected APIs if searching for hospitals
      if (service === 'hospitals' || service === 'icu') {
        try {
          const hubData = localStorage.getItem("hospital_hub_connections");
          if (hubData) {
            const connections = JSON.parse(hubData);
            const activeConnections = connections.filter((c: any) => c.lastStatus === "online" || c.lastData);
            
            // Fetch live data for all active connections in parallel!
            const livePromises = activeConnections.map(async (c: any) => {
              try {
                const proxyRes = await fetch(`/api/hub-proxy`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ url: c.url, apiKey: c.apiKey })
                });
                
                if (proxyRes.ok) {
                  const liveJson = await proxyRes.json();
                  const liveData = liveJson.data || liveJson;
                  return {
                    id: `hub-${c.id}`,
                    name: liveData.hospital || c.name,
                    location: liveData.location || "Remote API Connection",
                    distance: "Live Sync",
                    contact: liveData.helpline || "-",
                    last_updated: liveData.last_updated || new Date().toISOString(),
                    coords: [19.0760 + (Math.random()*0.02 - 0.01), 72.8777 + (Math.random()*0.02 - 0.01)] as [number, number],
                    mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((liveData.hospital || c.name) + " " + (liveData.location || ""))}`,
                    type: 'hospital' as const,
                    beds: {
                      icu: { 
                        total: liveData.beds?.icu?.total ?? 0, 
                        available: liveData.beds?.icu?.available ?? liveData.icu_beds ?? 0 
                      },
                      general: { 
                        total: liveData.beds?.general?.total ?? liveData.total_beds ?? 0, 
                        available: liveData.beds?.general?.available ?? liveData.total_available ?? 0 
                      },
                      emergency: { 
                        total: liveData.beds?.emergency?.total ?? 0, 
                        available: liveData.beds?.emergency?.available ?? 0 
                      },
                      pediatric: { 
                        total: liveData.beds?.pediatric?.total ?? 0, 
                        available: liveData.beds?.pediatric?.available ?? 0 
                      },
                      oxygen: { 
                        total: liveData.beds?.oxygen?.total ?? 0, 
                        available: liveData.beds?.oxygen?.available ?? 0 
                      },
                      ventilator: { 
                        total: liveData.beds?.ventilator?.total ?? 0, 
                        available: liveData.beds?.ventilator?.available ?? 0 
                      }
                    }
                  };
                }
              } catch (e) {
                console.warn("Live fetch failed for", c.url);
              }
              return null;
            });

            const resolvedLiveHospitals = await Promise.all(livePromises);
            const activeHubHospitals = resolvedLiveHospitals.filter(h => h !== null);
              
            data = [...data, ...activeHubHospitals];
          }
        } catch (e) {
          console.error("Failed to inject hub hospitals", e);
        }
      }

      set({ searchResults: data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      set({ isLoading: false });
    }
  }
}));
