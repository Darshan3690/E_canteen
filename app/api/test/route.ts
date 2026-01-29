import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const profiles = await prisma.profile.findMany()
  return NextResponse.json(profiles)
}
