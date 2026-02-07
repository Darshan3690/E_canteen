import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Simple connectivity check against Postgres
    const result = await prisma.$queryRaw`SELECT 1 as ok`
    return NextResponse.json({ connected: true, result }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { connected: false, error: error?.message ?? 'Unknown error' },
      { status: 500 }
    )
  }
}
