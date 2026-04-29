import { NextResponse } from 'next/server';
import { updateBedOverride, getExcelData } from '@/lib/excelParser';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(`[API] Raw POST body received:`, body);
    
    const { hospital, bed_type, field, value } = body;

    if (!hospital || !bed_type || value === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400, headers: corsHeaders });
    }

    const typeLower = bed_type.toLowerCase();
    console.log(`[API] Parsed bed update: ${hospital} - ${typeLower} (${field}) changed to ${value}`);

    if (field === 'available' || field === 'total') {
      if (typeLower === 'icu' || typeLower === 'general') {
         updateBedOverride(hospital, typeLower, parseInt(value));
      }
    }

    // Read the fresh data
    getExcelData();

    return NextResponse.json({ success: true, message: 'Bed updated successfully' }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Update beds error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
