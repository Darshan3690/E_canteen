import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, name, email } = body


    if (!id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }


    const profile = await prisma.profile.create({
      data: {
        id,
        name,
        email,
        // Role will be set later in select-role page
      },
    })


    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json(
      { error: 'User already exists or DB error' },
      { status: 500 }
    )
  }
}