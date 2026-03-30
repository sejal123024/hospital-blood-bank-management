import { NextResponse } from 'next/server';

export async function GET() {
  const hospitalsData = [
    {
      id: "hosp_1",
      type: "hospital",
      name: "Central Memorial Hospital",
      location: "Downtown Medical District",
      distance: "2.4 miles",
      beds: { icu: 12, general: 145 },
      contact: "555-0192",
      last_updated: "2 mins ago",
      coords: [40.7308, -73.9973]
    },
    {
      id: "hosp_2",
      type: "hospital",
      name: "Westside Trauma Center",
      location: "West Ave, Sector 4",
      distance: "5.1 miles",
      beds: { icu: 0, general: 32 },
      contact: "555-0211",
      last_updated: "10 mins ago",
      coords: [40.7100, -74.0150]
    },
    {
      id: "hosp_3",
      type: "hospital",
      name: "St. John's Regional",
      location: "Northern Suburbs",
      distance: "8.7 miles",
      beds: { icu: 4, general: 88 },
      contact: "555-0304",
      last_updated: "1 min ago",
      coords: [40.7505, -73.9934]
    }
  ];

  return NextResponse.json(hospitalsData);
}
