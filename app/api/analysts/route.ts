import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const analysts = await prisma.analyst.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(analysts)
}
