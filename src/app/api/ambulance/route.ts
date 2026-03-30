import { NextResponse } from 'next/server';

export async function GET() {
  const ambulancesData = [
    {
      id: "amb_1",
      type: "ambulance",
      name: "City EMS - Unit 42",
      location: "Station 5, Mid-town",
      distance: "1.2 miles",
      eta: "4 mins",
      available: true,
      contact: "Standard 911 Dispatch",
      vehicleType: "Advanced Life Support (ALS)",
      last_updated: "1 min ago",
      coords: [40.7188, -74.0013]
    },
    {
      id: "amb_2",
      type: "ambulance",
      name: "Rapid Care Transport",
      location: "Westside Hospital Depot",
      distance: "3.8 miles",
      eta: "11 mins",
      available: true,
      contact: "555-0899",
      vehicleType: "Basic Life Support (BLS)",
      last_updated: "2 mins ago",
      coords: [40.7350, -74.0150]
    },
    {
      id: "amb_3",
      type: "ambulance",
      name: "AeroMed Helicopter Evac",
      location: "Central Hospital Helipad",
      distance: "5.0 miles",
      eta: "6 mins",
      available: false,
      contact: "555-0900",
      vehicleType: "Air Ambulance",
      last_updated: "Just now",
      coords: [40.7500, -73.9800]
    }
  ];

  return NextResponse.json(ambulancesData);
}
