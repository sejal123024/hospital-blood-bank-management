import { NextResponse } from 'next/server';

export async function GET() {
  const bloodBanksData = [
    {
      id: "bb_1",
      type: "bloodbank",
      name: "City Blood Repository",
      location: "Downtown Medical District",
      distance: "1.5 miles",
      blood_inventory: { "A+": "High", "B+": "Adequate", "O-": "Critical", "AB+": "Adequate" },
      contact: "555-0455",
      last_updated: "4 mins ago",
      coords: [40.7208, -74.0073]
    },
    {
      id: "bb_2",
      type: "bloodbank",
      name: "LifeStream Blood Center",
      location: "Eastside Commercial Park",
      distance: "4.2 miles",
      blood_inventory: { "A+": "Adequate", "B+": "High", "O-": "Adequate", "AB+": "Low" },
      contact: "555-0677",
      last_updated: "15 mins ago",
      coords: [40.7400, -73.9850]
    }
  ];

  return NextResponse.json(bloodBanksData);
}
