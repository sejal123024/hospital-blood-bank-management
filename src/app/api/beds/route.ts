import { NextResponse } from 'next/server';
import { getExcelData } from '@/lib/excelParser';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
};

export async function GET() {
  try {
    const data = getExcelData();
    // Assuming the Vercel dashboard targets 'Mumbai City Care Hospital' or similar.
    const targetHospital = data.hospitals.find((h: any) => h.name.includes("Mumbai City Care Hospital")) || data.hospitals[0];

    // Build the expected format
    const responseData = {
      hospital: targetHospital?.name || "Mumbai City Care Hospital",
      location: targetHospital?.location || "Mumbai",
      icu_beds: targetHospital?.beds?.icu || 0,
      icu_beds_total: 20, 
      general_beds: targetHospital?.beds?.general || 0,
      general_beds_total: 50,
      last_updated: new Date().toISOString()
    };

    return NextResponse.json({ success: true, data: responseData }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
