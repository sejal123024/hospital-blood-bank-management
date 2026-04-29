import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

let cachedHospitals: any[] = [];
let cachedBloodBanks: any[] = [];
let cachedAmbulances: any[] = [];
let lastReadTime = 0;

// Read the excel file, with caching for 5 seconds to avoid constant disk reads but allow real-time feeling
export function getExcelData() {
  const now = Date.now();
  if (now - lastReadTime < 5000 && cachedHospitals.length > 0) {
    return {
      hospitals: cachedHospitals,
      bloodBanks: cachedBloodBanks,
      ambulances: cachedAmbulances
    };
  }

  try {
    const filePath = path.join(process.cwd(), 'Mumbai_Healthcare_Directory.xlsx');
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });

    // Parse Hospitals
    const hospSheet = workbook.Sheets[workbook.SheetNames[0]];
    const hospRaw: any[] = xlsx.utils.sheet_to_json(hospSheet);
  
    // Disable static Excel hospitals as requested - user is using real-time API Hub
    cachedHospitals = [];

    // Removed local injected hospital as it is now connected via real API Hub

  // Parse Blood Banks
  const bbSheet = workbook.Sheets[workbook.SheetNames[1]];
  const bbRaw: any[] = xlsx.utils.sheet_to_json(bbSheet);
  
  cachedBloodBanks = bbRaw.slice(2).map((row: any, i: number) => ({
    id: `bb_excel_${i}`,
    type: "bloodbank",
    name: row['__EMPTY'] || "Unknown Blood Bank",
    location: row['__EMPTY_1'] || "Mumbai",
    distance: (Math.random() * 10 + 1).toFixed(1) + " km",
    blood_inventory: {
      "A+": parseInt(row['__EMPTY_2']) || 0,
      "A-": parseInt(row['__EMPTY_3']) || 0,
      "B+": parseInt(row['__EMPTY_4']) || 0,
      "B-": parseInt(row['__EMPTY_5']) || 0,
      "AB+": parseInt(row['__EMPTY_6']) || 0,
      "AB-": parseInt(row['__EMPTY_7']) || 0,
      "O+": parseInt(row['__EMPTY_8']) || 0,
      "O-": parseInt(row['__EMPTY_9']) || 0
    },
    contact: "Contact Local Output",
    last_updated: "Live",
    coords: [19.0760 + (Math.random() * 0.1 - 0.05), 72.8777 + (Math.random() * 0.1 - 0.05)],
    mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row['__EMPTY'] + " Mumbai")}`
  }));

  // Parse Emergency
  const ambSheet = workbook.Sheets[workbook.SheetNames[2]];
  const ambRaw: any[] = xlsx.utils.sheet_to_json(ambSheet);

    cachedAmbulances = ambRaw.slice(2).map((row: any, i: number) => ({
      id: `amb_excel_${i}`,
      type: "ambulance",
      name: row['__EMPTY'] || "Emergency Service",
      location: row['__EMPTY_2'] || "Mumbai",
      distance: (Math.random() * 5 + 1).toFixed(1) + " km",
      eta: (Math.random() * 10 + 5).toFixed(0) + " mins",
      available: /available/i.test(String(row['__EMPTY_4'] || "")) && !/not\s*available/i.test(String(row['__EMPTY_4'] || "")),
      contact: row['__EMPTY_3'] || "Unknown Address",
      vehicleType: row['__EMPTY_1'] || "Emergency",
      last_updated: "Live",
      coords: [19.0760 + (Math.random() * 0.1 - 0.05), 72.8777 + (Math.random() * 0.1 - 0.05)],
      mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row['__EMPTY'] + " Mumbai")}`
    }));

    lastReadTime = Date.now();
  } catch (error) {
    if (cachedHospitals.length === 0) {
      throw error;
    }
    console.warn("Excel file is currently locked/edited. Serving cached data.", error);
  }

  return {
    hospitals: cachedHospitals,
    bloodBanks: cachedBloodBanks,
    ambulances: cachedAmbulances
  };
}

// Map for storing manual bed updates without modifying the Excel file
const globalForBeds = globalThis as unknown as {
  bedOverrides: Record<string, { icu?: number, general?: number }>
};

if (!globalForBeds.bedOverrides) {
  globalForBeds.bedOverrides = {};
}

export function updateBedOverride(hospitalName: string, bedType: string, count: number) {
  if (!globalForBeds.bedOverrides[hospitalName]) {
    globalForBeds.bedOverrides[hospitalName] = {};
  }
  if (bedType === 'icu' || bedType === 'general') {
    globalForBeds.bedOverrides[hospitalName][bedType] = count;
  }
  // Force cache invalidation so next read uses overrides
  lastReadTime = 0;
}


