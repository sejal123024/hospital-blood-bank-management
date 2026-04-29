export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getExcelData } from '@/lib/excelParser';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  try {
    const data = getExcelData();
    return NextResponse.json(data.hospitals, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
