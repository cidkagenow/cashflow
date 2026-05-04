import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const templates = await prisma.automationTemplate.findMany()
  return NextResponse.json(templates)
}

export async function POST(request: Request) {
  const body = await request.json()
  const template = await prisma.automationTemplate.create({ data: body })
  return NextResponse.json(template, { status: 201 })
}
