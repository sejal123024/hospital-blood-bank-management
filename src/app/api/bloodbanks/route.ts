export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getExcelData } from '@/lib/excelParser';

export async function GET() {
  try {
    const data = getExcelData();
    return NextResponse.json(data.bloodBanks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
